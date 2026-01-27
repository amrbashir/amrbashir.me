import fs from "fs";
import sharp from "sharp";
import ogTemplateRaw from "../assets/og-template.svg?raw";

export async function generateOgImage(title: string | null, ogFileName: string) {
	// breakline every 30 chars
	// https://github.com/antfu/antfu.me/blob/e1c316863c2cf8d649274b872a3229e971c505b5/vite.config.ts#L247
	const lines = (title ?? "an open source enthusiast")
		.split(/(.{0,30})(?:\s|$)/g)
		.filter(Boolean);

	// Replace placeholders in SVG template
	const ogTemplate = ogTemplateRaw
		.replace("{{line1}}", lines[0] ?? "")
		.replace("{{line2}}", lines[1] ?? "");

	const ogTemplateBuffer = Buffer.from(ogTemplate);
	const filePath = `public/og/${ogFileName}`;

	try {
		await fs.promises.mkdir("public/og", { recursive: true });
		await sharp(ogTemplateBuffer).resize(1200, 675).png().toFile(filePath);
		log(`${blue("  └─")}${dim(` ${filePath}`)}`);
	} catch (e) {
		log(`${blue("  └─")}${dim(` ${filePath}`)} ${red("✖")}`);
	}
}

// -----------------
// Logging utilities
// -----------------

const ANSI_BLUE = "\u001b[34m";
const ANSI_RESET = "\u001b[0m";
const ANSI_DIM = "\u001b[2m";
const ANSI_RED = "\u001b[31m";

function dim(text: string) {
	return `${ANSI_DIM}${text}${ANSI_RESET}`;
}

function red(text: string) {
	return `${ANSI_RED}${text}${ANSI_RESET}`;
}

function blue(text: string) {
	return `${ANSI_BLUE}${text}${ANSI_RESET}`;
}

function log(message: string) {
	const timestamp = Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).format(Date.now());

	console.log(`\n${dim(timestamp)} ${message}`);
}
