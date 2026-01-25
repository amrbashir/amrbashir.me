import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import mdx from "@astrojs/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import sitemap from "@astrojs/sitemap";
import { addCopyButton } from "shiki-transformer-copy-button";

// https://astro.build/config
export default defineConfig({
	site: "https://amrbashir.me",
	base: "/",
	integrations: [UnoCSS(), mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			theme: "vitesse-dark",
			transformers: [
				addCopyButton({
					toggle: 2000,
				}),
			],
		},
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "wrap",
					properties: {
						class: "not-prose heading-link",
					},
				},
			],
		],
	},
});
