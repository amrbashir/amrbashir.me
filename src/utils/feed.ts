import { Feed } from "feed";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function generateFeed(context: APIContext) {
	const site = context.site?.toString() || "https://amrbashir.me";

	let posts = await getCollection("posts");
	posts = posts.sort(
		(a, b) => new Date(b.data.published).valueOf() - new Date(a.data.published).valueOf(),
	);

	// find last updated date or last published date
	// whichever is later
	const lastUpdated = posts.reduce((latest, post) => {
		const publishedDate = new Date(post.data.published);
		const updatedDate = post.data.updated ? new Date(post.data.updated) : publishedDate;
		return updatedDate > latest ? updatedDate : latest;
	}, new Date(0));

	const feed = new Feed({
		title: "Amr Bashir",
		description: "Amr Bashir's blog about programming and computers.",
		id: site,
		link: site,
		language: "en",
		favicon: new URL("/favicon.svg", site).toString(),
		updated: lastUpdated,
		feedLinks: {
			rss: new URL("/rss.xml", site).toString(),
			atom: new URL("/feed.xml", site).toString(),
		},
		author: {
			name: "Amr Bashir",
			link: site,
		},
	});

	for (const post of posts) {
		const url = new URL(`/posts/${post.id}`, site).toString();
		const publishedDate = new Date(post.data.published);
		const updatedDate = post.data.updated ? new Date(post.data.updated) : undefined;

		feed.addItem({
			title: post.data.title,
			id: url,
			link: url,
			published: publishedDate,
			date: updatedDate || publishedDate,
			content: sanitizeHtml(parser.render(post.body ?? ""), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			}),
		});
	}

	return feed;
}
