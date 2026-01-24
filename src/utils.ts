export function slugFromFilePath(filePath: string): string {
	const filename = filePath.split("/").pop() || "";
	return filename.replace(/\.mdx?$/, "");
}
