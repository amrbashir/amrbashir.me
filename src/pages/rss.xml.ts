import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

let posts = await getCollection("posts");

posts = posts.sort(
	(a, b) =>
		new Date(b.data.updated || b.data.pubDate).valueOf() -
		new Date(a.data.updated || a.data.pubDate).valueOf(),
);

export const GET = () =>
	rss({
		title: "Amr Bashir's Blog",
		description: "Amr Bashir's personal blog.",
		site: import.meta.env.SITE,
		items: posts.map((post) => {
			return {
				link: `/post/${post.data.slug}`,
				title: post.data.title,
				pubDate: new Date(post.data.pubDate),
				content: post.body,
			};
		}),
	});
