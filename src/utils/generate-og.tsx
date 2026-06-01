// @ts-nocheck
/** @jsxRuntime classic */
/** @jsx h */
/** @jsxFrag Fragment */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import satori from "satori";
import {
	AUTHOR,
	AUTHOR_LOCATION,
	AUTHOR_ROLE,
	AUTHOR_TIMEZONE,
	COPYRIGHT,
	DEFAULT_DESCRIPTION,
	SITE_HOST,
} from "./constants";

interface OgImageOptions {
	title?: string;
	filePath: string;
	pathname: string;
}

const W = 1200;
const H = 630;

const PALETTE = {
	bg: "#0f0e0c",
	fg: "#ede9dd",
	muted: "#888378",
	faint: "#4f4b43",
	rule: "#262420",
	accent: "#f0b860",
};

const FONT_FAMILY = "JetBrains Mono";
const FONTS_DIR = "node_modules/@fontsource/jetbrains-mono/files";
const fontRegular = fs.readFileSync(path.join(FONTS_DIR, "jetbrains-mono-latin-400-normal.woff"));
const fontBold = fs.readFileSync(path.join(FONTS_DIR, "jetbrains-mono-latin-600-normal.woff"));

// Minimal JSX factory producing satori-compatible nodes.
// Fragments are inlined here so satori only sees real element nodes.
const Fragment = Symbol("Fragment");
function h(type, props, ...children) {
	const flat = children.flat(Infinity).filter((c) => c != null && c !== false);
	if (type === Fragment) return flat;
	const resolved = flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat;
	return { type, props: { ...(props || {}), children: resolved } };
}

export async function generateOgImage(options: OgImageOptions) {
	const { title, filePath, pathname } = options;

	try {
		const tree = OgCard({ title, pathname });
		const svg = await satori(tree, {
			width: W,
			height: H,
			fonts: [
				{ name: FONT_FAMILY, data: fontRegular, weight: 400, style: "normal" },
				{ name: FONT_FAMILY, data: fontBold, weight: 600, style: "normal" },
			],
		});
		await fs.promises.mkdir("public/og", { recursive: true });
		await sharp(Buffer.from(svg)).png().toFile(filePath);
		log(`${blue("  └─")}${dim(` ${filePath}`)}`);
	} catch (e) {
		log(`${blue("  └─")}${dim(` ${filePath}`)} ${red("✖")} ${dim(String(e))}`);
	}
}

// Sub-components are called as plain functions (not as JSX) in OgCard.
// Satori treats `<Foo />` as a component to instantiate itself — and breaks
// on our minimal `h` factory. Plain function calls return ready node trees.

function titleSize(title) {
	if (!title) return 104;
	if (title.length <= 22) return 80;
	if (title.length <= 60) return 64;
	return 48;
}

function GridTexture() {
	return (
		<div
			style={{
				display: "flex",
				position: "absolute",
				right: 0,
				top: 0,
				width: 340,
				height: H,
			}}
		>
			<div
				style={{
					display: "flex",
					position: "absolute",
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					opacity: 0.5,
					backgroundImage: `repeating-linear-gradient(to right,${PALETTE.faint} 0px,${PALETTE.faint} 1px,transparent 1px,transparent 28px),repeating-linear-gradient(to bottom,${PALETTE.faint} 0px,${PALETTE.faint} 1px,transparent 1px,transparent 28px)`,
				}}
			/>
			<div
				style={{
					display: "flex",
					position: "absolute",
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					backgroundImage: `linear-gradient(to right,${PALETTE.bg},rgba(15,14,12,0))`,
				}}
			/>
		</div>
	);
}

function CropMarks() {
	return [
		<div
			style={{
				display: "flex",
				position: "absolute",
				left: 32,
				top: 32,
				width: 24,
				height: 24,
				borderTop: `1px solid ${PALETTE.faint}`,
				borderLeft: `1px solid ${PALETTE.faint}`,
			}}
		/>,
		<div
			style={{
				display: "flex",
				position: "absolute",
				right: 32,
				bottom: 32,
				width: 24,
				height: 24,
				borderBottom: `1px solid ${PALETTE.faint}`,
				borderRight: `1px solid ${PALETTE.faint}`,
			}}
		/>,
	];
}

function Topbar() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "baseline",
			}}
		>
			<div style={{ display: "flex", fontSize: 26, color: PALETTE.fg, fontWeight: 600 }}>
				{AUTHOR}
				<span style={{ color: PALETTE.muted, fontWeight: 400 }}>
					{"  · " + AUTHOR_ROLE.toLowerCase()}
				</span>
			</div>
			<div
				style={{ fontSize: 22, color: PALETTE.muted }}
			>{`${AUTHOR_LOCATION}  · ${AUTHOR_TIMEZONE}`}</div>
		</div>
	);
}

function Title({ title, isHome }) {
	return (
		<div
			style={{
				display: "flex",
				fontSize: titleSize(title),
				fontWeight: 600,
				lineHeight: 0.95,
				color: PALETTE.fg,
				letterSpacing: "-0.035em",
				maxWidth: 1056,
				marginBottom: 28,
			}}
		>
			{isHome ? ["amrbashir", <span style={{ color: PALETTE.accent }}>.me</span>] : title}
		</div>
	);
}

function Tagline() {
	return (
		<div
			style={{
				fontSize: 22,
				color: PALETTE.muted,
				maxWidth: 920,
				lineHeight: 1.4,
				letterSpacing: "-0.005em",
			}}
		>
			{DEFAULT_DESCRIPTION}
		</div>
	);
}

function Center({ title, isHome }) {
	return (
		<div
			style={{
				display: "flex",
				flex: 1,
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			{Title({ title, isHome })}
			{isHome && Tagline()}
		</div>
	);
}

function BottomBar() {
	return (
		<div
			style={{
				display: "flex",
				borderTop: `1px solid ${PALETTE.faint}`,
				paddingTop: 22,
				justifyContent: "space-between",
			}}
		>
			<div style={{ fontSize: 22, color: PALETTE.fg, fontWeight: 600 }}>{SITE_HOST}</div>
			<div style={{ fontSize: 22, color: PALETTE.muted }}>{COPYRIGHT}</div>
		</div>
	);
}

function OgCard({ title, pathname }) {
	const isHome = pathname === "/" || pathname === "/index.html";

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				background: PALETTE.bg,
				fontFamily: FONT_FAMILY,
				color: PALETTE.fg,
				padding: "64px 72px",
				position: "relative",
			}}
		>
			{GridTexture()}
			{CropMarks()}
			{Topbar()}
			{Center({ title, isHome })}
			{BottomBar()}
		</div>
	);
}

// -----------------
// Logging utilities
// -----------------

const ANSI_BLUE = `\x1b[34m`;
const ANSI_RESET = `\x1b[0m`;
const ANSI_DIM = `\x1b[2m`;
const ANSI_RED = `\x1b[31m`;

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
