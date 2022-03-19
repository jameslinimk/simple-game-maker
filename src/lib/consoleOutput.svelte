<script lang="ts">
	import moment from "moment";
	import { afterUpdate } from "svelte";

	export let consoleOutput: any[];
	export let autoScroll = true;

	let bottomDiv: HTMLDivElement;

	afterUpdate(() => {
		if (bottomDiv && autoScroll) bottomDiv.scrollIntoView();
	});
</script>

<div class="flex flex-col gap-1 p-0.5">
	{#each consoleOutput as output}
		{#if "newConsoleOutput" in output && output.newConsoleOutput === true && "date" in output && typeof output.date === "number"}
			<div class="bg-slate-400 shadow-md shadow-black text-base font-semibold p-1">Console output @ {moment(new Date(output.date)).format("ddd, MMMM Mo LTS")}:</div>
		{:else}
			<div class="text-sm font-normal">{output}</div>
		{/if}
	{/each}
	{#if autoScroll}
		<div class="text-sm text-center" bind:this={bottomDiv}>Autoscroll enabled (go into options to change)</div>
	{/if}
</div>
