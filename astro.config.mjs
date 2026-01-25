import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import sitemap from "@astrojs/sitemap";
import { addCopyButton } from "shiki-transformer-copy-button";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
	site: "https://amrbashir.me",
	base: "/",
	integrations: [UnoCSS(), mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			themes: {
				dark: "vitesse-dark",
				light: "vitesse-light",
			},
			transformers: [
				addCopyButton({
					toggle: 2000,
				}),
			],
		},
		rehypePlugins: [rehypeHeadingIds, rehypeAutolinkHeadings],
	},
});
