<script lang="ts">
	import { auth } from "$lib/firebase"
	import { signOut } from "firebase/auth"
	import { onMount } from "svelte"

	let prevLink = "/"
	onMount(() => {
		const params = new URLSearchParams(window.location.search)
		prevLink = params.get("prevLink") || "/"
	})

	let error = false
	const signout = auth.currentUser
		? signOut(auth).catch((err) => {
				console.log("%cError (formatting code):", "color: #DC2626; font-weight: 800", err)
				error = true
		  })
		: "no account"
</script>

<div class="h-full m-0 left-0 top-0 fixed w-full grid place-content-center bg-slate-400">
	<a
		href={prevLink}
		class="bg-blue-500 p-2 text-2xl rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300 absolute left-3 bottom-3"
	>
		Go back
	</a>
	<div class="grid place-items-center bg-slate-700 h-fit rounded-md p-5 gap-2 shadow-md shadow-black">
		<div class="flex gap-2">
			<div class="text-3xl font-semibold text-white bg-slate-800 pr-2 pl-2 rounded-md shadow-black shadow-sm inline-block">
				{#if signout === "no account"}
					You aren't logged in!
				{:else}
					{#await signout}
						Signing out...
					{:then _}
						{#if error}
							An unexpected error has occured!
						{:else}
							Signed out!
						{/if}
					{/await}
				{/if}
			</div>
			<a
				href="/login"
				class="bg-blue-500 p-2 text-md rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
			>
				Log in
			</a>
		</div>
	</div>
</div>
