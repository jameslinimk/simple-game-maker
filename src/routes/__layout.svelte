<script lang="ts">
	import Popups from "$lib/popup.svelte";
</script>

<slot />
<Popups />

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
