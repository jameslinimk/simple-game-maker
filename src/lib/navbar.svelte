<script lang="ts">
	import { auth } from "./firebase";
</script>

<div class="relative flex bg-slate-300 dark:bg-slate-500 w-full z-10 p-2 pt-2 pb-2 h-12">
	<!-- LEFT -->
	<div class="absolute top-1/2 -translate-y-1/2 flex gap-2">
		{#if !auth.currentUser}
			<a href="/login?type=signup" class="bg-slate-400 dark:bg-slate-700 shadow-sm shadow-black rounded-2xl p-1 text-white hover:rounded-lg hover:scale-[1.1] transition-all duration-300">
				Sign up
			</a>
		{:else}
			<a href="/account" class="bg-slate-400 dark:bg-slate-700 shadow-sm shadow-black rounded-2xl p-1 text-white hover:rounded-lg hover:scale-[1.1] transition-all duration-300"> Projects </a>
		{/if}
		<a
			href={auth.currentUser ? "/signout" : "/login"}
			class="bg-slate-400 dark:bg-slate-700 shadow-sm shadow-black rounded-2xl p-1 text-white hover:rounded-lg hover:scale-[1.1] transition-all duration-300"
		>
			{auth.currentUser ? "Sign out" : "Log in"}
		</a>
	</div>

	<!-- CENTER -->
	<div class="absolute left-1/2 -translate-x-1/2 flex gap-2 top-1/2 -translate-y-1/2">
		<a href="/" class="text-2xl font-bold">Simple Game Maker</a>
	</div>

	<!-- RIGHT -->
	<div class="absolute top-1/2 -translate-y-1/2 flex gap-2 right-2">
		<a href="/" class="bg-slate-400 dark:bg-slate-700 shadow-sm shadow-black rounded-2xl p-1 text-white hover:rounded-lg hover:scale-[1.1] transition-all duration-300"> Home </a>
		<a href="/docs" class="bg-slate-400 dark:bg-slate-700 shadow-sm shadow-black rounded-2xl p-1 text-white hover:rounded-lg hover:scale-[1.1] transition-all duration-300"> Docs </a>
	</div>
</div>
