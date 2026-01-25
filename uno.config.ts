import {
	defineConfig,
	transformerDirectives,
	presetIcons,
	presetWind4,
	presetTypography,
	presetWebFonts,
} from "unocss";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";

export default defineConfig({
	theme: {
		colors: {
			accent: "#6fa76d",
		},
	},
	transformers: [transformerDirectives()],
	presets: [
		presetWind4(),
		presetTypography(),
		presetWebFonts({
			fonts: {
				sans: "Inter",
				mono: "DM Mono",
				condensed: "Roboto Condensed",
				wisper: "Bad Script",
			},
			processors: createLocalFontProcessor(),
		}),
		presetIcons({
			extraProperties: {
				display: "inline-block",
				height: "1.2em",
				width: "1.2em",
				"vertical-align": "text-bottom",
			},
			/* prettier-ignore */
			collections: {
			myicons: FileSystemIconLoader("./src/assets/icons"),
			devicon: () => import("@iconify-json/devicon").then((i) => i.default as any),
			ri: () => import("@iconify-json/ri").then((i) => i.default as any),
			"simple-icons": () => import("@iconify-json/simple-icons").then((i) => i.default as any),
			"skill-icons": () => import("@iconify-json/skill-icons").then((i) => i.default as any),
		},
		}),
	],
});
