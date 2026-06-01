export function dateLong(date: Date | string) {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("en-UK", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	});
}

export function dateShort(date: Date | string) {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("en-UK", {
		day: "2-digit",
		month: "short",
	});
}
