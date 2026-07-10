import { getCollection, type CollectionEntry } from "astro:content";
import { getPostUrlBySlug } from "./url-utils";

export type WikiGraphNode = {
	slug: string;
	title: string;
	category: string | null;
	tags: string[];
	private: boolean;
	url: string;
};

export type WikiGraphEdge = {
	from: string;
	to: string;
};

export type WikiGraph = {
	nodes: WikiGraphNode[];
	edges: WikiGraphEdge[];
	incoming: Map<string, WikiGraphNode[]>;
};

const WIKI_LINK = /(?<!!)(?:^|[^!])\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;

function extractWikiTargets(body: string): string[] {
	const targets = new Set<string>();
	for (const match of body.matchAll(WIKI_LINK)) {
		const target = match[1]?.trim();
		if (target) targets.add(target);
	}
	return [...targets];
}

function isPublished(entry: CollectionEntry<"posts">): boolean {
	return entry.data.draft !== true;
}

/**
 * Builds the canonical graph from Obsidian-style wiki links.  The same
 * visibility filter is intentionally used by backlinks and both graph routes.
 */
export async function getWikiGraph(includePrivate = false): Promise<WikiGraph> {
	const allPosts = (await getCollection("posts")).filter(isPublished);
	const visiblePosts = includePrivate
		? allPosts
		: allPosts.filter((post) => post.data.private !== true);
	const visibleBySlug = new Map(
		visiblePosts.map((post) => [post.data.slug, post]),
	);
	const nodes = visiblePosts.map((post) => ({
		slug: post.data.slug,
		title: post.data.title,
		category: post.data.category ?? null,
		tags: post.data.tags ?? [],
		private: post.data.private,
		url: getPostUrlBySlug(
			post.data.slug,
			post.data.private,
			includePrivate,
		),
	}));
	const nodeBySlug = new Map(nodes.map((node) => [node.slug, node]));
	const edges: WikiGraphEdge[] = [];

	for (const source of visiblePosts) {
		for (const target of extractWikiTargets(source.body ?? "")) {
			if (target === source.data.slug || !visibleBySlug.has(target)) continue;
			edges.push({ from: source.data.slug, to: target });
		}
	}

	const incoming = new Map<string, WikiGraphNode[]>();
	for (const edge of edges) {
		const source = nodeBySlug.get(edge.from);
		if (!source) continue;
		const links = incoming.get(edge.to) ?? [];
		links.push(source);
		incoming.set(edge.to, links);
	}

	return { nodes, edges, incoming };
}
