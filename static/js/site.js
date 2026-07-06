import Swup from "https://unpkg.com/swup@4?module";
import SwupPreloadPlugin from "https://unpkg.com/@swup/preload-plugin@3?module";

const config = window.__BLOG_CONFIG__ || {};
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function setTheme(theme) {
  localStorage.setItem("theme", theme);
  const dark = theme === "dark" || (theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
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
      if (panel && !panel.contains(event.target)) panel.classList.add("float-panel-closed");
    }
  });
}

function initThemeControls() {
  qs("#scheme-switch")?.addEventListener("click", () => {
    setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
  });
  const hue = qs("#hue-slider");
  if (hue) {
    hue.value = localStorage.getItem("hue") || config.hue || "270";
    hue.addEventListener("input", () => {
      localStorage.setItem("hue", hue.value);
      document.documentElement.style.setProperty("--hue", hue.value);
    });
  }
}

async function initSearch() {
  const input = qs("#search-input");
  const results = qs("#search-results");
  if (!input || !results) return;
  let pagefind;
  try {
    pagefind = await import(`${config.baseUrl}pagefind/pagefind.js`);
    await pagefind.options({ excerptLength: 20 });
  } catch {
    pagefind = null;
  }
  input.addEventListener("input", async () => {
    const keyword = input.value.trim();
    results.innerHTML = "";
    if (!keyword) return;
    if (!pagefind) {
      results.innerHTML = `<p class="search-empty">Search is available after production build.</p>`;
      return;
    }
    const response = await pagefind.search(keyword);
    const data = await Promise.all(response.results.slice(0, 8).map((item) => item.data()));
    results.innerHTML = data.length
      ? data.map((item) => `<a class="search-result no-styling" href="${item.url}"><strong>${item.meta.title}</strong><span>${item.excerpt}</span></a>`).join("")
      : `<p class="search-empty">No results</p>`;
  });
}

function initArchiveFilter() {
  const input = qs("#archive-filter-input");
  if (!input) return;
  input.addEventListener("input", () => {
    const value = input.value.trim().toLowerCase();
    qsa(".archive-row").forEach((row) => {
      const haystack = `${row.dataset.title || ""} ${row.dataset.tags || ""} ${row.dataset.category || ""}`;
      row.hidden = value && !haystack.includes(value);
    });
  });
}

function initBackToTop() {
  const btn = qs("#back-to-top-btn");
  const navbar = qs("#navbar-wrapper");
  const toc = qs("#sidebar-toc");
  const update = () => {
    const threshold = innerHeight * 0.35;
    btn?.classList.toggle("hide", scrollY <= threshold);
    toc?.classList.toggle("toc-hide", scrollY <= threshold);
    navbar?.classList.toggle("navbar-hidden", document.body.classList.contains("lg-is-home") && scrollY >= threshold - 88);
  };
  btn?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  addEventListener("scroll", update, { passive: true });
  update();
}

function initCodeCopy() {
  qsa(".expressive-code pre, .custom-md pre").forEach((pre) => {
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

function initTwikoo() {
  const root = qs("[data-twikoo-root]");
  if (!root || !config.twikooEnvId || window.__blogTwikooLoading) return;
  window.__blogTwikooLoading = true;
  const load = () => {
    import("https://unpkg.com/twikoo@1.7.13/dist/twikoo.all.min.js").then((mod) => {
      const twikoo = mod.default || window.twikoo;
      twikoo?.init({
        envId: config.twikooEnvId,
        el: "#tcomment",
        path: root.dataset.path || location.pathname,
        title: root.dataset.title || document.title,
        lang: config.lang || "zh-CN",
      });
    }).finally(() => { window.__blogTwikooLoading = false; });
  };
  if (!("IntersectionObserver" in window)) {
    load();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      load();
    }
  });
  observer.observe(root);
}

function initGithubCards() {
  qsa("[data-github-card]").forEach(async (card) => {
    const repo = card.dataset.githubCard;
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`);
      if (!response.ok) return;
      const data = await response.json();
      qs(".gc-description", card).textContent = data.description || "GitHub repository";
      qs(".gc-stars", card).textContent = `${data.stargazers_count} stars`;
      qs(".gc-forks", card).textContent = `${data.forks_count} forks`;
      qs(".gc-license", card).textContent = data.license?.spdx_id || "No license";
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

const swup = new Swup({
  containers: ["#swup-container", "#sidebar-sticky"],
  animationSelector: '[class*="transition-swup-"]',
  plugins: [new SwupPreloadPlugin()],
});

swup.hooks.on("visit:start", (visit) => {
  document.documentElement.style.setProperty("--content-delay", "0ms");
  document.body.classList.toggle("lg-is-home", new URL(visit.to.url, location.href).pathname === new URL(config.baseUrl).pathname);
  qs("#page-height-extend")?.classList.remove("hidden");
});
swup.hooks.on("page:view", initPage);
swup.hooks.on("visit:end", () => {
  setTimeout(() => qs("#page-height-extend")?.classList.add("hidden"), 200);
});

addEventListener("resize", () => {
  let offset = Math.floor(innerHeight * 0.3);
  offset = offset - offset % 4;
  document.documentElement.style.setProperty("--banner-height-extend", `${offset}px`);
});
