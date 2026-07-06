import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ExpressiveCodeEngine, ExpressiveCodeTheme } from "@expressive-code/core";
import githubDark from "../node_modules/.pnpm/shiki@4.3.0/node_modules/shiki/dist/themes/github-dark.mjs";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "contents");
const targetDir = path.join(root, "content", "posts");
const theme = ExpressiveCodeTheme.fromJSONString(JSON.stringify(githubDark));
const codeEngine = new ExpressiveCodeEngine({
  themes: [theme],
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
  defaultProps: { wrap: true },
  styleOverrides: {
    codeBackground: "var(--codeblock-bg)",
    borderRadius: "0.75rem",
    codeFontSize: "0.875rem",
    codeFontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    codeLineHeight: "1.5rem",
  },
});

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function hastToHtml(node) {
  if (!node) return "";
  if (node.type === "text") return escapeHtml(node.value || "");
  if (node.type === "raw") return node.value || "";
  if (node.type !== "element") return (node.children || []).map(hastToHtml).join("");
  const props = Object.entries(node.properties || {})
    .filter(([, value]) => value !== false && value != null)
    .map(([key, value]) => {
      const attr = key === "className" ? "class" : key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
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
  const files = await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  }));
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
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
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

function buildFrontmatter(data, sourcePath) {
  const slug = data.slug || path.basename(sourcePath, ".md");
  const date = data.published || data.date || "2024-01-01";
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const category = data.category || "Uncategorized";
  const draft = Boolean(data.draft);
  const privatePost = Boolean(data.private);
  const postPath = privatePost ? `posts/private/${slug}` : `posts/${slug}`;
  const lines = [
    "+++",
    `title = ${tomlString(data.title || slug)}`,
    `description = ${tomlString(data.description || "")}`,
    `date = ${date}`,
    `draft = ${draft}`,
    `slug = ${tomlString(slug)}`,
    `path = ${tomlString(postPath)}`,
    `[taxonomies]`,
    `tags = ${tomlArray(tags)}`,
    `categories = ${tomlArray([category])}`,
    `[extra]`,
    `published = ${tomlString(date)}`,
    `updated = ${data.updated ? tomlString(data.updated) : '""'}`,
    `image = ${tomlString(data.image || "")}`,
    `category = ${tomlString(category)}`,
    `draft = ${draft}`,
    `private = ${privatePost}`,
    "+++",
    "",
  ];
  return lines.join("\n");
}

function transformDirectives(markdown) {
  let out = markdown;
  out = out.replace(/^::github\{repo="([^"]+)"\}\s*$/gm, (_, repo) => `{{ github(repo="${repo}") }}`);
  out = out.replace(/:spoiler\[([\s\S]*?)\]/g, (_, body) => `<spoiler>${body}</spoiler>`);
  out = out.replace(/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n((?:>.*\n?)+)/gm, (_, type, body) => {
    const content = body.replace(/^> ?/gm, "").trim();
    return admonitionHtml(type.toLowerCase(), type, content);
  });
  out = out.replace(/^:::(note|tip|important|warning|caution)(?:\[([^\]]+)\])?\n([\s\S]*?)\n:::/gm, (_, type, title, body) => {
    const fallback = type[0].toUpperCase() + type.slice(1);
    return admonitionHtml(type, title || fallback, body.trim());
  });
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
  await fs.writeFile(path.join(targetDir, "_index.md"), `+++
title = "Posts"
template = "section.html"
page_template = "page.html"
sort_by = "date"
paginate_by = 8
generate_feeds = true
+++
`);
}

async function main() {
  await cleanGeneratedPosts();
  const files = await listMarkdownFiles(sourceDir);
  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const [data, body] = parseFrontmatter(raw);
    const slug = data.slug || path.basename(file, ".md");
    const target = path.join(targetDir, slug, "index.md");
    const transformed = await transformCodeBlocks(transformDirectives(body));
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, `${buildFrontmatter(data, file)}${transformed}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
