import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import Icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
	integrations: [UnoCSS()],
	vite: {
		plugins: [
			Icons({
				compiler: "astro",
			}),
		],
	},
});
