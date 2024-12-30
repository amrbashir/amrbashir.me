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
		"btn-link": `decoration-none flex items-center gap-1 rounded-full color-inherit
					   transition-color-400 opacity-60 hover:opacity-100`,
	},
	transformers: [transformerVariantGroup(), transformerDirectives()],
	presets: [
		presetUno(),
		presetTypography({
			cssExtend: {
				a: {
					color: "black",
					"text-decoration": "none",
				},
				"html.dark a": {
					color: "white",
				},
				"a:hover": {
					"text-decoration": "underline",
				},
			},
		}),
	],
});
