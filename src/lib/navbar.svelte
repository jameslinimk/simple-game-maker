<script>
	import { auth } from "./firebase";
</script>

<div class="flex bg-slate-300 dark:bg-slate-500 w-full z-10 p-1 gap-1 pt-2 pb-2">
	{#if !auth.currentUser}
		<a href="/login?type=signup" class="bg-slate-400 dark:bg-slate-700 shadow-sm shadow-black rounded-2xl p-1 text-white hover:rounded-lg hover:scale-[1.1] transition-all duration-300">
			Sign up
		</a>
	{:else}
		<a href="/account" class="bg-slate-400 dark:bg-slate-700 shadow-sm shadow-black rounded-2xl p-1 text-white hover:rounded-lg hover:scale-[1.1] transition-all duration-300"> Projects </a>
	{/if}
	<a
		href={auth.currentUser ? "/signout" : "/login?type=signin"}
		class="bg-slate-400 dark:bg-slate-700 shadow-sm shadow-black rounded-2xl p-1 text-white hover:rounded-lg hover:scale-[1.1] transition-all duration-300"
	>
		{auth.currentUser ? "Sign out" : "Log in"}
	</a>
</div>
