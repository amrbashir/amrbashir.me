import type { APIContext } from "astro";
import { generateFeed } from "../utils/feed";

export async function GET(context: APIContext) {
	const feed = await generateFeed(context);
	return new Response(feed.atom1(), {
		headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
	});
}
