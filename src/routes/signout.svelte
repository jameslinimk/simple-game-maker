<script lang="ts">
	import { parseHref } from "$lib/conf"
	import { auth } from "$lib/firebase"
	import { signOut } from "firebase/auth"
	import { onMount } from "svelte"

	let prevLink = "/"
	onMount(() => {
		const params = new URLSearchParams(window.location.search)
		prevLink = params.get("prevLink") || "/"
	})

	let error = false
	let signout = signOut(auth)
</script>

<div class="h-full m-0 left-0 top-0 fixed w-full grid place-content-center bg-slate-400">
	<a
		href={parseHref(prevLink)}
		class="bg-blue-500 p-2 text-2xl rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300 absolute left-3 bottom-3"
	>
		Go back
	</a>
	<div class="grid place-items-center bg-slate-700 h-fit rounded-md p-5 gap-2 shadow-md shadow-black">
		<div class="flex gap-2">
			<div class="text-3xl font-semibold text-white pr-2 pl-2 rounded-md inline-block">Signed out!</div>
			<a
				href={parseHref("/login")}
				class="bg-blue-500 p-2 text-md rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
			>
				Log in
			</a>
		</div>
	</div>
</div>
