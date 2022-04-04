<script lang="ts">
	import moment from "moment"
	import { afterUpdate } from "svelte"
	import consoleOutput from "./consoleOutput"

	export let autoScroll = true

	let bottomDiv: HTMLDivElement

	afterUpdate(() => {
		if (bottomDiv && autoScroll) bottomDiv.scrollIntoView()
	})
</script>

<div class="flex-1 bg-slate-100 dark:bg-gray-800 flex flex-col gap-2 text-white overflow-auto">
	{#each $consoleOutput as output, i}
		{#if typeof output === "object" && "newConsoleOutput" in output && output.newConsoleOutput === true && "date" in output && typeof output.date === "number"}
			<div class="bg-slate-200 dark:bg-slate-500 text-base font-semibold p-1">
				Console output @ {moment(new Date(output.date)).format("ddd, MMMM Mo LTS")}:
			</div>
		{:else}
			<div class="text-sm font-normal pr-1 pl-1">{typeof output === "object" ? JSON.stringify(output) : output}</div>
			{#if $consoleOutput[i + 1] && !(typeof $consoleOutput[i + 1] === "object" && "newConsoleOutput" in $consoleOutput[i + 1] && $consoleOutput[i + 1].newConsoleOutput === true && "date" in $consoleOutput[i + 1] && typeof $consoleOutput[i + 1].date === "number")}
				<hr />
			{/if}
		{/if}
	{/each}
	{#if autoScroll}
		<div class="text-sm text-center pb-2" bind:this={bottomDiv}>Autoscroll enabled (go into options to change)</div>
	{/if}
</div>
