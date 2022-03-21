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

<div class="flex flex-col gap-2">
	{#each consoleOutput as output, i}
		{#if "newConsoleOutput" in output && output.newConsoleOutput === true && "date" in output && typeof output.date === "number"}
			<div class="bg-slate-600 text-base font-semibold p-1">Console output @ {moment(new Date(output.date)).format("ddd, MMMM Mo LTS")}:</div>
		{:else}
			<div class="text-sm font-normal pr-1 pl-1">{output}</div>
			{#if consoleOutput[i + 1] && !("newConsoleOutput" in consoleOutput[i + 1] && consoleOutput[i + 1].newConsoleOutput === true && "date" in consoleOutput[i + 1] && typeof consoleOutput[i + 1].date === "number")}
				<hr />
			{/if}
		{/if}
	{/each}
	{#if autoScroll}
		<div class="text-sm text-center pb-2" bind:this={bottomDiv}>Autoscroll enabled (go into options to change)</div>
	{/if}
</div>
