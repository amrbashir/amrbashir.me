import {
	defineConfig,
	presetUno,
	transformerVariantGroup,
	presetTypography,
	transformerDirectives,
	presetIcons,
} from "unocss";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";

const icons = () =>
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
			carbon: () => import("@iconify-json/carbon").then((i) => i.default as any),
			ri: () => import("@iconify-json/ri").then((i) => i.default as any),
			"simple-icons": () => import("@iconify-json/simple-icons").then((i) => i.default as any),
			"skill-icons": () => import("@iconify-json/skill-icons").then((i) => i.default as any),
		},
	});

const typography = () =>
	presetTypography({
		cssExtend: {
			"h1,h2,h3,h4,h5,h6": {
				color: "black",
				"font-weight": "800",
			},
			"html.dark h1, html.dark h2, html.dark h3, html.dark h4, html.dark h5, html.dark h6": {
				color: "white",
			},
			strong: {
				color: "black",
			},
			"html.dark strong": {
				color: "white",
			},
			a: {
				color: "black",
				"text-decoration": "none",
				transition: "border-bottom-color 300ms ease-in-out",
				"border-bottom": "0.5px solid",
				"border-bottom-color": "#55555542",
			},
			"a:hover": {
				"border-bottom-color": "#000",
			},
			"html.dark a": {
				color: "white",
				"border-bottom-color": "#cdcdcd42",
			},
			"html.dark a:hover": {
				"border-bottom-color": "#fff",
			},
		},
	});

export default defineConfig({
	theme: {
		colors: {
			accent: "#6fa76d",
		},
	},
	shortcuts: {
		separator: "b-1 b-solid b-dark/10 dark:b-light/10",
		"btn-link": `decoration-none flex items-center gap-1 rd-2 color-inherit
					   transition-opacity-400 opacity-60 hover:opacity-100`,
	},
	transformers: [transformerVariantGroup(), transformerDirectives()],
	presets: [presetUno(), icons(), typography()],
});
