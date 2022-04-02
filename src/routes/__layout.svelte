<script lang="ts">
	import Navbar from "$lib/navbar.svelte"
	import Popups from "$lib/popup.svelte"
	import { themeLightOrDark } from "$lib/themeData"
	import { onMount } from "svelte"

	onMount(() => {
		const localTheme = localStorage.getItem("theme")
		if (localTheme && themeLightOrDark[localTheme]) {
			if (themeLightOrDark[localTheme] === "light") {
				document.documentElement.classList.remove("dark")
				return
			}
			document.documentElement.classList.add("dark")
		} else {
			// Default theme is dark
			localStorage.setItem("theme", "dark")
			document.documentElement.classList.add("dark")
		}
	})
</script>

<div class="flex flex-col absolute left-0 top-0 w-full h-full">
	<Navbar />
	<slot />
</div>

<Popups />

<style type="text/postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
