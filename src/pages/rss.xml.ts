import { generateFeed } from "../utils/feed";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
	const feed = await generateFeed(context);
	return new Response(feed.rss2(), {
		headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
	});
}
