<script lang="ts">
	import { browser } from "$app/env"
	import { page } from "$app/stores"
	import ConsoleOutput from "$lib/consoleOutput.svelte"
	import currentProject from "$lib/currentProject"
	import execute from "$lib/execute"
	import { createProject, deleteUserData, getUserData, updateUserData, userObservable } from "$lib/firebase"
	import format from "$lib/format"
	import sGame from "$lib/game/sGame"
	import metatags from "$lib/metatags"
	import OptionMenu from "$lib/optionMenu.svelte"
	import { addPopup } from "$lib/popup"
	import resizeable from "$lib/resizeable"
	import { themeData, themeLightOrDark } from "$lib/themeData"
	import { esEdition } from "$lib/version"
	import type { Ace } from "ace-builds"
	import { onDestroy, onMount } from "svelte"
	import { MetaTags } from "svelte-meta-tags"
	import { fade } from "svelte/transition"

	const testCode =
		'var foo = false\nlet bar = true\nconst FOO = "hello world!"\n\nif (foo) {\n\tconsole.log("Hello world!")\n} else {\n\tconsole.log("Goodbye world!")\n}\n\nfunction square(number) {\n\treturn number * number\n}\nconst squareAnon = (number) => number * number\n\nconst emotions = [":)", ":(", ">:(", ">:)", "<3"]\n\nconst car = {\n\tname: "Tesla",\n\tyear: "2025",\n}\n\nclass Person {\n\tconstructor(name, age) {\n\t\tthis.name = name\n\t\tthis.age = age\n\t}\n\n\tinfo() {\n\t\tconsole.log(`${this.name} is ${this.age} years old!`)\n\t}\n}\n\nasync function main() {\n\tconsole.log("Async function!")\n}\n\ndo {\n\tlet test = false\n} while (false)\n\nwhile (false) {\n\tlet test2 = true\n}\n'

	let editor: Ace.Editor
	let unsaved = false
	let ogCode: string

	onMount(async () => {
		const { config, edit } = await import("ace-builds")
		await import("ace-builds/src-noconflict/ext-language_tools")

		config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-noconflict/")

		editor = edit("editor", {
			showPrintMargin: false,
			// @ts-expect-error: Ace has poor documentation this should exist
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
			theme: "ace/theme/one_dark",
			mode: "ace/mode/javascript",
			value: testCode,
			wrap: true
		})
		;[...document.getElementsByClassName("ace_scrollbar-v")].forEach((item: HTMLDivElement) => (item.style.width = "0"))
		;(<any>editor.session.on)("changeMode", (_: any, session: any) => {
			session.$worker.send("changeOptions", [
				{
					esversion: esEdition,
					asi: !currentSemicolons
				}
			])
		})

		/* -------------------------------------------------------------------------- */
		/*                                  Resizing                                  */
		/* -------------------------------------------------------------------------- */
		const onResize = () => {
			editor.resize()
			fitCanvas()
		}

		resizeable(<HTMLDivElement>document.getElementById("resizer1"), onResize)
		resizeable(<HTMLDivElement>document.getElementById("resizer2"), onResize)
	})

	/* --------------------------------- Project -------------------------------- */
	let warned = false
	const loadGivenProject = async () => {
		let paramsProject: string = null
		try {
			paramsProject = $page.url.searchParams.get("project")
		} catch (_) {}
		if (paramsProject && browser) {
			$currentProject = paramsProject
		}

		if ($currentProject) {
			const [code] = await getUserData(`/projects/${$currentProject}`)

			if (code !== null) {
				ogCode = code
				if (editor) editor.session.setValue(code)
				try {
					localStorage.setItem("project", $currentProject)
				} catch (_) {}
			} else {
				$currentProject = false
				try {
					localStorage.removeItem("project")
				} catch (_) {}
			}
		}

		let localProject: string = null
		try {
			localProject = localStorage.getItem("project")
		} catch (_) {}

		const project = localProject

		if (project) {
			const [code] = await getUserData(`/projects/${project}`)
			if (code !== null) {
				ogCode = code

				$currentProject = project
				if (editor) editor.session.setValue(code)

				try {
					localStorage.setItem("project", project)
				} catch (_) {}
			} else if (!warned && project) {
				warned = true
				addPopup(`Project "${project}" doesn't exist, loading default project`, "")
			}
		}

		if (editor && !ogCode) ogCode = editor.getValue()
		if (editor)
			editor.getSession().on(<any>"change", () => {
				if (editor.getValue() !== ogCode) unsaved = true
				else unsaved = false
			})
	}
	$: if (editor) loadGivenProject()

	const unsubscribe = userObservable.subscribe(() => {
		loadGivenProject()
	})
	onDestroy(unsubscribe)

	/* ------------------------------- Burger menu ------------------------------ */
	let burgerMenuOpen = false
	onMount(() =>
		document.addEventListener("keydown", (event) => {
			if (event.code !== "Escape") return
			if (burgerMenuOpen) burgerMenuOpen = false
		})
	)

	/* ---------------------------------- Theme --------------------------------- */
	let currentTheme = "one_dark"
	const toggleTheme = (theme?: string) => {
		if (!theme) {
			try {
				theme = localStorage.getItem("theme")
			} catch (_) {}
		}
		if (!theme) return
		if (!themeLightOrDark[theme]) return

		if (editor) editor.setTheme(`ace/theme/${theme}`)
		try {
			localStorage.setItem("theme", theme)
		} catch (_) {}
		currentTheme = theme
		const mode = themeLightOrDark[theme]
		if (mode === "light") {
			document.documentElement.classList.remove("dark")
			return
		}
		document.documentElement.classList.add("dark")
	}
	$: if (editor) toggleTheme()

	/* ---------------------------------- Font ---------------------------------- */
	let currentFontSize = 12
	const changeEditorFontSize = (fontSize?: number) => {
		if (!fontSize) {
			try {
				fontSize = parseInt(localStorage.getItem("fontSize"))
			} catch (_) {}
		}
		if (!fontSize) return

		editor.setOption("fontSize", fontSize)
		currentFontSize = fontSize
		try {
			localStorage.setItem("fontSize", `${fontSize}`)
		} catch (_) {}
	}
	$: if (editor) changeEditorFontSize()

	/* ------------------------------- Semicolons ------------------------------- */
	let currentSemicolons = false
	const toggleSemicolons = (on?: boolean) => {
		if (on === undefined) {
			let localSemicolons: string = null
			try {
				localSemicolons = localStorage.getItem("semicolons")
			} catch (_) {}
			if (localSemicolons && (localSemicolons === "true" || localSemicolons === "false")) on = localSemicolons === "true"
		}
		if (on === undefined) return

		if (editor.session.$worker) {
			editor.session.$worker.send("changeOptions", [
				{
					asi: !on
				}
			])
		}
		prettierFormat.semi = on
		currentSemicolons = on
		try {
			localStorage.setItem("semicolons", `${on}`)
		} catch (_) {}
	}
	$: if (editor) toggleSemicolons()

	/* ---------------------------------- Other --------------------------------- */
	let consoleOutputAutoScroll: boolean

	const running = sGame.running

	const play = async () => {
		if ($running) {
			sGame.stop()
			return
		}

		await execute(editor.getValue())
	}

	/**
	 * https://prettier.io/docs/en/options.html#parser
	 */
	const prettierFormat = {
		useTabs: true,
		semi: false
	}

	$: try {
		if (window) {
			if (!unsaved) {
				window.onbeforeunload = null
			} else {
				window.onbeforeunload = (event: BeforeUnloadEvent) => {
					const confirmationMessage =
						"It looks like you have been editing something. If you leave before saving, your changes will be lost."

					event.preventDefault()
					;(event || window.event).returnValue = confirmationMessage
					return confirmationMessage
				}
			}
		}
	} catch (error) {}

	let confirmDelete: false | string = false

	const save = () => {
		if (!$currentProject) return
		addPopup("Saved!", "Saved the current project!", 1000, "green-600")
		updateUserData({ [$currentProject]: editor.getValue() }, "/projects")
		unsaved = false
		return (ogCode = editor.getValue())
	}

	onMount(() =>
		document.addEventListener("keydown", (event) => {
			if (event.key.toLowerCase() === "s" && (event.ctrlKey || event.metaKey)) {
				save()
				event.preventDefault()
				return false
			}
		})
	)

	const fitCanvas = () => {
		if (!sGame.canvas || !canvasParent) return

		sGame.canvas.width = canvasParent.clientWidth
		sGame.canvas.height = canvasParent.clientHeight
	}

	let canvasParent: HTMLDivElement
	onMount(() => {
		fitCanvas()
		document.addEventListener("resize", fitCanvas)
	})
</script>

<MetaTags
	{...metatags({
		title: "Main Page",
		description:
			"Simple Game Maker is a tool for beginner coders to create and publish their own games using Javascript. SGM has easy to read code with extensive and easy to understand documentation.",
		urlRelativePath: ""
	})}
/>

<div class="flex flex-grow flex-col">
	<!-- /* -------------------------------------------------------------------------- */
	/*                                   TOPBAR                                   */
	/* -------------------------------------------------------------------------- */ -->
	<div
		class="bg-slate-100 dark:bg-slate-900 h-5 w-full hover:h-16 transition-all duration-300 dark:text-slate-300 text-sm grid place-items-center group relative"
	>
		<div class="group-hover:text-[0] transition-all duration-300">
			{$currentProject
				? `Working on "${$currentProject}" (Hover)${unsaved ? " *unsaved changes" : ""}`
				: `Not working on a project (Hover to create)${unsaved ? " *unsaved changes" : ""}`}
		</div>
		<div class="absolute top-0 left-0 w-full h-full group-hover:grid place-items-center hidden transition-all duration-300">
			<div class="flex gap-5">
				{#if $currentProject}
					<div class="flex flex-col">
						<button
							on:click={save}
							class="mt-1 bg-slate-500 rounded-2xl shadow-sm shadow-black w-8 h-8 opacity-60 hover:opacity-100 hover:rounded-lg hover:scale-[1.1] transition-all duration-300 grid place-items-center"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="p-1.5 dark:fill-slate-800 fill-slate-300" viewBox="0 0 407.096 407.096">
								<path
									d="M402.115,84.008L323.088,4.981C319.899,1.792,315.574,0,311.063,0H17.005C7.613,0,0,7.614,0,17.005v373.086
	c0,9.392,7.613,17.005,17.005,17.005h373.086c9.392,0,17.005-7.613,17.005-17.005V96.032
	C407.096,91.523,405.305,87.197,402.115,84.008z M300.664,163.567H67.129V38.862h233.535V163.567z"
								/>
								<path
									d="M214.051,148.16h43.08c3.131,0,5.668-2.538,5.668-5.669V59.584c0-3.13-2.537-5.668-5.668-5.668h-43.08
	c-3.131,0-5.668,2.538-5.668,5.668v82.907C208.383,145.622,210.92,148.16,214.051,148.16z"
								/>
							</svg>
						</button>
						<div class="mt-1">Save</div>
					</div>
				{/if}
				<div class="flex flex-col">
					<button
						on:click={async () => {
							if (
								$currentProject &&
								unsaved &&
								!confirm(
									"You have some unsaved work, creating a new project will delte all of your unsaved work!, are you sure you want to continue?"
								)
							)
								return

							const [id, error] = await createProject($currentProject ? "" : editor.getValue())
							if (error) return addPopup("You are not logged in!", "Please login", 1500, "green-600")
							if ($currentProject) {
								editor.session.setValue("")
								ogCode = ""
							}
							$currentProject = id
							try {
								localStorage.setItem("project", id)
							} catch (_) {}
							addPopup("Created and loaded a project", `with an id of "${id}"`, 3000, "green-600")
						}}
						class="mt-1 bg-slate-500 rounded-2xl shadow-sm shadow-black w-8 h-8 opacity-60 hover:opacity-100 hover:rounded-lg hover:scale-[1.1] transition-all duration-300 grid place-items-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="dark:fill-slate-800 fill-slate-300"
							><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" /></svg
						>
					</button>
					<div class="mt-1">{$currentProject ? "New" : "Save"}</div>
				</div>
				{#if $currentProject}
					<div class="flex flex-col">
						<button
							on:click={() => (confirmDelete = $currentProject)}
							class="mt-1 bg-slate-500 rounded-2xl shadow-sm shadow-black w-8 h-8 opacity-60 hover:opacity-100 hover:rounded-lg hover:scale-[1.1] transition-all duration-300 grid place-items-center"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="2" viewBox="0 0 24 24" class="w-6 dark:fill-slate-800 fill-slate-300"
								><path
									d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"
								/></svg
							>
						</button>
						<div class="mt-1">Delte</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if confirmDelete}
		<div
			in:fade
			out:fade
			class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-slate-400 shadow-sm shadow-black text-2xl font-semibold rounded-md z-50"
		>
			Are you sure you want to <strong>permantly</strong> delete "{confirmDelete}"?
			<div class="w-full flex justify-center gap-2 mt-1">
				<button
					class="bg-green-300 pb-1 pr-1 pl-1 rounded-md shadow-sm shadow-black hover:scale-[1.1] hover:rounded-sm transition-all"
					on:click={async () => {
						await deleteUserData(`/projects/${confirmDelete}`)
						addPopup(`Deleted "${$currentProject}"`, "")
						$currentProject = false
						confirmDelete = false
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

	<!-- /* -------------------------------------------------------------------------- */
	/*                                    MAIN                                    */
	/* -------------------------------------------------------------------------- */ -->
	<div class="flex-grow flex">
		<div class="w-1/2 relative">
			<div id="editor" class="w-full h-full" />

			{#if burgerMenuOpen}
				<OptionMenu
					options={{
						editor: {
							checkboxOptions: [
								["Toggle overflow wrap", (on) => editor.session.setUseWrapMode(on), true],
								[
									"Enable code autocompletion",
									(on) => {
										editor.setOptions({
											enableBasicAutocompletion: on,
											enableLiveAutocompletion: on
										})
									},
									true
								],
								["Semicolons", (on) => toggleSemicolons(on), currentSemicolons]
							],
							dropdownOptions: [
								[
									"Select theme",
									themeData.map((theme) => [`${theme[2] === "dark" ? "🌑" : "☀"} - ${theme[0]}`, theme[1]]),
									toggleTheme,
									currentTheme
								],
								[
									"Font size",
									[8, 10, 12, 14, 16, 18, 20, 22, 24].map((size) => [`${size}${size === 12 ? " (deafult)" : ""}`, `${size}`]),
									(size) => changeEditorFontSize(parseInt(size)),
									`${currentFontSize}`
								]
							]
						},
						console: {
							checkboxOptions: [["Auto scroll to bottom in console", (on) => (consoleOutputAutoScroll = on), true]],
							dropdownOptions: []
						}
					}}
				/>
			{/if}

			<div class="absolute flex flex-col top-2 right-2 gap-1 items-end">
				<button
					class="bg-slate-500 rounded-2xl shadow-sm shadow-black w-8 h-8 relative {burgerMenuOpen
						? 'opacity-80'
						: 'opacity-40'} hover:opacity-100 hover:rounded-lg hover:scale-[1.1] transition-all duration-300 group z-20"
					on:click={() => {
						burgerMenuOpen = !burgerMenuOpen
					}}
				>
					<div class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
						<span
							aria-hidden="true"
							class="dark:bg-slate-800 bg-slate-300 block absolute h-0.5 w-5 transform group-hover:scale-[1.1] transition-all duration-500 ease-in-out {burgerMenuOpen
								? 'rotate-45'
								: '-translate-y-1.5'}"
						/>
						<span
							aria-hidden="true"
							class="dark:bg-slate-800 bg-slate-300 block absolute h-0.5 w-5 transform group-hover:scale-[1.1] transition-all duration-500 ease-in-out {burgerMenuOpen
								? 'opacity-0'
								: ''}"
						/>
						<span
							aria-hidden="true"
							class="dark:bg-slate-800 bg-slate-300 block absolute h-0.5 w-5 transform group-hover:scale-[1.1] transition-all duration-500 ease-in-out {burgerMenuOpen
								? '-rotate-45'
								: 'translate-y-1.5'}"
						/>
					</div>
				</button>
				<button
					class="bg-slate-500 rounded-2xl shadow-sm shadow-black w-8 h-8 relative opacity-40 hover:opacity-100 hover:rounded-lg hover:scale-[1.1] transition-all duration-300 grid place-items-center"
					on:click={play}
				>
					{#if $running}
						<svg
							class="animate-spin h-5 w-5 text-white dark:text-slate-900"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle class="opacity-50" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path
								class="opacity-100"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					{:else}
						<div in:fade class="w-5 h-5 ml-1">
							<svg
								id="triangle"
								viewBox="0 0 100 100"
								class="dark:stroke-slate-800 stroke-slate-300 dark:fill-slate-800 fill-slate-300"
								xmlns="http://www.w3.org/2000/svg"
							>
								<polygon points="100 50, 0, 0, 0 100" />
							</svg>
						</div>
					{/if}
				</button>
				<button
					on:click={() => format(editor, prettierFormat)}
					class="bg-slate-500 shadow-sm shadow-black rounded-2xl opacity-40 p-1 text-white dark:text-black hover:opacity-80 hover:rounded-lg hover:scale-[1.1] transition-all duration-300"
				>
					Format
				</button>
			</div>
		</div>

		<div class="cursor-ew-resize w-2 bg-slate-300 dark:bg-slate-600 z-30" id="resizer1" data-direction="horizontal" />

		<div class="flex flex-grow flex-col">
			<div
				class="bg-slate-100 dark:bg-slate-700 h-3/4 grid place-items-center text-2xl font-semibold text-black dark:text-white"
				bind:this={canvasParent}
			>
				<canvas class="w-full h-full" bind:this={sGame.canvas} />
			</div>
			<div id="resizer2" class="h-2 bg-slate-300 dark:bg-slate-600 cursor-ns-resize z-30" data-direction="vertical" />
			<ConsoleOutput bind:autoScroll={consoleOutputAutoScroll} />
		</div>
	</div>
</div>
