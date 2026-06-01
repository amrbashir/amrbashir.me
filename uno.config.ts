import {
	defineConfig,
	transformerDirectives,
	presetIcons,
	presetWind4,
	presetTypography,
} from "unocss";

export default defineConfig({
	theme: {
		colors: {
			bg: "var(--bg)",
			fg: "var(--fg)",
			muted: "var(--muted)",
			faint: "var(--faint)",
			rule: "var(--rule)",
			accent: "var(--accent)",
			inset: "var(--inset)",
		},
		font: {
			mono: "var(--my-font-mono)",
		},
	},
	transformers: [transformerDirectives()],
	presets: [
		presetWind4(),
		presetTypography({
			colorScheme: {
				body: ["rgba(from var(--fg) r g b / 0.85)", "rgba(from var(--fg) r g b / 0.85)"],
			},
		}),
		presetIcons({
			extraProperties: {
				display: "inline-block",
				height: "1.2em",
				width: "1.2em",
				"vertical-align": "text-bottom",
			},
		}),
	],
});
