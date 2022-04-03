<script lang="ts">
	import { parseHref } from "$lib/conf"
	import { auth, generalTests, overrideUserData, projectFuncsTest, userObservable } from "$lib/firebase"
	import firebaseCodes from "$lib/firebaseCodes"
	import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
	import { onMount } from "svelte"

	let prevLink = "/"
	let type: "login" | "signup" = "login"
	onMount(() => {
		const params = new URLSearchParams(window.location.search)
		prevLink = params.get("prevLink") || "/"
		const rawType = params.get("type")
		type = rawType === "signup" || rawType === "login" ? rawType : "login"
	})

	let email: string
	let username: string
	$: if (username) username = username.replace(/[ ]+/g, "_").replace(/[^A-Za-z0-9_'"-]+/g, "")
	let password: string

	const submit = async () => {
		if (emailError || usernameError || passwordError || generalError) return

		if (type === "signup" && !username) {
			usernameError = "Please enter an username!"
			return
		}
		if (!email) {
			emailError = "Please enter an email!"
			return
		}
		if (!password) {
			passwordError = "Please enter a password!"
			return
		}

		if (type === "signup" && username.length > 25) {
			usernameError = `Username must be less than 25 characters! (${username.length - 25} characters over)`
			return
		}

		if (type === "signup" && !/^[A-Za-z0-9_'"-]*$/.test(username)) {
			usernameError = "Username must only contain letters, numbers, -, _, ', and \"s!"
			return
		}

		if (type === "signup" && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
			passwordError = "Password must be longer than 8 characters and contain at least 1 letter and number!"
			return
		}

		if (type === "signup") {
			const credential = await createUserWithEmailAndPassword(auth, email, password).catch((error) => {
				const msg: string = error.message

				if (msg.toLowerCase().includes("email")) {
					emailError = firebaseCodes[error.code] || msg
					return
				}

				if (msg.toLowerCase().includes("password")) {
					passwordError = firebaseCodes[error.code] || msg
					return
				}

				generalError = firebaseCodes[error.code] || msg
				return
			})
			if (!credential) return

			await overrideUserData({ username: username })
			return true
		}

		const credential = await signInWithEmailAndPassword(auth, email, password).catch((error) => {
			const msg: string = error.message

			if (msg.toLowerCase().includes("email")) {
				emailError = firebaseCodes[error.code] || msg
				return
			}

			if (msg.toLowerCase().includes("password")) {
				passwordError = firebaseCodes[error.code] || msg
				return
			}

			generalError = firebaseCodes[error.code] || msg
			return
		})
		if (!credential) return

		return true
	}

	let emailError: false | string = false
	let usernameError: false | string = false
	let passwordError: false | string = false
	let generalError: false | string = false
</script>

<div class="h-full m-0 left-0 top-0 fixed w-full grid place-content-center bg-slate-400">
	<a
		href={parseHref(prevLink)}
		class="bg-blue-500 p-2 text-2xl rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300 absolute left-3 bottom-3"
	>
		Go back
	</a>
	<div class="grid place-items-center bg-slate-700 h-fit rounded-md p-5 gap-2 w-96 shadow-md shadow-black">
		{#if $userObservable}
			<div class="flex gap-2 w-full">
				<div class="text-2xl font-semibold text-white pr-2 pl-2 rounded-md inline-block w-48">You are already logged in!</div>
				<a
					href={parseHref("/signout")}
					class="grid place-items-center flex-1 bg-blue-500 p-2 text-xl rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
				>
					Sign out
				</a>
			</div>
		{:else}
			<div class="flex gap-2">
				<div class="text-3xl font-semibold text-white bg-slate-800 pr-2 pl-2 rounded-md shadow-black shadow-sm inline-block">
					{type === "login" ? "Log in" : "Sign up"}
				</div>
				<button
					on:click={() => {
						type = type === "login" ? "signup" : "login"
						emailError = false
						passwordError = false
						usernameError = false
						generalError = false
						password = ""
						username = ""
						email = ""
					}}
					class="bg-blue-500 p-2 text-md rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
				>
					{type === "login" ? "Create an account" : "Log in to existing account"}
				</button>
			</div>

			{#if generalError}
				<div class="text-[#f56565] text-xl mt-1 font-bold">{generalError}</div>
			{/if}

			{#if type === "signup"}
				<label for="username" class="text-2xl font-semibold text-white w-full">
					<div class="mb-1">Username</div>
					<input
						type="text"
						id="username"
						placeholder="my_epic_username-2"
						maxlength="25"
						class="shadow-md shadow-black rounded-sm text-black text-md pb-1 pl-1 pr-1 focus:scale-[1.05] transition-all duration-300 w-full {usernameError
							? 'border-[#f56565] border-2'
							: ''}"
						bind:value={username}
						on:input={() => (usernameError = false)}
					/>
					{#if usernameError}
						<div class="text-[#f56565] text-md mt-1 font-bold">{usernameError}</div>
					{/if}
				</label>
			{/if}

			<label for="email" class="text-2xl font-semibold text-white w-full">
				<div class="mb-1">Email</div>
				<input
					type="email"
					id="email"
					placeholder="example@gmail.com"
					class="shadow-md shadow-black rounded-sm text-black text-md pb-1 pl-1 pr-1 focus:scale-[1.05] transition-all duration-300 w-full {emailError
						? 'border-[#f56565] border-2'
						: ''}"
					bind:value={email}
					on:input={() => (emailError = false)}
				/>
				{#if emailError}
					<div class="text-[#f56565] text-md mt-1 font-bold">{emailError}</div>
				{/if}
			</label>

			<label for="password" class="text-2xl font-semibold text-white w-full">
				<div class="mb-1">Password</div>
				<input
					type="password"
					id="password"
					placeholder="********"
					class="shadow-md shadow-black rounded-sm text-black text-md pb-1 pl-1 pr-1 focus:scale-[1.05] transition-all duration-300 w-full {passwordError
						? 'border-[#f56565] border-2'
						: ''}"
					bind:value={password}
					on:input={() => (passwordError = false)}
				/>
				{#if passwordError}
					<div class="text-[#f56565] text-md mt-1 font-bold">{passwordError}</div>
				{/if}
			</label>

			<div>
				<button
					on:click={submit}
					class="mt-2 mr-1 ml-1 bg-blue-500 p-2 text-2xl rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
				>
					Submit
				</button>
				{#if type === "login"}
					<a
						href={parseHref("forgot?prevLink=/login")}
						class="mt-2 mr-1 ml-1 bg-blue-500 p-2 text-md rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
					>
						Forgot your password?
					</a>
				{/if}
			</div>
		{/if}
	</div>

	<div class="mt-5 flex gap-2 flex-col">
		<button
			on:click={() => {
				generalTests()
			}}
			class="bg-blue-500 p-2 text-md rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
		>
			General test
		</button>
		<button
			on:click={() => {
				projectFuncsTest()
			}}
			class="bg-blue-500 p-2 text-md rounded-md shadow-sm shadow-black font-semibold text-white hover:scale-[1.1] hover:bg-slate-400 transition-all duration-300"
		>
			Project functions test
		</button>
	</div>
</div>
