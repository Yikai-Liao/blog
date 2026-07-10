import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl, normalizePostRoutePart } from "@utils/url-utils.ts";

function assertUniquePostSlugs(posts: CollectionEntry<"posts">[]) {
	const seen = new Map<string, CollectionEntry<"posts">>();
	const duplicates: string[] = [];

	for (const post of posts) {
		const slug = normalizePostRoutePart(post.data.slug);
		const existing = seen.get(slug);
		if (existing) {
			duplicates.push(
				`${slug}: ${existing.filePath ?? existing.id}, ${post.filePath ?? post.id}`,
			);
			continue;
		}
		seen.set(slug, post);
	}

	if (duplicates.length > 0) {
		throw new Error(`Duplicate post slug(s):\n${duplicates.join("\n")}`);
	}
}

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts(
	includePrivate = false,
): Promise<CollectionEntry<"posts">[]> {
	const allPosts = await getCollection("posts");
	assertUniquePostSlugs(allPosts);

	const allBlogPosts = allPosts.filter(({ data }) => {
		return data.draft !== true && (includePrivate || data.private !== true);
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

type AdjacentFields = {
	prevTitle: "prevTitle" | "publicPrevTitle" | "allPrevTitle";
	prevSlug: "prevSlug" | "publicPrevSlug" | "allPrevSlug";
	prevPrivate: "prevPrivate" | "publicPrevPrivate" | "allPrevPrivate";
	nextTitle: "nextTitle" | "publicNextTitle" | "allNextTitle";
	nextSlug: "nextSlug" | "publicNextSlug" | "allNextSlug";
	nextPrivate: "nextPrivate" | "publicNextPrivate" | "allNextPrivate";
};

function clearAdjacentFields(post: CollectionEntry<"posts">) {
	post.data.prevSlug = "";
	post.data.prevTitle = "";
	post.data.prevPrivate = false;
	post.data.nextSlug = "";
	post.data.nextTitle = "";
	post.data.nextPrivate = false;
	post.data.publicPrevSlug = "";
	post.data.publicPrevTitle = "";
	post.data.publicPrevPrivate = false;
	post.data.publicNextSlug = "";
	post.data.publicNextTitle = "";
	post.data.publicNextPrivate = false;
	post.data.allPrevSlug = "";
	post.data.allPrevTitle = "";
	post.data.allPrevPrivate = false;
	post.data.allNextSlug = "";
	post.data.allNextTitle = "";
	post.data.allNextPrivate = false;
}

function setAdjacentFields(
	posts: CollectionEntry<"posts">[],
	fields: AdjacentFields,
) {
	for (let i = 1; i < posts.length; i++) {
		posts[i].data[fields.nextSlug] = posts[i - 1].data.slug;
		posts[i].data[fields.nextTitle] = posts[i - 1].data.title;
		posts[i].data[fields.nextPrivate] = posts[i - 1].data.private;
	}
	for (let i = 0; i < posts.length - 1; i++) {
		posts[i].data[fields.prevSlug] = posts[i + 1].data.slug;
		posts[i].data[fields.prevTitle] = posts[i + 1].data.title;
		posts[i].data[fields.prevPrivate] = posts[i + 1].data.private;
	}
}

export async function getSortedPosts(
	includePrivate = false,
): Promise<CollectionEntry<"posts">[]> {
	const allSorted = await getRawSortedPosts(true);
	const publicSorted = allSorted.filter((post) => post.data.private !== true);
	const sorted = includePrivate ? allSorted : publicSorted;

	for (const post of allSorted) clearAdjacentFields(post);
	setAdjacentFields(sorted, {
		prevSlug: "prevSlug",
		prevTitle: "prevTitle",
		prevPrivate: "prevPrivate",
		nextSlug: "nextSlug",
		nextTitle: "nextTitle",
		nextPrivate: "nextPrivate",
	});
	setAdjacentFields(publicSorted, {
		prevSlug: "publicPrevSlug",
		prevTitle: "publicPrevTitle",
		prevPrivate: "publicPrevPrivate",
		nextSlug: "publicNextSlug",
		nextTitle: "publicNextTitle",
		nextPrivate: "publicNextPrivate",
	});
	setAdjacentFields(allSorted, {
		prevSlug: "allPrevSlug",
		prevTitle: "allPrevTitle",
		prevPrivate: "allPrevPrivate",
		nextSlug: "allNextSlug",
		nextTitle: "allNextTitle",
		nextPrivate: "allNextPrivate",
	});

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(
	includePrivate = false,
): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts(includePrivate);

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.data.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(includePrivate = false): Promise<Tag[]> {
	const allBlogPosts = await getRawSortedPosts(includePrivate);

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(
	includePrivate = false,
	privateContext: boolean = includePrivate,
): Promise<Category[]> {
	const allBlogPosts = await getRawSortedPosts(includePrivate);
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c, privateContext),
		});
	}
	return ret;
}
