<script lang="ts">
	import Navbar from "$lib/navbar.svelte";
	import Popups from "$lib/popup.svelte";
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
