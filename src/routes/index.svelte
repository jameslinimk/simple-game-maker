<script lang="ts">
	import ConsoleOutput from "$lib/consoleOutput.svelte"
	import execute from "$lib/execute"
	import format from "$lib/format"
	import sGame, { running } from "$lib/game/sGame"
	import OptionMenu from "$lib/optionMenu.svelte"
	import resizeable from "$lib/resizeable"
	import SaveMenu from "$lib/saveMenu.svelte"
	import { themeData, themeLightOrDark } from "$lib/themeData"
	import type { Ace } from "ace-builds"
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"

	let editor: Ace.Editor
	onMount(async () => {
		/* -------------------------------------------------------------------------- */
		/*                                 Ace editor                                 */
		/* -------------------------------------------------------------------------- */
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
			value:
				'var foo = false\nlet bar = true\nconst FOO = "hello world!"\n\nif (foo) {\n\tconsole.log("Hello world!")\n} else {\n\tconsole.log("Goodbye world!")\n}\n\nfunction square(number) {\n\treturn number * number\n}\nconst squareAnon = (number) => number * number\n\nconst emotions = [":)", ":(", ">:(", ">:)", "<3"]\n\nconst car = {\n\tname: "Tesla",\n\tyear: "2025",\n}\n\nclass Person {\n\tconstructor(name, age) {\n\t\tthis.name = name\n\t\tthis.age = age\n\t}\n\n\tinfo() {\n\t\tconsole.log(`${this.name} is ${this.age} years old!`)\n\t}\n}\n\nasync function main() {\n\tconsole.log("Async function!")\n}\n\ndo {\n\tlet test = false\n} while (true)\n\nwhile (true) {\n\tlet test2 = true\n}\n',
			wrap: true
		})
		;(<any>editor.session.on)("changeMode", (_: any, session: any) => {
			session.$worker.send("changeOptions", [
				{
					esversion: 9,
					esnext: false,
					asi: !currentSemicolons
				}
			])
		})
		;[...document.getElementsByClassName("ace_scrollbar-v")].forEach((item: HTMLDivElement) => (item.style.width = "0"))

		/* -------------------------------------------------------------------------- */
		/*                                  Resizing                                  */
		/* -------------------------------------------------------------------------- */
		resizeable(<HTMLDivElement>document.getElementById("resizer1"), () => editor.resize())
		resizeable(<HTMLDivElement>document.getElementById("resizer2"), () => editor.resize())

		/* -------------------------------------------------------------------------- */
		/*                             localStorage theme                             */
		/* -------------------------------------------------------------------------- */
		const localTheme = localStorage.getItem("theme")
		if (localTheme && themeLightOrDark[localTheme]) toggleTheme(localTheme)

		const localFontSize = parseInt(localStorage.getItem("fontSize"))
		if (localFontSize) changeEditorFontSize(localFontSize)

		const localSemicolons = localStorage.getItem("semicolons")
		if (localSemicolons && (localSemicolons === "true" || localSemicolons === "false")) toggleSemicolons(localSemicolons === "true")

		/* -------------------------------------------------------------------------- */
		/*                               burgerMenuOpen                               */
		/* -------------------------------------------------------------------------- */
		document.addEventListener("keydown", (event) => {
			if (event.code !== "Escape") return
			if (burgerMenuOpen) burgerMenuOpen = false
			if (saveMenuOpen) saveMenuOpen = false
		})
	})

	let burgerMenuOpen = false
	let saveMenuOpen = false

	let currentTheme = "one_dark"
	const toggleTheme = (theme: string) => {
		editor.setTheme(`ace/theme/${theme}`)
		localStorage.setItem("theme", theme)
		currentTheme = theme
		const mode = themeLightOrDark[theme]
		if (mode === "light") {
			document.documentElement.classList.remove("dark")
			return
		}
		document.documentElement.classList.add("dark")
	}

	let currentFontSize = 12
	const changeEditorFontSize = (fontSize: number) => {
		editor.setOption("fontSize", fontSize)
		currentFontSize = fontSize
		localStorage.setItem("fontSize", `${fontSize}`)
	}

	let currentSemicolons = false
	const toggleSemicolons = (on: boolean) => {
		if (editor.session.$worker) {
			editor.session.$worker.send("changeOptions", [
				{
					asi: !on
				}
			])
		}
		prettierFormat.semi = on
		currentSemicolons = on
		localStorage.setItem("semicolons", `${on}`)
	}

	let consoleOutputAutoScroll: boolean

	let consoleOutput: any[] = [{ newConsoleOutput: true, date: Date.now() }]
	const play = async () => {
		if ($running) {
			sGame.stop()
			return
		}

		consoleOutput = [...consoleOutput, ...(await execute(editor.getValue()))]
	}

	/**
	 * https://prettier.io/docs/en/options.html#parser
	 */
	const prettierFormat = {
		useTabs: true,
		semi: false
	}
</script>

<div class="flex flex-1">
	<div class="w-1/2 relative">
		<div id="editor" class="no-scrollbar w-full h-full" />

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
							["Select theme", themeData.map((theme) => [`${theme[2] === "dark" ? "🌑" : "☀"} - ${theme[0]}`, theme[1]]), toggleTheme, currentTheme],
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

		{#if saveMenuOpen}
			<SaveMenu />
		{/if}

		<div class="absolute flex flex-col top-2 right-2 gap-1 items-end">
			<button
				class="bg-slate-500 rounded-2xl shadow-sm shadow-black w-8 h-8 relative {burgerMenuOpen || saveMenuOpen
					? 'opacity-80'
					: 'opacity-40'} hover:opacity-100 hover:rounded-lg hover:scale-[1.1] transition-all duration-300 group z-20"
				on:click={() => {
					if (!saveMenuOpen) burgerMenuOpen = !burgerMenuOpen
					saveMenuOpen = false
				}}
			>
				<div class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<span
						aria-hidden="true"
						class="dark:bg-slate-800 bg-slate-300 block absolute h-0.5 w-5 transform group-hover:scale-[1.1] transition-all duration-500 ease-in-out {burgerMenuOpen ||
						saveMenuOpen
							? 'rotate-45'
							: '-translate-y-1.5'}"
					/>
					<span
						aria-hidden="true"
						class="dark:bg-slate-800 bg-slate-300 block absolute h-0.5 w-5 transform group-hover:scale-[1.1] transition-all duration-500 ease-in-out {burgerMenuOpen ||
						saveMenuOpen
							? 'opacity-0'
							: ''}"
					/>
					<span
						aria-hidden="true"
						class="dark:bg-slate-800 bg-slate-300 block absolute h-0.5 w-5 transform group-hover:scale-[1.1] transition-all duration-500 ease-in-out {burgerMenuOpen ||
						saveMenuOpen
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
					<svg class="animate-spin h-5 w-5 text-white dark:text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
				on:click={() => (saveMenuOpen = !saveMenuOpen)}
				class="bg-slate-500 rounded-2xl shadow-sm shadow-black w-8 h-8 relative opacity-40 hover:opacity-100 hover:rounded-lg hover:scale-[1.1] transition-all duration-300 grid place-items-center"
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
			<button
				on:click={() => format(editor, prettierFormat)}
				class="bg-slate-500 shadow-sm shadow-black rounded-2xl opacity-40 p-1 text-white dark:text-black hover:opacity-80 hover:rounded-lg hover:scale-[1.1] transition-all duration-300"
			>
				Format
			</button>
		</div>
	</div>

	<div class="cursor-ew-resize w-2 bg-slate-300 dark:bg-slate-600 z-50" id="resizer1" data-direction="horizontal" />

	<div style="display: flex; flex: 1 1 0%; flex-direction: column">
		<div class="bg-slate-100 dark:bg-slate-700 h-3/4 grid place-items-center text-2xl font-semibold text-black dark:text-white">
			<canvas id="gameCanvas" class="w-full h-full" bind:this={sGame.canvas} />
		</div>
		<div id="resizer2" class="h-2 bg-slate-300 dark:bg-slate-600 cursor-ns-resize z-40" data-direction="vertical" />
		<div class="bg-slate-100 dark:bg-gray-800 flex-1 text-2xl font-semibold text-black dark:text-white overflow-auto">
			<ConsoleOutput {consoleOutput} bind:autoScroll={consoleOutputAutoScroll} />
		</div>
	</div>
</div>
