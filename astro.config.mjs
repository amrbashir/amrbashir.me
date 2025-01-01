import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import Icons from "unplugin-icons/vite";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	integrations: [UnoCSS(), mdx()],
	vite: {
		plugins: [
			Icons({
				compiler: "astro",
				defaultClass: "inline-block align-text-bottom",
			}),
		],
	},
});
