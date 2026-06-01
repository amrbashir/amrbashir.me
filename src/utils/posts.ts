import { getCollection } from "astro:content";

export async function getSortedPosts() {
	const posts = await getCollection("posts");
	return posts
		.sort((a, b) => new Date(b.data.published).valueOf() - new Date(a.data.published).valueOf())
		.map((post) => {
			// @ts-expect-error minutes added by remarkReadingTime in astro.config.ts
			const minutes: number = post.rendered?.metadata?.frontmatter?.minutes || 0;
			return {
				post,
				minutes,
			};
		});
}
