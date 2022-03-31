<script lang="ts">
	import { slide } from "svelte/transition"
</script>

<div in:slide out:slide class="absolute top-0 right-0 bottom-0 left-0 bg-slate-300 dark:bg-gray-700 z-10 p-3 m-5 shadow-lg shadow-black">
	<button>Save</button>
	<input type="text" id="fname" name="fname" />
</div>
