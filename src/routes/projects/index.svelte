<script lang="ts">
	import { getProjects, userObservable } from "$lib/firebase"
	import { onDestroy } from "svelte"

	let projects = getProjects()
	const unsubscribe = userObservable.subscribe(() => {
		projects = getProjects()
	})

	onDestroy(unsubscribe)
</script>

{#await projects}
	<div>Getting projects...</div>
{:then [projects, error]}
	{#if error}
		<div>
			{#if error === "not logged in"}
				You are not logged in, click <a href="/login">here</a> to login!
			{:else}
				{error}
			{/if}
		</div>
	{:else}
		{#each Object.keys(projects) as name}
			<div>
				{name}
			</div>
		{/each}
	{/if}
{/await}
