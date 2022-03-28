<script lang="ts">
	import { auth } from "$lib/firebase";
	import firebaseCodes from "$lib/firebaseCodes";
	import { addPopup } from "$lib/popup";
	import { sendPasswordResetEmail } from "firebase/auth";
	import { onMount } from "svelte";

	let prevLink = "/";
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		prevLink = params.get("prevLink") || "/";
	});

	let email: string;

	const submit = async () => {
		if (emailError) return;

		if (!email) {
			emailError = "Please enter an email!";
			return;
		}

		let error = false;
		await sendPasswordResetEmail(auth, email).catch((err) => {
			const msg: string = err.message;

			if (msg.toLowerCase().includes("email")) {
				emailError = firebaseCodes[err.code] || msg;
				error = true;
				return;
			}

			generalError = msg;
			error = true;
		});
		if (error) return;
		addPopup("Sent!", `Sent a password reset email to ${email}`);
	};

	let emailError: false | string = false;
	let generalError: false | string = false;
</script>

<div class="h-full m-0 left-0 top-0 fixed w-full flex justify-center items-center bg-slate-400">
	<a
		href={prevLink}
		class="bg-blue-500 p-2 text-2xl rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300 absolute left-3 bottom-3"
	>
		Go back
	</a>
	<div class="grid place-items-center bg-slate-700 h-fit rounded-md p-5 gap-2 w-96 shadow-md shadow-black">
		<div class="flex gap-2">
			<div class="text-3xl font-semibold text-white bg-slate-800 pr-2 pl-2 rounded-md shadow-black shadow-sm inline-block">Password reset</div>
		</div>

		{#if generalError}
			<div class="text-[#f56565] text-xl mt-1 font-bold">{generalError}</div>
		{/if}

		<label for="email" class="text-2xl font-semibold text-white w-full">
			<div class="mb-1">Email</div>
			<input
				type="email"
				id="email"
				placeholder="example@gmail.com"
				class="shadow-md shadow-black rounded-sm text-black text-md pb-1 pl-1 pr-1 focus:scale-[1.05] transition-all duration-300 w-full {emailError ? 'border-[#f56565] border-2' : ''}"
				bind:value={email}
				on:input={() => (emailError = false)}
			/>
			{#if emailError}
				<div class="text-[#f56565] text-md mt-1 font-bold">{emailError}</div>
			{/if}
		</label>

		<div>
			<button
				on:click={submit}
				class="mt-2 mr-1 ml-1 bg-blue-500 p-2 text-2xl rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
			>
				Send reset link
			</button>
		</div>
	</div>
</div>
