export function slugify(text: string, maxLen?: number): string {
	const slug = text
		.toString()
		.normalize("NFD") // Normalize to decomposed form
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/[^\w\-]+/g, "") // Remove all non-word chars except hyphens
		.replace(/\-\-+/g, "-"); // Replace multiple hyphens with a single hyphen

	if (!maxLen || slug.length <= maxLen) return slug;
	// Truncate at the last hyphen before maxLen so we cut at a word bound.
	const cut = slug.lastIndexOf("-", maxLen);
	return cut > 0 ? slug.slice(0, cut) : slug.slice(0, maxLen);
}
