<script lang="ts">
	import { slide } from "svelte/transition"
	import currentProject from "./currentProject"
</script>

<div in:slide out:slide class="absolute top-0 right-0 bottom-0 left-0 bg-slate-300 dark:bg-gray-700 z-10 p-3 m-5 shadow-lg shadow-black">
	{#if $currentProject}
		<button>Save</button>
	{:else}
		<button>Save projet as</button>
		<input type="text" id="fname" name="fname" />
	{/if}
</div>
