import fs from "node:fs";
import path from "node:path";
import { h } from "hastscript";

const warned = new Set();

function warnOnce(message) {
	if (warned.has(message)) return;
	warned.add(message);
	console.warn(message);
}

function stripQuotes(value) {
	return value.trim().replace(/^['"]|['"]$/g, "");
}

function parseFrontmatter(markdown) {
	const match = markdown.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};

	const data = {};
	for (const line of match[1].split("\n")) {
		const pair = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
		if (!pair) continue;
		data[pair[1]] = stripQuotes(pair[2]);
	}
	return data;
}

function findPostFiles(dir) {
	if (!fs.existsSync(dir)) return [];

	const files = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (entry.name.startsWith("_")) continue;

		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...findPostFiles(fullPath));
		} else if (/\.(md|mdx)$/.test(entry.name)) {
			files.push(fullPath);
		}
	}
	return files;
}

function normalizeBase(value) {
	const trimmed = value?.trim();
	if (!trimmed || trimmed === "/") return "";
	return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function postUrl(slug, isPrivate, hash = "", privateContext = false) {
	const base = normalizeBase(process.env.PUBLIC_BASE_PATH);
	const section = isPrivate === "false" ? "posts" : "private/posts";
	const pathname = `${base}/${section}/${slug}/`.replace(/\/+/g, "/");
	const search = isPrivate === "false" && privateContext ? "?private=true" : "";
	return `${pathname}${search}${hash}`;
}

function normalizeHash(value) {
	const hash = value?.trim();
	if (!hash) return "";
	return hash.startsWith("#") ? hash : `#${hash}`;
}

function hashValue(hash) {
	const value = hash.replace(/^#/, "");
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function headingSlugs(markdown) {
	const slugs = new Set();
	const seen = new Map();
	let inFence = false;

	for (const line of markdown.split("\n")) {
		if (/^\s*(```|~~~)/.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;

		const match = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
		if (match) {
			const base = match[1]
				.replace(/\{#.+?\}\s*$/, "")
				.trim()
				.toLowerCase()
				.replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, "")
				.replace(/\s+/g, "-");
			const count = seen.get(base) || 0;
			seen.set(base, count + 1);
			slugs.add(count ? `${base}-${count}` : base);
		}
	}
	return slugs;
}

function loadPosts() {
	const posts = new Map();
	for (const file of findPostFiles("contents")) {
		const data = parseFrontmatter(fs.readFileSync(file, "utf8"));
		if (data.slug) posts.set(data.slug, { ...data, file });
	}
	return posts;
}

function currentPost(context) {
	const file =
		context?.vfile?.path ||
		context?.vfile?.history?.[0] ||
		context?.vfile?.data?.astro?.frontmatter?.file;
	if (!file || !fs.existsSync(file)) return null;
	return { ...parseFrontmatter(fs.readFileSync(file, "utf8")), file };
}

function relativeFile(file) {
	return path.relative(process.cwd(), file || "");
}

function sourceLocation(sourcePost, slug, hash) {
	if (!sourcePost?.file || !fs.existsSync(sourcePost.file)) return "unknown source";

	const lines = fs.readFileSync(sourcePost.file, "utf8").split("\n");
	const needle = `slug="${slug}"`;
	const hashNeedle = hash ? hashValue(hash) : "";
	const index = lines.findIndex((line) => {
		if (!line.includes("::post") || !line.includes(needle)) return false;
		if (!hashNeedle) return true;
		return line.includes(hashNeedle);
	});
	const line = index >= 0 ? `:${index + 1}` : "";
	const sourceName = sourcePost.slug ? `"${sourcePost.slug}" ` : "";
	return `${sourceName}(${relativeFile(sourcePost.file)}${line})`;
}

function validatePostCard(sourcePost, post, slug, hash) {
	const source = sourceLocation(sourcePost, slug, hash);
	if (!post) {
		warnOnce(
			`[post-card] missing post slug "${slug || "(empty)"}" used by ${source}`,
		);
		return;
	}
	if (!hash) return;

	const target = hashValue(hash);
	const slugs = headingSlugs(fs.readFileSync(post.file, "utf8"));
	if (!slugs.has(target)) {
		warnOnce(
			`[post-card] missing anchor "${target}" in post "${post.slug}" used by ${source}`,
		);
	}
}

export function PostCardComponent(properties, children, context) {
	if (children?.length)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("post" directive must be leaf type "::post{slug="post-slug"}")',
		]);

	const slug = properties.slug?.trim();
	const post = loadPosts().get(slug);
	const hash = normalizeHash(properties.anchor || properties.hash);
	const sourcePost = currentPost(context);
	const privateContext = sourcePost ? sourcePost.private !== "false" : false;
	validatePostCard(sourcePost, post, slug, hash);
	if (!slug || !post) {
		return h("div", { class: "card-post card-post-error" }, [
			`Post not found: ${slug || "(missing slug)"}`,
		]);
	}

	return h(
		"a",
		{
			class: "card-post no-styling",
			href: postUrl(post.slug, post.private, hash, privateContext),
			"data-private-nav-url":
				post.private === "false"
					? postUrl(post.slug, post.private, hash)
					: undefined,
		},
		[
			h("div", { class: "pc-label" }, "站内引用"),
			h("div", { class: "pc-title" }, post.title || post.slug),
			post.description
				? h("div", { class: "pc-description" }, post.description)
				: undefined,
			h("div", { class: "pc-meta" }, [
				post.published || "",
				post.category ? ` · ${post.category}` : "",
			]),
		].filter(Boolean),
	);
}
