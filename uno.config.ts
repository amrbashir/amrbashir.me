import { defineConfig, presetUno, transformerVariantGroup, presetIcons } from "unocss";

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			scale: 1.2,
		}),
	],
	transformers: [transformerVariantGroup()],
	shortcuts: {
		"btn-link": `color-current decoration-none flex items-center gap-1 rd-[500rem]
					 opacity-50 hover:opacity-100 focus-visible:opacity-100 transition-opacity-400`,
	},
});
