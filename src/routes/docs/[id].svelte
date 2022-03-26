<script lang="ts">
	export let html: string;
	export let all: string[];
</script>

<div class="flex flex-1 bg-slate-200 dark:bg-slate-700">
	<div class="w-1/6 bg-slate-300 dark:bg-slate-600 flex flex-col gap-2">
		<div class="dark:bg-slate-400 text-center text-2xl font-semibold pb-1">Docs pages</div>
		{#each all as name}
			<a href="/docs/{name}" class="capitalize dark:bg-slate-500 text-center text-md font-semibold hover:dark:bg-slate-400 hover:scale-[1.1] transition-all">{name}</a>
		{/each}
	</div>
	<div class="flex-1 prose prose-neutral p-3 max-w-none dark:prose-invert">
		{@html html}
	</div>
</div>
