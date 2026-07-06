import SwupPreloadPlugin from "https://unpkg.com/@swup/preload-plugin@3?module";
import Swup from "https://unpkg.com/swup@4?module";

const config = window.__BLOG_CONFIG__ || {};
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function setTheme(theme) {
	localStorage.setItem("theme", theme);
	const dark =
		theme === "dark" ||
		(theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", dark);
}

function initPanels() {
	const panels = [
		["search-switch", "search-panel"],
		["display-settings-switch", "display-setting"],
		["nav-menu-switch", "nav-menu-panel"],
	];
	for (const [buttonId, panelId] of panels) {
		const button = qs(`#${buttonId}`);
		const panel = qs(`#${panelId}`);
		if (!button || !panel) continue;
		button.onclick = (event) => {
			event.stopPropagation();
			panel.classList.toggle("float-panel-closed");
			if (panelId === "search-panel") qs("#search-input")?.focus();
		};
	}
	document.addEventListener("click", (event) => {
		for (const [, panelId] of panels) {
			const panel = qs(`#${panelId}`);
			const related =
				panelId === "search-panel" && event.target.closest?.("#search-bar");
			if (panel && !panel.contains(event.target) && !related)
				panel.classList.add("float-panel-closed");
		}
	});
}

function initThemeControls() {
	qs("#scheme-switch")?.addEventListener("click", () => {
		setTheme(
			document.documentElement.classList.contains("dark") ? "light" : "dark",
		);
	});
	const hue = qs("#colorSlider");
	const hueValue = qs("#hue-value");
	const hueReset = qs("#hue-reset");
	const defaultHue = String(config.hue || "270");
	if (hue) {
		hue.value = localStorage.getItem("hue") || defaultHue;
		if (hueValue) hueValue.textContent = hue.value;
		hueReset?.classList.toggle("is-hidden", hue.value === defaultHue);
		hue.addEventListener("input", () => {
			localStorage.setItem("hue", hue.value);
			document.documentElement.style.setProperty("--hue", hue.value);
			if (hueValue) hueValue.textContent = hue.value;
			hueReset?.classList.toggle("is-hidden", hue.value === defaultHue);
		});
		hueReset?.addEventListener("click", () => {
			hue.value = defaultHue;
			localStorage.setItem("hue", defaultHue);
			document.documentElement.style.setProperty("--hue", defaultHue);
			if (hueValue) hueValue.textContent = defaultHue;
			hueReset.classList.add("is-hidden");
		});
	}
}

async function initSearch() {
	const inputs = qsa("[data-search-input]");
	const results = qs("#search-results");
	const panel = qs("#search-panel");
	if (!inputs.length || !results || !panel) return;
	let pagefind;
	try {
		const configuredBase = new URL(config.baseUrl || "/", location.href);
		const runtimeBase =
			configuredBase.origin === location.origin
				? configuredBase.href
				: `${location.origin}/`;
		pagefind = await import(new URL("pagefind/pagefind.js", runtimeBase).href);
		await pagefind.options({ excerptLength: 20 });
	} catch {
		pagefind = null;
	}
	const runSearch = async (source) => {
		const keyword = source.value.trim();
		for (const input of inputs) {
			if (input !== source) input.value = source.value;
		}
		results.innerHTML = "";
		if (!keyword) {
			panel.classList.add("float-panel-closed");
			return;
		}
		panel.classList.remove("float-panel-closed");
		if (!pagefind) {
			results.innerHTML = `<p class="search-empty">搜索索引仅在生产构建后可用。</p>`;
			return;
		}
		const response = await pagefind.search(keyword);
		const data = await Promise.all(
			response.results.slice(0, 8).map((item) => item.data()),
		);
		results.innerHTML = data.length
			? data
					.map(
						(item) =>
							`<a class="search-result no-styling" href="${item.url}"><strong>${item.meta.title}</strong><span>${item.excerpt}</span></a>`,
					)
					.join("")
			: `<p class="search-empty">No results</p>`;
	};
	for (const input of inputs) {
		input.addEventListener("input", () => runSearch(input));
		input.addEventListener("focus", () => {
			if (input.value.trim()) runSearch(input);
		});
	}
}

function initArchiveFilter() {
	const input = qs("#archive-filter-input");
	const isArchive = location.pathname.replace(/\/+$/, "").endsWith("/archive");
	const params = new URLSearchParams(location.search);
	const selectedCategories = params.getAll("category");
	const selectedTags = params.getAll("tag");

	qsa("[data-archive-filter][data-archive-value]").forEach((link) => {
		const filter = link.dataset.archiveFilter;
		const value = link.dataset.archiveValue;
		const active =
			filter === "category"
				? selectedCategories.includes(value)
				: selectedTags.includes(value);
		link.classList.toggle("archive-filter-active", isArchive && active);
		link.toggleAttribute("aria-current", isArchive && active);
		if (!isArchive) return;
		const next = new URLSearchParams(params);
		if (active) {
			const kept = next.getAll(filter).filter((item) => item !== value);
			next.delete(filter);
			for (const item of kept) next.append(filter, item);
		} else {
			if (filter === "category") next.delete("uncategorized");
			next.append(filter, value);
		}
		const url = new URL(link.href, location.href);
		url.search = next.toString();
		link.href = url.toString();
	});

	const apply = () => {
		const textValue = input?.value.trim().toLowerCase() || "";
		qsa(".archive-row").forEach((row) => {
			const rowCategory = row.dataset.category || "";
			const rowTags = (row.dataset.tags || "").split(/\s+/).filter(Boolean);
			const hiddenBySelectedCategory =
				selectedCategories.length > 0 &&
				!selectedCategories.includes(rowCategory);
			const hiddenBySelectedTag =
				selectedTags.length > 0 &&
				!rowTags.some((tag) => selectedTags.includes(tag));
			const haystack = `${row.dataset.title || ""} ${row.dataset.tags || ""} ${row.dataset.categoryKey || ""}`;
			const hiddenByText = textValue && !haystack.includes(textValue);
			row.hidden = Boolean(
				hiddenBySelectedCategory || hiddenBySelectedTag || hiddenByText,
			);
		});
	};
	input?.addEventListener("input", apply);
	apply();
}

function initBackToTop() {
	const btn = qs("#back-to-top-btn");
	const navbar = qs("#navbar-wrapper");
	const toc = qs("#toc-wrapper");
	const update = () => {
		const threshold = innerHeight * 0.35;
		btn?.classList.toggle("hide", scrollY <= threshold);
		toc?.classList.toggle("toc-hide", scrollY <= threshold);
		navbar?.classList.toggle(
			"navbar-hidden",
			document.body.classList.contains("lg-is-home") &&
				scrollY >= threshold - 88,
		);
	};
	btn?.addEventListener("click", () =>
		scrollTo({ top: 0, behavior: "smooth" }),
	);
	addEventListener("scroll", update, { passive: true });
	update();
}

function syncFootnotesHeadingAndToc() {
	const markdown = qs(".custom-md");
	const firstFootnote = qs(".footnote-definition", markdown);
	if (!markdown || !firstFootnote) return;

	let heading = qs("#footnotes", markdown);
	if (!heading) {
		heading = document.createElement("h2");
		heading.id = "footnotes";
		heading.textContent = "Footnotes";
		firstFootnote.parentNode?.insertBefore(heading, firstFootnote);
	}

	const toc = qs("table-of-contents");
	if (!toc || qs('a[href$="#footnotes"]', toc)) return;

	const entry = document.createElement("a");
	entry.className = "toc-entry toc-depth-2";
	entry.href = `${location.pathname.replace(/\/?$/, "/")}#footnotes`;
	entry.innerHTML =
		'<span class="toc-badge toc-dot"></span><span class="toc-text">Footnotes</span>';
	const indicator = qs("[data-active-indicator]", toc);
	toc.insertBefore(entry, indicator || null);
	toc.refresh?.();
}

class TableOfContents extends HTMLElement {
	connectedCallback() {
		this.tocEl = this.closest("[data-toc-scroll]") || this;
		this.activeIndicator = qs("[data-active-indicator]", this);
		this.onScroll = this.update.bind(this);
		this.onClick = this.handleAnchorClick.bind(this);
		this.tocEl?.addEventListener("click", this.onClick, { capture: true });
		addEventListener("scroll", this.onScroll, { passive: true });
		addEventListener("resize", this.onScroll, { passive: true });
		this.refresh();
	}

	refresh() {
		this.tocEntries = qsa(".toc-entry[href]", this);
		this.headings = this.tocEntries
			.map((entry) => {
				const id = decodeURIComponent(
					new URL(entry.href, location.href).hash.substring(1),
				);
				return document.getElementById(id);
			})
			.filter((heading) => heading instanceof HTMLElement);
		this.update();
	}

	disconnectedCallback() {
		this.tocEl?.removeEventListener("click", this.onClick, { capture: true });
		removeEventListener("scroll", this.onScroll);
		removeEventListener("resize", this.onScroll);
	}

	handleAnchorClick(event) {
		const anchor = event
			.composedPath()
			.find((element) => element instanceof HTMLAnchorElement);
		const hash = anchor ? new URL(anchor.href, location.href).hash : "";
		this.anchorNavTarget = anchor ? decodeURIComponent(hash.substring(1)) : "";
	}

	update() {
		if (!this.tocEntries?.length || !this.headings?.length) return;
		const viewportAnchor = innerHeight * 0.32;
		let activeIndex = 0;
		for (let i = 0; i < this.headings.length; i++) {
			if (this.headings[i].getBoundingClientRect().top <= viewportAnchor) {
				activeIndex = i;
			} else {
				break;
			}
		}
		const visibleIndexes = this.headings
			.map((heading, index) => {
				const top = heading.getBoundingClientRect().top;
				const next = this.headings[index + 1];
				const bottom = next
					? next.getBoundingClientRect().top
					: document.documentElement.scrollHeight - scrollY;
				return { index, top, bottom };
			})
			.filter(({ top, bottom }) => top < innerHeight && bottom > 0)
			.map(({ index }) => index);
		const activeEnd = visibleIndexes.length
			? Math.max(activeIndex, ...visibleIndexes)
			: activeIndex;
		let groupStart = activeIndex;
		while (
			groupStart > 0 &&
			!this.tocEntries[groupStart].classList.contains("toc-depth-1")
		) {
			groupStart--;
		}
		this.tocEntries.forEach((entry, index) => {
			entry.classList.toggle(
				"visible",
				index >= groupStart && index <= activeEnd,
			);
		});
		this.moveIndicator(groupStart, activeEnd);
		this.scrollToActiveHeading(groupStart, activeEnd);
	}

	moveIndicator(startIndex, endIndex = startIndex) {
		if (!this.activeIndicator || !this.tocEl) return;
		const startEntry = this.tocEntries[startIndex];
		const endEntry = this.tocEntries[endIndex];
		if (!startEntry || !endEntry) {
			this.activeIndicator.style.opacity = "0";
			return;
		}
		const parentOffset = this.tocEl.getBoundingClientRect().top;
		const scrollOffset = this.tocEl.scrollTop || 0;
		const startRect = startEntry.getBoundingClientRect();
		const endRect = endEntry.getBoundingClientRect();
		this.activeIndicator.style.opacity = "1";
		this.activeIndicator.style.top = `${startRect.top - parentOffset + scrollOffset}px`;
		this.activeIndicator.style.height = `${endRect.bottom - startRect.top}px`;
	}

	scrollToActiveHeading(startIndex, endIndex) {
		if (this.anchorNavTarget || !this.tocEl) return;
		const topmost = this.tocEntries[startIndex];
		const bottommost = this.tocEntries[endIndex];
		if (!topmost || !bottommost) return;

		const tocHeight = this.tocEl.clientHeight;
		const visibleHeight =
			bottommost.getBoundingClientRect().bottom -
			topmost.getBoundingClientRect().top;
		const top =
			visibleHeight < 0.9 * tocHeight
				? topmost.offsetTop - 32
				: bottommost.offsetTop - tocHeight * 0.8;

		this.tocEl.scrollTo({
			top,
			left: 0,
			behavior: "smooth",
		});
	}
}

syncFootnotesHeadingAndToc();
if (!customElements.get("table-of-contents")) {
	customElements.define("table-of-contents", TableOfContents);
}

function initCodeCopy() {
	qsa(".custom-md pre").forEach((pre) => {
		if (pre.closest(".expressive-code")) return;
		if (pre.parentElement?.classList.contains("code-frame")) return;
		const wrapper = document.createElement("div");
		wrapper.className = "code-frame";
		pre.parentNode.insertBefore(wrapper, pre);
		wrapper.appendChild(pre);
		const button = document.createElement("button");
		button.className = "copy-btn";
		button.type = "button";
		button.setAttribute("aria-label", "Copy code");
		button.textContent = "Copy";
		button.onclick = async () => {
			await navigator.clipboard.writeText(pre.innerText);
			button.textContent = "Done";
			button.classList.add("success");
			setTimeout(() => {
				button.textContent = "Copy";
				button.classList.remove("success");
			}, 1300);
		};
		wrapper.appendChild(button);
	});
}

const TWIKOO_ADMIN_PORTAL_CLASS = "twikoo-admin-portal";
let twikooAdminObserver;
let twikooLazyObserver;
let twikooModule;
let twikooInitToken = 0;

function normalizeTwikooPath(pathname) {
	return pathname.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
}

function prettifyTwikooMetaInputs() {
	const labels = {
		nick: "Nickname *",
		mail: "Email *",
		link: "Website",
	};
	for (const input of qsa(".twikoo-card .tk-meta-input input[name]")) {
		const label = labels[input.name];
		if (!label) continue;
		input.placeholder = label;
		input.setAttribute("aria-label", label);
	}
}

function syncTwikooAdminEntry() {
	const nickInput = qs(".twikoo-card .tk-meta-input input[name='nick']");
	if (!nickInput) return;
	for (const type of ["input", "change"]) {
		nickInput.dispatchEvent(new Event(type, { bubbles: true }));
	}
}

function portalTwikooAdmin(root) {
	const adminContainer = qs(".tk-admin-container", root);
	if (!adminContainer) return;
	adminContainer.classList.add(TWIKOO_ADMIN_PORTAL_CLASS);
	if (adminContainer.parentElement !== document.body) {
		document.body.appendChild(adminContainer);
	}
}

function resetBlogTwikoo() {
	twikooInitToken++;
	twikooAdminObserver?.disconnect();
	twikooAdminObserver = undefined;
	twikooLazyObserver?.disconnect();
	twikooLazyObserver = undefined;
	qs("#swup-container")?.classList.remove("twikoo-overflow-visible");
	qsa(`.${TWIKOO_ADMIN_PORTAL_CLASS}`).forEach((portal) => {
		portal.remove();
	});
}

async function loadTwikoo(options) {
	twikooModule ||= import(
		"https://unpkg.com/twikoo@1.7.13/dist/twikoo.all.min.js"
	);
	const mod = await twikooModule;
	const twikoo = mod.default || window.twikoo;
	if (typeof twikoo === "function") return twikoo(options);
	return twikoo?.init(options);
}

function enhanceTwikoo(root) {
	qs("#swup-container")?.classList.add("twikoo-overflow-visible");
	twikooAdminObserver?.disconnect();
	twikooAdminObserver = new MutationObserver(() => portalTwikooAdmin(root));
	twikooAdminObserver.observe(root, { childList: true, subtree: true });
	portalTwikooAdmin(root);
	prettifyTwikooMetaInputs();
	syncTwikooAdminEntry();
}

async function initBlogTwikoo() {
	const root = qs("[data-twikoo-root]");
	const host = qs("#tcomment");
	if (!root || !host) {
		resetBlogTwikoo();
		return;
	}
	const envId = root.dataset.envId || config.twikooEnvId;
	const title = root.dataset.title || document.title;
	const path = normalizeTwikooPath(root.dataset.path || location.pathname);
	if (!envId || !title) {
		resetBlogTwikoo();
		return;
	}
	if (host.dataset.twikooPath === path) return;

	resetBlogTwikoo();
	const token = twikooInitToken;
	host.dataset.twikooPath = path;
	host.replaceChildren();
	try {
		await loadTwikoo({
			envId,
			el: "#tcomment",
			path,
			title,
			lang: root.dataset.lang || config.lang || "zh-CN",
		});
		if (token !== twikooInitToken || host.dataset.twikooPath !== path) return;
		enhanceTwikoo(root);
		requestAnimationFrame(() => {
			if (token !== twikooInitToken) return;
			enhanceTwikoo(root);
		});
		setTimeout(() => {
			if (token !== twikooInitToken) return;
			portalTwikooAdmin(root);
			syncTwikooAdminEntry();
		}, 600);
	} catch (error) {
		console.error("Twikoo failed to initialize", error);
		if (token === twikooInitToken && host.dataset.twikooPath === path) {
			delete host.dataset.twikooPath;
			host.innerHTML = `<p class="twikoo-lazy-placeholder">评论区加载失败</p>`;
		}
	}
}

function setupLazyBlogTwikoo() {
	const root = qs("[data-twikoo-root]");
	if (!root) {
		resetBlogTwikoo();
		return;
	}
	twikooLazyObserver?.disconnect();
	if (!("IntersectionObserver" in window)) {
		initBlogTwikoo();
		return;
	}
	twikooLazyObserver = new IntersectionObserver((entries, observer) => {
		if (entries.some((entry) => entry.isIntersecting)) {
			observer.disconnect();
			twikooLazyObserver = undefined;
			initBlogTwikoo();
		}
	});
	twikooLazyObserver.observe(root);
}

function initTwikoo() {
	setupLazyBlogTwikoo();
}

function initGithubCards() {
	qsa("[data-github-card]").forEach(async (card) => {
		const repo = card.dataset.githubCard;
		try {
			const response = await fetch(`https://api.github.com/repos/${repo}`);
			if (!response.ok) return;
			const data = await response.json();
			qs(".gc-description", card).textContent =
				data.description || "GitHub repository";
			qs(".gc-stars", card).textContent = `${data.stargazers_count} stars`;
			qs(".gc-forks", card).textContent = `${data.forks_count} forks`;
			qs(".gc-license", card).textContent =
				data.license?.spdx_id || "No license";
		} catch {}
	});
}

function initVideoEmbeds() {
	qsa(".custom-md iframe").forEach((iframe) => {
		if (iframe.parentElement?.classList.contains("video-embed")) return;
		const wrapper = document.createElement("div");
		wrapper.className = "video-embed";
		iframe.parentNode.insertBefore(wrapper, iframe);
		wrapper.appendChild(iframe);
	});
}

function initPage() {
	document.documentElement.style.setProperty("--content-delay", "150ms");
	qs("#banner")?.classList.add("banner-ready");
	syncFootnotesHeadingAndToc();
	initThemeControls();
	initArchiveFilter();
	initBackToTop();
	initCodeCopy();
	initTwikoo();
	initGithubCards();
	initVideoEmbeds();
}

initPanels();
initSearch();
initPage();
window.__zolaBlogRuntimeReady = true;

const swup = new Swup({
	containers: ["#swup-container", "#sidebar-sticky"],
	animationSelector: '[class*="transition-swup-"]',
	plugins: [new SwupPreloadPlugin()],
});
window.swup = swup;

swup.hooks.on("visit:start", (visit) => {
	document.documentElement.style.setProperty("--content-delay", "0ms");
	document.body.classList.toggle(
		"lg-is-home",
		new URL(visit.to.url, location.href).pathname ===
			new URL(config.baseUrl).pathname,
	);
	qs("#page-height-extend")?.classList.remove("hidden");
});
swup.hooks.on("content:replace", resetBlogTwikoo, { before: true });
swup.hooks.on("page:view", initPage);
swup.hooks.on("visit:end", () => {
	setTimeout(() => qs("#page-height-extend")?.classList.add("hidden"), 200);
});

addEventListener("resize", () => {
	let offset = Math.floor(innerHeight * 0.3);
	offset = offset - (offset % 4);
	document.documentElement.style.setProperty(
		"--banner-height-extend",
		`${offset}px`,
	);
});

document.addEventListener("click", (event) => {
	if (!(event.target instanceof Element)) return;
	const button = event.target.closest(".expressive-code .copy-btn");
	if (!button) return;
	const code = button.closest("pre")?.querySelector("code");
	const text = qsa(".code:not(summary *)", code)
		.map((line) => line.textContent)
		.join("\n");
	navigator.clipboard.writeText(text || code?.innerText || "");
	const previous = button.getAttribute("data-timeout-id");
	if (previous) clearTimeout(Number(previous));
	button.classList.add("success");
	const timeout = setTimeout(() => button.classList.remove("success"), 1000);
	button.setAttribute("data-timeout-id", String(timeout));
});

document.addEventListener("click", (event) => {
	if (
		event.defaultPrevented ||
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	)
		return;
	if (!location.pathname.replace(/\/+$/, "").endsWith("/archive")) return;
	if (!(event.target instanceof Element)) return;
	const link = event.target.closest(
		"[data-archive-filter][data-archive-value]",
	);
	if (!link) return;
	event.preventDefault();
	const url = new URL(link.href, location.href);
	history.pushState({}, "", `${url.pathname}${url.search}`);
	initArchiveFilter();
});

addEventListener("popstate", initArchiveFilter);
