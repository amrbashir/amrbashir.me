import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import mdx from "@astrojs/mdx";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
	site: "https://amrbashir.me",
	integrations: [UnoCSS(), mdx()],
	markdown: {
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
