import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import sitemap from "@astrojs/sitemap";
import { addCopyButton } from "shiki-transformer-copy-button";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}

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
		remarkPlugins: [remarkReadingTime],
		rehypePlugins: [rehypeHeadingIds, rehypeAutolinkHeadings],
	},
});
