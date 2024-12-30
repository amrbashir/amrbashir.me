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
		"btn-link": `decoration-none flex items-center gap-1 rd-2 color-inherit
					   transition-color-400 opacity-60 hover:opacity-100`,
	},
	transformers: [transformerVariantGroup(), transformerDirectives()],
	presets: [
		presetUno(),
		presetTypography({
			cssExtend: {
				h1: {
					color: "white",
					"font-weight": "800",
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
