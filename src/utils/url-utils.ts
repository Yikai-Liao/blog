import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

export function pathsEqual(path1: string, path2: string): boolean {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function normalizePostRoutePart(
	value: string | null | undefined,
): string {
	return (value ?? "").trim().replace(/^\/+|\/+$/g, "");
}

function withPrivateQuery(path: string): string {
	const [pathname, search = ""] = path.split("?");
	const params = new URLSearchParams(search);
	params.set("private", "true");
	return `${pathname}?${params.toString()}`;
}

function withoutPrivateQuery(pathname: string, search = ""): string {
	const params = new URLSearchParams(search);
	params.delete("private");
	const nextSearch = params.toString();
	return nextSearch ? `${pathname}?${nextSearch}` : pathname;
}

export function isPrivateView(pathname: string, search = ""): boolean {
	const params = new URLSearchParams(search);
	const normalizedPath = `/${normalizePostRoutePart(pathname)}/`;
	return (
		normalizedPath.startsWith("/private/") || params.get("private") === "true"
	);
}

export function getPostRouteSlug(slug: string): string {
	return normalizePostRoutePart(slug);
}

export function getPostUrlBySlug(
	slug: string,
	isPrivate?: boolean,
	privateContext = false,
): string {
	const path = isPrivate
		? `/private/posts/${getPostRouteSlug(slug)}/`
		: `/posts/${getPostRouteSlug(slug)}/`;
	return url(!isPrivate && privateContext ? withPrivateQuery(path) : path);
}

export function getTagUrl(tag: string, privateContext = false): string {
	const archiveUrl = privateContext ? "/private/archive/" : "/archive/";
	if (!tag) return url(archiveUrl);
	return url(`${archiveUrl}?tag=${encodeURIComponent(tag.trim())}`);
}

export function getCategoryUrl(
	category: string | null,
	privateContext = false,
): string {
	const archiveUrl = privateContext ? "/private/archive/" : "/archive/";
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return url(`${archiveUrl}?uncategorized=true`);
	return url(`${archiveUrl}?category=${encodeURIComponent(category.trim())}`);
}

export function getNavUrl(path: string, privateContext = false): string {
	if (!privateContext) return url(path);
	if (pathsEqual(path, "/")) return url("/private/");
	if (pathsEqual(path, "/archive/")) return url("/private/archive/");
	if (pathsEqual(path, "/graph/")) return url("/private/graph/");
	if (pathsEqual(path, "/about/")) return url("/about/?private=true");
	return url(path);
}

export function getPrivacyToggleUrl(pathname: string, search = ""): string {
	if (isPrivateView(pathname, search)) {
		if (pathname.startsWith(url("/private/posts/"))) return url("/");
		if (pathname.startsWith(url("/posts/")))
			return url(withoutPrivateQuery(pathname, search));
		if (pathsEqual(pathname, "/private/archive/"))
			return url(withoutPrivateQuery("/archive/", search));
		if (pathsEqual(pathname, "/private/graph/"))
			return url(withoutPrivateQuery("/graph/", search));
		if (pathsEqual(pathname, "/about/"))
			return url(withoutPrivateQuery("/about/", search));
		return url("/");
	}
	if (pathname.startsWith(url("/posts/")))
		return url(withPrivateQuery(`${pathname}${search}`));
	if (pathsEqual(pathname, "/archive/")) return url("/private/archive/");
	if (pathsEqual(pathname, "/graph/")) return url("/private/graph/");
	if (pathsEqual(pathname, "/about/")) return url("/about/?private=true");
	return url("/private/");
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function url(path: string): string {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
