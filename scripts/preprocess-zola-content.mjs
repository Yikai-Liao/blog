import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { definePlugin, ExpressiveCodeEngine } from "@expressive-code/core";
import { toHtml } from "@expressive-code/core/hast";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginFrames } from "@expressive-code/plugin-frames";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { loadShikiTheme, pluginShiki } from "@expressive-code/plugin-shiki";
import { pluginTextMarkers } from "@expressive-code/plugin-text-markers";
import MarkdownIt from "markdown-it";
import getReadingTime from "reading-time";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "contents");
const targetDir = path.join(root, "content", "posts");
const theme = await loadShikiTheme("github-dark");
const markdownParser = new MarkdownIt({ html: true });

function pluginLanguageBadge() {
	return definePlugin({
		name: "Language Badge",
		baseStyles: () => `
      .expressive-code [data-language]::before {
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
      .expressive-code .frame:not(.has-title):not(.is-terminal) [data-language]::before { opacity: 1; }
      .expressive-code .frame:not(.has-title):not(.is-terminal):hover [data-language]::before { opacity: 0; }
    `,
	});
}

const codeEngine = new ExpressiveCodeEngine({
	themes: [theme, theme],
	plugins: [
		pluginShiki(),
		pluginFrames(),
		pluginTextMarkers(),
		pluginCollapsibleSections(),
		pluginLineNumbers(),
		pluginLanguageBadge(),
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
			const fallback = type.toUpperCase();
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

function transformEmbeds(markdown) {
	return markdown.replace(/<iframe\b([^>]*)>/gi, (tag, attrs) => {
		if (/\sstyle\s*=/.test(attrs)) return tag;
		const height = attrs.match(/\sheight=(["']?)(\d+)\1/i);
		const style = height ? ` style="height: ${height[2]}px"` : "";
		return `<iframe${attrs}${style}>`;
	});
}

async function transformCodeBlocks(markdown) {
	const lines = markdown.split("\n");
	const codeTokens = markdownParser
		.parse(markdown, {})
		.filter(
			(token) => token.map && ["fence", "code_block"].includes(token.type),
		);

	for (const token of codeTokens.toReversed()) {
		const [start, end] = token.map;
		const originalLines = lines.slice(start, end);
		const info = token.type === "fence" ? token.info.trim() : "";
		const [language = "text", ...metaParts] = info.split(/\s+/);
		const code = token.content.replace(/\n$/, "");
		try {
			const rendered = await codeEngine.render({
				code,
				language: language || "text",
				meta: metaParts.join(" "),
			});
			const html = indentHtmlForMarkdownContainer(
				toHtml(rendered.renderedGroupAst),
				token,
				originalLines,
			);
			lines.splice(start, end - start, html);
		} catch {}
	}
	return lines.join("\n");
}

function indentHtmlForMarkdownContainer(html, token, originalLines) {
	if (token.level === 0) return html;
	const minIndent = originalLines
		.filter((line) => line.trim())
		.reduce(
			(min, line) => Math.min(min, line.match(/^ */)[0].length),
			Number.POSITIVE_INFINITY,
		);
	const indentSize =
		token.type === "code_block" ? Math.max(0, minIndent - 4) : minIndent;
	const indent = " ".repeat(Number.isFinite(indentSize) ? indentSize : 0);
	return html
		.split("\n")
		.map((line) => (line ? `${indent}${line}` : line))
		.join("\n");
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

async function writeExpressiveCodeAssets() {
	const [baseStyles, themeStyles, jsModules] = await Promise.all([
		codeEngine.getBaseStyles(),
		codeEngine.getThemeStyles(),
		codeEngine.getJsModules(),
	]);
	await fs.mkdir(path.join(root, "static", "css"), { recursive: true });
	await fs.mkdir(path.join(root, "static", "js"), { recursive: true });
	await fs.writeFile(
		path.join(root, "static", "css", "ec.css"),
		`/* Generated by scripts/preprocess-zola-content.mjs. */\n${baseStyles}\n${themeStyles}\n`,
	);
	await fs.writeFile(
		path.join(root, "static", "js", "expressive-code.js"),
		`// biome-ignore-all lint: generated by Expressive Code.\n// Generated by scripts/preprocess-zola-content.mjs.\n${jsModules.join("\n")}\n`,
	);
}

async function main() {
	await writeExpressiveCodeAssets();
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
		const transformed = transformEmbeds(
			transformDirectives(await transformCodeBlocks(body)),
		);
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
