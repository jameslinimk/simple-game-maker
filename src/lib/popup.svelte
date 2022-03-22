<script lang="ts">
	import { fade } from "svelte/transition";
	import popups from "./popup";
</script>

<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 justify-center items-center z-50">
	{#each $popups as popup}
		<div in:fade out:fade class="bg-red-600 p-2 rounded-md">
			<div class="font-semibold text-lg">{popup[0]}</div>
			<div>{popup[1]}</div>
		</div>
	{/each}
</div>
