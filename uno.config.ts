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
		"btn-link": `color-current decoration-none flex items-center gap-1 rd-[500rem]
		opacity-50 hover:opacity-100 focus-visible:opacity-100 transition-opacity-400`,
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
		presetIcons({
			scale: 1.2,
		}),
	],
});
