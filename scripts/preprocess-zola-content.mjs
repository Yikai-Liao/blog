import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { definePlugin, ExpressiveCodeEngine } from "@expressive-code/core";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginFrames } from "@expressive-code/plugin-frames";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { loadShikiTheme, pluginShiki } from "@expressive-code/plugin-shiki";
import { pluginTextMarkers } from "@expressive-code/plugin-text-markers";
import getReadingTime from "reading-time";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "contents");
const targetDir = path.join(root, "content", "posts");
const theme = await loadShikiTheme("github-dark");

function pluginCustomCopyButton() {
	return definePlugin({
		name: "Custom Copy Button",
		hooks: {
			postprocessRenderedBlock: (context) => {
				const traverse = (node) => {
					if (node.type === "element" && node.tagName === "pre") {
						node.children ||= [];
						node.children.push({
							type: "element",
							tagName: "button",
							properties: {
								className: ["copy-btn"],
								"aria-label": "Copy code",
							},
							children: [
								{
									type: "element",
									tagName: "div",
									properties: { className: ["copy-btn-icon"] },
									children: [
										{
											type: "element",
											tagName: "svg",
											properties: {
												viewBox: "0 -960 960 960",
												xmlns: "http://www.w3.org/2000/svg",
												className: ["copy-btn-icon", "copy-icon"],
											},
											children: [
												{
													type: "element",
													tagName: "path",
													properties: {
														d: "M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z",
													},
													children: [],
												},
											],
										},
										{
											type: "element",
											tagName: "svg",
											properties: {
												viewBox: "0 -960 960 960",
												xmlns: "http://www.w3.org/2000/svg",
												className: ["copy-btn-icon", "success-icon"],
											},
											children: [
												{
													type: "element",
													tagName: "path",
													properties: {
														d: "m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z",
													},
													children: [],
												},
											],
										},
									],
								},
							],
						});
						return;
					}
					for (const child of node.children || []) {
						if (child.type === "element") traverse(child);
					}
				};
				traverse(context.renderData.blockAst);
			},
		},
	});
}

function pluginLanguageBadge() {
	return definePlugin({
		name: "Language Badge",
		baseStyles: () => `
      [data-language]::before {
        position: absolute;
        z-index: 2;
        right: 0.5rem;
        top: 0.5rem;
        padding: 0.1rem 0.5rem;
        content: attr(data-language);
        font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
        color: oklch(0.75 0.1 var(--hue));
        background: oklch(0.33 0.035 var(--hue));
        border-radius: 0.5rem;
        pointer-events: none;
        transition: opacity 0.3s;
        opacity: 0;
      }
      .frame:not(.has-title):not(.is-terminal) [data-language]::before { opacity: 1; }
      .frame:not(.has-title):not(.is-terminal):hover [data-language]::before { opacity: 0; }
    `,
	});
}

const codeEngine = new ExpressiveCodeEngine({
	themes: [theme, theme],
	plugins: [
		pluginShiki(),
		pluginFrames({ showCopyToClipboardButton: false }),
		pluginTextMarkers(),
		pluginCollapsibleSections(),
		pluginLineNumbers(),
		pluginLanguageBadge(),
		pluginCustomCopyButton(),
	],
	defaultProps: {
		wrap: true,
		overridesByLang: {
			shellsession: {
				showLineNumbers: false,
			},
		},
	},
	styleOverrides: {
		codeBackground: "var(--codeblock-bg)",
		borderRadius: "0.75rem",
		borderColor: "none",
		codeFontSize: "0.875rem",
		codeFontFamily:
			"'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
		codeLineHeight: "1.5rem",
		frames: {
			editorBackground: "var(--codeblock-bg)",
			terminalBackground: "var(--codeblock-bg)",
			terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
			editorTabBarBackground: "var(--codeblock-topbar-bg)",
			editorActiveTabBackground: "none",
			editorActiveTabIndicatorBottomColor: "var(--primary)",
			editorActiveTabIndicatorTopColor: "none",
			editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
			terminalTitlebarBorderBottomColor: "none",
		},
		textMarkers: {
			delHue: "0",
			insHue: "180",
			markHue: "250",
		},
	},
});

const escapeHtml = (value) =>
	String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

function hastToHtml(node) {
	if (!node) return "";
	if (node.type === "text") return escapeHtml(node.value || "");
	if (node.type === "raw") return node.value || "";
	if (node.type !== "element")
		return (node.children || []).map(hastToHtml).join("");
	const props = Object.entries(node.properties || {})
		.filter(([, value]) => value !== false && value != null)
		.map(([key, value]) => {
			const attr =
				key === "className"
					? "class"
					: key === "viewBox"
						? "viewBox"
						: key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
			if (value === true) return attr;
			const rendered = Array.isArray(value) ? value.join(" ") : String(value);
			return `${attr}="${escapeHtml(rendered)}"`;
		})
		.join(" ");
	const open = props ? `<${node.tagName} ${props}>` : `<${node.tagName}>`;
	return `${open}${(node.children || []).map(hastToHtml).join("")}</${node.tagName}>`;
}

async function listMarkdownFiles(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) return listMarkdownFiles(full);
			return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
		}),
	);
	return files.flat();
}

function parseFrontmatter(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) return [{}, raw];
	const data = {};
	for (const line of match[1].split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const index = trimmed.indexOf(":");
		if (index === -1) continue;
		const key = trimmed.slice(0, index).trim();
		const value = trimmed.slice(index + 1).trim();
		data[key] = parseYamlScalar(value);
	}
	return [data, match[2]];
}

function parseYamlScalar(value) {
	if (value === "true") return true;
	if (value === "false") return false;
	if (value === "null" || value === "~") return null;
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		return value.slice(1, -1);
	}
	if (value.startsWith("[") && value.endsWith("]")) {
		const inner = value.slice(1, -1).trim();
		if (!inner) return [];
		return inner.split(",").map((item) => parseYamlScalar(item.trim()));
	}
	return value;
}

function tomlString(value) {
	return JSON.stringify(String(value ?? ""));
}

function tomlArray(values) {
	return `[${(values || []).map(tomlString).join(", ")}]`;
}

function buildFrontmatter(data, sourcePath, options = {}) {
	const slug = data.slug || path.basename(sourcePath, ".md");
	const date = data.published || data.date || "2024-01-01";
	const tags = Array.isArray(data.tags) ? data.tags : [];
	const category = data.category || "Uncategorized";
	const draft = Boolean(data.draft);
	const readingStats = options.readingStats || { words: 0, minutes: 1 };
	const nav = options.nav || {};
	const postPath = `posts/${slug}`;
	const lines = [
		"+++",
		`title = ${tomlString(data.title || slug)}`,
		`description = ${tomlString(data.description || "")}`,
		`date = ${date}`,
		`draft = ${draft}`,
		`slug = ${tomlString(slug)}`,
		`path = ${tomlString(postPath)}`,
		"[taxonomies]",
		`tags = ${tomlArray(tags)}`,
		`categories = ${tomlArray([category])}`,
		"[extra]",
		`published = ${tomlString(date)}`,
		`updated = ${data.updated ? tomlString(data.updated) : '""'}`,
		`image = ${tomlString(data.image || "")}`,
		`category = ${tomlString(category)}`,
		`tags = ${tomlArray(tags)}`,
		`draft = ${draft}`,
		`words = ${Math.max(0, Math.round(readingStats.words || 0))}`,
		`minutes = ${Math.max(1, Math.round(readingStats.minutes || 1))}`,
		`prev_slug = ${tomlString(nav.prevSlug || "")}`,
		`prev_title = ${tomlString(nav.prevTitle || "")}`,
		`next_slug = ${tomlString(nav.nextSlug || "")}`,
		`next_title = ${tomlString(nav.nextTitle || "")}`,
		"+++",
		"",
	];
	return lines.join("\n");
}

function transformDirectives(markdown) {
	let out = markdown;
	out = out.replace(
		/^::github\{repo="([^"]+)"\}\s*$/gm,
		(_, repo) => `{{ github(repo="${repo}") }}`,
	);
	out = out.replace(
		/:spoiler\[([\s\S]*?)\]/g,
		(_, body) => `<spoiler>${body}</spoiler>`,
	);
	out = out.replace(
		/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n((?:>.*\n?)+)/gm,
		(_, type, body) => {
			const content = body.replace(/^> ?/gm, "").trim();
			return admonitionHtml(type.toLowerCase(), type, content);
		},
	);
	out = out.replace(
		/^:::(note|tip|important|warning|caution)(?:\[([^\]]+)\])?\n([\s\S]*?)\n:::/gm,
		(_, type, title, body) => {
			const fallback = type[0].toUpperCase() + type.slice(1);
			return admonitionHtml(type, title || fallback, body.trim());
		},
	);
	return out;
}

function admonitionHtml(type, title, body) {
	return `<blockquote class="admonition bdm-${type}">
<p class="bdm-title">${escapeHtml(title)}</p>

${body}
</blockquote>`;
}

async function transformCodeBlocks(markdown) {
	const pattern = /```([^\n`]*)\n([\s\S]*?)```/g;
	let result = "";
	let lastIndex = 0;
	for (const match of markdown.matchAll(pattern)) {
		result += markdown.slice(lastIndex, match.index);
		const info = match[1].trim();
		const code = match[2].replace(/\n$/, "");
		const [language = "text", ...metaParts] = info.split(/\s+/);
		try {
			const rendered = await codeEngine.render({
				code,
				language: language || "text",
				meta: metaParts.join(" "),
			});
			result += hastToHtml(rendered.renderedGroupAst);
		} catch {
			result += `\`\`\`${info}\n${code}\n\`\`\``;
		}
		lastIndex = match.index + match[0].length;
	}
	result += markdown.slice(lastIndex);
	return result;
}

async function cleanGeneratedPosts() {
	await fs.rm(targetDir, { recursive: true, force: true });
	await fs.mkdir(targetDir, { recursive: true });
	await fs.writeFile(
		path.join(targetDir, "_index.md"),
		`+++
title = "Posts"
template = "section.html"
page_template = "page.html"
sort_by = "date"
paginate_by = 8
generate_feeds = true
+++
`,
	);
}

async function main() {
	await cleanGeneratedPosts();
	const files = await listMarkdownFiles(sourceDir);
	const posts = await Promise.all(
		files.map(async (file) => {
			const raw = await fs.readFile(file, "utf8");
			const [data, body] = parseFrontmatter(raw);
			const slug = data.slug || path.basename(file, ".md");
			return { file, data, body, slug };
		}),
	);
	const sorted = posts
		.filter((post) => !post.data.draft)
		.sort((a, b) =>
			String(b.data.published || b.data.date || "").localeCompare(
				String(a.data.published || a.data.date || ""),
			),
		);
	const navBySlug = new Map();
	for (let index = 0; index < sorted.length; index++) {
		const previousOlder = sorted[index + 1];
		const nextNewer = sorted[index - 1];
		navBySlug.set(sorted[index].slug, {
			prevSlug: previousOlder?.slug || "",
			prevTitle: previousOlder?.data.title || "",
			nextSlug: nextNewer?.slug || "",
			nextTitle: nextNewer?.data.title || "",
		});
	}
	for (const { file, data, body, slug } of posts) {
		const target = path.join(targetDir, slug, "index.md");
		const transformed = transformDirectives(await transformCodeBlocks(body));
		const readingStats = getReadingTime(body);
		const nav = navBySlug.get(slug) || {};
		await fs.mkdir(path.dirname(target), { recursive: true });
		await fs.writeFile(
			target,
			`${buildFrontmatter(data, file, { readingStats, nav })}${transformed}`,
		);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
