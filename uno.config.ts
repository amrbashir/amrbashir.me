import {
	defineConfig,
	presetUno,
	transformerVariantGroup,
	presetTypography,
	transformerDirectives,
	presetIcons,
} from "unocss";

export default defineConfig({
	theme: {
		colors: {
			accent: "#6fa76d",
		},
	},
	shortcuts: {
		separator: "b-1 b-solid b-dark/10 dark:b-light/10",
		"btn-link": `decoration-none flex items-center gap-1 rd-2 color-inherit
					   transition-color-400 opacity-60 hover:opacity-100`,
	},
	transformers: [transformerVariantGroup(), transformerDirectives()],
	presets: [
		presetUno(),
		presetIcons({}),
		presetTypography({
			cssExtend: {
				h1: {
					color: "black",
					"font-weight": "800",
				},
				"html.dark h1": {
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
		}),
	],
});
