import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

let posts = await getCollection("posts");

posts = posts.sort(
	(a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
);

export const GET = () =>
	rss({
		title: "Amr Bashir",
		description: "Amr Bashir's blog about programming and computers.",
		site: import.meta.env.SITE,
		customData: `
		<link rel="self" href="/rss.xml"/>
		<id>https://amrbashir.me</id>
		<author>
			<name>Amr Bashir</name>
			<uri>https://amrbashir.me</uri>
		</author>
		<category term="programming"/>
		<category term="computers"/>
		<category term="rust"/>
		<category term="html"/>
		<category term="css"/>
		<category term="javascript"/>
		<category term="typescript"/>
		<category term="tauri"/>
		<category term="windows"/>
		<category term="linux"/>
		`,
		items: posts.map((post) => {
			return {
				link: `/posts/${post.id}`,
				title: post.data.title,
				pubDate: new Date(post.data.pubDate),
				content: post.body,
			};
		}),
	});
