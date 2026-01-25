import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const posts = defineCollection({
	loader: glob({ pattern: "*.{md,mdx}", base: "./src/posts" }),

	schema: z.object({
		title: z.string(),
		readTime: z.number(),
		pubDate: z.union([z.string(), z.date()]),
		updated: z.union([z.string(), z.date()]).optional(),
	}),
});

export const collections = { posts };
