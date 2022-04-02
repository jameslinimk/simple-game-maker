<script lang="ts">
	import { categories } from "$lib/docs/docs"
	import toggles from "$lib/docs/toggles"

	export let html: string
	export let currentPage: string
</script>

<div class="flex flex-1 bg-slate-200 dark:bg-slate-700">
	<div class="w-1/6 bg-slate-100 dark:bg-slate-600 flex flex-col">
		<div class="dark:bg-slate-300 bg-slate-400 text-center sm:text-2xl text-xl font-semibold pb-1 mb-2 transition-all">Docs pages</div>
		{#each Object.keys(categories) as category}
			<button
				class="capitalize bg-slate-{$toggles[category] ? '300' : '200'} dark:bg-slate-{$toggles[category]
					? '300'
					: '400'} transition-all duration-300 text-left sm:text-xl pl-1 text-sm font-semibold"
				on:click={() => ($toggles[category] = !$toggles[category])}
			>
				{category}
				{#if $toggles[category]}
					<svg class="inline-block" fill="none" height="9" viewBox="0 0 14 9" width="14" xmlns="http://www.w3.org/2000/svg"
						><path d="m1 1 6 6 6-6" stroke="#000" stroke-width="2" /></svg
					>
				{:else}
					<svg class="inline-block mb-0.5" fill="none" height="14" viewBox="0 0 9 14" width="9" xmlns="http://www.w3.org/2000/svg"
						><path d="m1 13 6-6-6-6" stroke="#000" stroke-width="2" /></svg
					>
				{/if}
			</button>
			{#if $toggles[category]}
				<div class="flex ml-[5%] flex-col">
					{#each categories[category] as page}
						<a
							href="docs/{page}"
							class="pl-1 w-full capitalize bg-slate-200 dark:bg-slate-500 text-md font-semibold hover:dark:bg-slate-300 transition-all"
						>
							{page}{currentPage === page ? " (selected)" : ""}
						</a>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
	<div class="flex-1 prose prose-neutral p-3 max-w-none dark:prose-invert">
		{@html html}
	</div>
</div>
