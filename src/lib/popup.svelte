<script lang="ts">
	import { fade } from "svelte/transition"
	import popups from "./popup"
</script>

<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 justify-center items-center z-50">
	{#each $popups as popup}
		<button
			in:fade
			out:fade
			class="bg-{popup[3]} p-2 rounded-md shadow-md shadow-black"
			on:click={() => ($popups = $popups.filter((p) => p[2] !== popup[2]))}
		>
			<div class="font-semibold text-lg">{popup[0]}</div>
			<div>{popup[1]}</div>
		</button>
	{/each}
</div>
