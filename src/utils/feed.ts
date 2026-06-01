import { Feed } from "feed";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import {
	AUTHOR,
	DEFAULT_DESCRIPTION,
	FAVICON_PATH,
	FEED_ATOM_PATH,
	FEED_RSS_PATH,
	SITE_URL,
} from "./constants";
const parser = new MarkdownIt();

export async function generateFeed(context: APIContext) {
	const site = context.site?.toString() || SITE_URL;

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
		title: AUTHOR,
		description: DEFAULT_DESCRIPTION,
		id: site,
		link: site,
		language: "en",
		favicon: new URL(FAVICON_PATH, site).toString(),
		updated: lastUpdated,
		feedLinks: {
			rss: FEED_RSS_PATH,
			atom: FEED_ATOM_PATH,
		},
		author: {
			name: AUTHOR,
			link: site,
		},
	});

	feed.addCategory("programming");
	feed.addCategory("computers");
	feed.addCategory("technology");

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
			category: post.data.categories?.map((category) => ({ name: category })) || [],
			content: sanitizeHtml(parser.render(post.body ?? ""), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			}),
		});
	}

	return feed;
}
