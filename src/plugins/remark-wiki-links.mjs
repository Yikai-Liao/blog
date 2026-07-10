import fs from "node:fs";
import path from "node:path";
import { visit } from "unist-util-visit";
import { findPostFiles } from "../utils/postignore.mjs";

const WIKI_LINK = /(?<!!)(?:^|[^!])\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;

function parseFrontmatter(markdown) {
	const match = markdown.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};
	const data = {};
	for (const line of match[1].split("\n")) {
		const pair = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
		if (pair) data[pair[1]] = pair[2].trim().replace(/^['"]|['"]$/g, "");
	}
	return data;
}

function normalizeBase(value) {
	const trimmed = value?.trim();
	return !trimmed || trimmed === "/"
		? ""
		: `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function loadPosts() {
	const posts = new Map();
	const byFile = new Map();
	for (const relativeFile of findPostFiles("contents")) {
		const file = path.join("contents", relativeFile);
		const data = parseFrontmatter(fs.readFileSync(file, "utf8"));
		if (!data.slug || data.draft === "true") continue;
		const post = { ...data, file: path.resolve(file), private: data.private !== "false" };
		if (posts.has(post.slug)) {
			throw new Error(`[wiki-link] duplicate post slug: ${post.slug}`);
		}
		posts.set(post.slug, post);
		byFile.set(post.file, post);
	}
	return { posts, byFile };
}

const index = loadPosts();
const base = normalizeBase(process.env.PUBLIC_BASE_PATH);
const wikiFiles = [...index.posts.keys()].map((slug) => `${slug}.md`);
const permalinks = Object.fromEntries(
	[...index.posts.values()].map((post) => [
		`${post.slug}.md`,
		`${base}/${post.private ? "private/posts" : "posts"}/${post.slug}/`.replace(/\/+/g, "/"),
	]),
);

export const wikiLinkOptions = {
	format: "regular",
	files: wikiFiles,
	permalinks,
	className: "wiki-link",
	newClassName: "wiki-link-missing",
};

export function validateWikiLinks() {
	return (_, file) => {
		const source = index.byFile.get(path.resolve(file.path ?? ""));
		if (!source) return;
		for (const match of String(file.value).matchAll(WIKI_LINK)) {
			const target = match[1]?.trim();
			const post = index.posts.get(target);
			if (!post) {
				file.fail(`[wiki-link] "${target}" in ${source.slug} does not match a post slug.`);
			}
			if (!source.private && post.private) {
				file.fail(
					`[wiki-link] public post "${source.slug}" cannot link to private post "${target}".`,
				);
			}
		}
	};
}

export function markWikiLinksPrivateNavigation() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "a") return;
			const classes = node.properties?.className;
			const classList = Array.isArray(classes) ? classes : [classes];
			const href = node.properties?.href;
			if (classList.includes("wiki-link") && typeof href === "string" && href.includes("/posts/")) {
				node.properties["data-private-nav-url"] = href;
			}
		});
	};
}
