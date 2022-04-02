import adapter from "@sveltejs/adapter-static"
import preprocess from "svelte-preprocess"
import { dev } from "./src/lib/conf.js"

/** @type {import("@sveltejs/kit").Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			fallback: "index.html"
		}),

		// For deployment
		paths: {
			base: dev ? "" : "/simple-game-maker"
		}
	}
}

export default config
