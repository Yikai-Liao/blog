import { defineCollection } from "astro:content";
import type { CollectionConfig } from "astro/content/config";
import { glob } from "astro/loaders";
import { type ZodType, z } from "astro/zod";

const postSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type PostData = {
	title: string;
	slug: string;
	published: Date;
	updated?: Date;
	draft: boolean;
	description: string;
	author: string;
	image: string;
	tags: string[];
	category: string | null;
	private: boolean;
	lang: string;
	toc?: {
		depth?: 1 | 2 | 3;
	};
	prevTitle: string;
	prevSlug: string;
	prevPrivate: boolean;
	nextTitle: string;
	nextSlug: string;
	nextPrivate: boolean;
	publicPrevTitle: string;
	publicPrevSlug: string;
	publicPrevPrivate: boolean;
	publicNextTitle: string;
	publicNextSlug: string;
	publicNextPrivate: boolean;
	allPrevTitle: string;
	allPrevSlug: string;
	allPrevPrivate: boolean;
	allNextTitle: string;
	allNextSlug: string;
	allNextPrivate: boolean;
};

const postsLoader: ReturnType<typeof glob> = glob({
	base: "./contents",
	pattern: "[0-9][0-9][0-9][0-9]/**/[^_]*.{md,mdx}",
});
const postsSchema: ZodType<PostData> = z.object({
	title: z.string(),
	slug: z.string().regex(postSlugRegex),
	published: z.date(),
	updated: z.date().optional(),
	draft: z.boolean().optional().default(false),
	description: z.string().optional().default(""),
	author: z.string().optional().default(""),
	image: z.string().optional().default(""),
	tags: z.array(z.string()).optional().default([]),
	category: z.string().optional().nullable().default(""),
	private: z.boolean().optional().default(true),
	lang: z.string().optional().default(""),
	toc: z
		.object({
			depth: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
		})
		.optional(),

	/* For internal use */
	prevTitle: z.string().default(""),
	prevSlug: z.string().default(""),
	prevPrivate: z.boolean().default(false),
	nextTitle: z.string().default(""),
	nextSlug: z.string().default(""),
	nextPrivate: z.boolean().default(false),
	publicPrevTitle: z.string().default(""),
	publicPrevSlug: z.string().default(""),
	publicPrevPrivate: z.boolean().default(false),
	publicNextTitle: z.string().default(""),
	publicNextSlug: z.string().default(""),
	publicNextPrivate: z.boolean().default(false),
	allPrevTitle: z.string().default(""),
	allPrevSlug: z.string().default(""),
	allPrevPrivate: z.boolean().default(false),
	allNextTitle: z.string().default(""),
	allNextSlug: z.string().default(""),
	allNextPrivate: z.boolean().default(false),
});
const postsCollection: CollectionConfig<
	typeof postsSchema,
	typeof postsLoader
> = defineCollection({
	loader: postsLoader,
	schema: postsSchema,
});
const specLoader: ReturnType<typeof glob> = glob({
	base: "./src/content/spec",
	pattern: "**/*.md",
});
const specSchema: ZodType<Record<string, never>> = z.object({});
const specCollection: CollectionConfig<typeof specSchema, typeof specLoader> =
	defineCollection({
		loader: specLoader,
		schema: specSchema,
	});
export const collections: {
	posts: typeof postsCollection;
	spec: typeof specCollection;
} = {
	posts: postsCollection,
	spec: specCollection,
};
