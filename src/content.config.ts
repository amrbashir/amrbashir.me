import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const posts = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/posts" }),

	schema: z.object({
		title: z.string(),
		slug: z.string(),
		pubDate: z.union([z.string(), z.date()]),
		updated: z.union([z.string(), z.date()]).optional(),
	}),
});

export const collections = { posts };
