import {
	defineConfig,
	presetUno,
	transformerVariantGroup,
	presetTypography,
	transformerDirectives,
} from "unocss";

export default defineConfig({
	theme: {
		colors: {
			accent: "#6fa76d",
		},
	},
	shortcuts: {
		spacer: "flex-1",
		separator: "b-1 b-solid b-dark dark:b-light opacity-30",
		"btn-link": `decoration-none flex items-center gap-1 rd-2 color-inherit
					   transition-color-400 opacity-60 hover:opacity-100`,
	},
	transformers: [transformerVariantGroup(), transformerDirectives()],
	presets: [
		presetUno(),
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
					"text-decoration-color": "#55555542",
				},
				"a:hover": {
					"text-decoration-color": "#000",
				},
				"html.dark a": {
					color: "white",
					"text-decoration-color": "#cdcdcd42",
				},
				"html.dark a:hover": {
					"text-decoration-color": "#fff",
				},
			},
		}),
	],
});
