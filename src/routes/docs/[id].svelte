<script lang="ts">
	export let html: string;
</script>

<div class="top-0 left-0 absolute w-full h-full bg-slate-200" />

<div class="prose prose-neutral p-3 max-w-none z-10">
	{@html html}
</div>
