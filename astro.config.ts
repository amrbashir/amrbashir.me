import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import sitemap from "@astrojs/sitemap";
import { addCopyButton } from "shiki-transformer-copy-button";
import { rehypeHeadingIds, type RemarkPlugin } from "@astrojs/markdown-remark";
import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";
import { SITE_URL } from "./src/utils/constants";
import remarkCodeTitle from "remark-code-title";

const remarkReadingTime: RemarkPlugin =
	() =>
	(tree, { data }) => {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro!.frontmatter!.minutes = readingTime.minutes;
	};

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	base: "/",
	integrations: [UnoCSS(), mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			themes: {
				dark: "min-dark",
				light: "min-dark",
			},
			transformers: [
				addCopyButton({
					toggle: 2000,
				}),
			],
		},
		remarkPlugins: [remarkReadingTime, remarkCodeTitle],
		rehypePlugins: [rehypeHeadingIds, rehypeAutolinkHeadings],
	},
});
