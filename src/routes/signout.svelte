<script lang="ts">
	import { auth } from "$lib/firebase";
	import { signOut } from "firebase/auth";

	let error: false | string = false;
	const signout = signOut(auth).catch((err) => {
		error = err;
		return null;
	});
</script>

{#await signout}
	<div>Signing out...</div>
{:then _}
	{#if error}
		<div>Error {error}</div>
	{:else}
		<div>Signed out!</div>
	{/if}
{/await}
