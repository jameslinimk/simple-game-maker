<script lang="ts">
	import { parseHref } from "$lib/conf"
	import { deleteUserData, getProjects, userObservable } from "$lib/firebase"
	import { onDestroy } from "svelte"
	import { fade } from "svelte/transition"

	let projects = getProjects()
	const unsubscribe = userObservable.subscribe(() => {
		projects = getProjects()
	})

	onDestroy(unsubscribe)

	let confirmDelete: false | string = false
</script>

<div class="flex-1 bg-slate-500">
	<div class="w-full dark:bg-slate-700 dark:text-white text-2xl font-semibold p-2">
		Your projects:
		<a href={parseHref("/new")} class="underline float-right">New project+</a>
	</div>
	{#await projects}
		<div>Getting projects...</div>
	{:then [projects, error]}
		{#if error}
			<div>
				{#if error === "not logged in"}
					You are not logged in, click <a href={parseHref("/login")}>here</a> to login!
				{:else}
					{error}
				{/if}
			</div>
		{:else}
			{#each Object.keys(projects) as name, i}
				<div class="ml-2 text-xl hover:text-2xl transition-all group">
					<button on:click={() => (confirmDelete = name)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							viewBox="0 0 24 24"
							class="group-hover:scale-105 group-hover:w-8 transition-all inline-block mb-1 fill-red-400"
							><path
								d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"
							/></svg
						>
					</button>

					<a href={parseHref(`/projects/${name}`)}>
						<div class="font-semibold inline-block w-6">
							{i + 1}
						</div>
						{name}
					</a>
				</div>
				<hr class="border-black" />
			{/each}
		{/if}
	{/await}

	{#if confirmDelete}
		<div
			in:fade
			out:fade
			class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-slate-400 shadow-sm shadow-black text-2xl font-semibold rounded-md"
		>
			Are you sure you want to <strong>permantly</strong> delete "{confirmDelete}"?
			<div class="w-full flex justify-center gap-2 mt-1">
				<button
					class="bg-green-300 pb-1 pr-1 pl-1 rounded-md shadow-sm shadow-black hover:scale-[1.1] hover:rounded-sm transition-all"
					on:click={async () => {
						await deleteUserData(`/projects/${confirmDelete}`)
						confirmDelete = false
						projects = getProjects()
					}}
				>
					Yes, delete {confirmDelete} <strong>forever</strong>
				</button>
				<button
					class="bg-red-500 pb-1 pr-1 pl-1 rounded-md shadow-sm shadow-black hover:scale-[1.1] hover:rounded-sm transition-all"
					on:click={() => (confirmDelete = false)}
				>
					Cancel
				</button>
			</div>
		</div>
	{/if}
</div>
