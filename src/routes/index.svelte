<script lang="ts">
	import ConsoleOutput from "$lib/consoleOutput.svelte";
	import OptionMenu from "$lib/optionMenu.svelte";
	import resizeable from "$lib/resizeable";
	import { themeData, themeLightOrDark } from "$lib/themeData";
	import type { Ace } from "ace-builds";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	interface NewConsole extends Console {
		oldLog(...data: any[]): void;
	}

	let editor: Ace.Editor;
	onMount(async () => {
		/* -------------------------------------------------------------------------- */
		/*                                 Ace editor                                 */
		/* -------------------------------------------------------------------------- */
		const { config, edit } = await import("ace-builds");
		await import("ace-builds/src-noconflict/ext-language_tools");

		config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-noconflict/");

		editor = edit("editor", {
			showPrintMargin: false,
			// @ts-expect-error: Ace has poor documentation this should exist
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
			theme: "ace/theme/one_dark",
			mode: "ace/mode/javascript",
			value: 'var foo = false;\nlet bar = true;\nconst FOO = "hello world!";\n\nif (foo) {\n\tconsole.log("Hello world!");\n} else {\n\tconsole.log("Goodbye world!");\n}\n\nfunction square(number) {\n\treturn number * number;\n}\nconst squareAnon = (number) => number * number;\n\nconst emotions = [":)", ":(", ">:(", ">:)", "<3"];\n\nconst car = {\n\tname: "Tesla",\n\tyear: "2025"\n};\n\nclass Person {\n\tconstructor(name, age) {\n\t\tthis.name = name;\n\t\tthis.age = age;\n\t}\n\n\tinfo() {\n\t\tconsole.log(`${this.name} is ${this.age} years old!`);\n\t}\n}\n\nasync function main() {\n\tconsole.log("Async function!");\n}',
			wrap: true,
		});
		(<any>editor.session.on)("changeMode", (_: any, session: any) => {
			session.$worker.send("setOptions", [
				{
					esversion: 9,
					esnext: false,
				},
			]);
		});

		/* -------------------------------------------------------------------------- */
		/*                                  Resizing                                  */
		/* -------------------------------------------------------------------------- */
		resizeable(<HTMLDivElement>document.getElementById("resizer1"), () => editor.resize());
		resizeable(<HTMLDivElement>document.getElementById("resizer2"), () => editor.resize());

		/* -------------------------------------------------------------------------- */
		/*                             localStorage theme                             */
		/* -------------------------------------------------------------------------- */
		const localTheme = localStorage.getItem("theme");
		if (localTheme && themeLightOrDark[localTheme]) toggleTheme(localTheme);

		const localFontSize = parseInt(localStorage.getItem("fontSize"));
		if (localFontSize) changeEditorFontSize(localFontSize);

		/* -------------------------------------------------------------------------- */
		/*                               burgerMenuOpen                               */
		/* -------------------------------------------------------------------------- */
		document.addEventListener("keydown", (event) => {
			if (event.code !== "Escape" || !burgerMenuOpen) return;
			burgerMenuOpen = false;
		});
	});

	let burgerMenuOpen = false;
	let playButtonLoading = false;

	// Custom console output for play
	let consoleOutput: any[] = [{ newConsoleOutput: true, date: Date.now() }];
	(<NewConsole>console).oldLog = console.log;
	console.log = (...data: any[]) => (consoleOutput = [...consoleOutput, data]);

	// MAIN EXECUTE FUNCTION
	const play = async () => {
		if (playButtonLoading) return;

		// Differencitate the new console logs from the later ones
		consoleOutput = [...consoleOutput, { newConsoleOutput: true, date: Date.now() }];

		// TODO Eval doesnt wait till async
		playButtonLoading = true;
		await eval(editor.getValue());
		playButtonLoading = false;
	};

	let currentTheme = "one_dark";
	const toggleTheme = (theme: string) => {
		editor.setTheme(`ace/theme/${theme}`);
		localStorage.setItem("theme", theme);
		currentTheme = theme;
		const mode = themeLightOrDark[theme];
		if (mode === "light") {
			document.documentElement.classList.remove("dark");
			return;
		}
		document.documentElement.classList.add("dark");
	};

	let currentFontSize = 12;
	const changeEditorFontSize = (fontSize: number) => {
		editor.setOption("fontSize", fontSize);
		currentFontSize = fontSize;
		localStorage.setItem("fontSize", `${fontSize}`);
	};

	let consoleOutputAutoScroll: boolean;
</script>

<div class="absolute top-0 right-0 bottom-0 left-0 flex">
	<div class="w-1/2 relative">
		<div id="editor" class="absolute top-0 right-0 bottom-0 left-0" />

		{#if burgerMenuOpen}
			<OptionMenu
				options={{
					editor: {
						checkboxOptions: [
							["Toggle overflow wrap", (on) => editor.session.setUseWrapMode(on), true],
							[
								"Enable autocompletion",
								(on) => {
									editor.setOptions({
										enableBasicAutocompletion: on,
										enableLiveAutocompletion: on,
									});
								},
								true,
							],
						],
						dropdownOptions: [
							["Select theme", themeData.map((theme) => [`${theme[2] === "dark" ? "🌑" : "☀"} - ${theme[0]}`, theme[1]]), toggleTheme, currentTheme],
							[
								"Font size",
								[8, 12, 24, 32, 40].map((size) => [`${size}${size === 12 ? " (deafult)" : ""}`, `${size}`]),
								(size) => changeEditorFontSize(parseInt(size)),
								`${currentFontSize}`,
							],
						],
					},
					console: {
						checkboxOptions: [["Auto scroll to bottom in console", (on) => (consoleOutputAutoScroll = on), true]],
						dropdownOptions: [],
					},
				}}
			/>
		{/if}

		<div class="absolute flex flex-col top-2 right-2 gap-1">
			<button
				class="bg-slate-500 rounded-2xl shadow-sm shadow-black w-8 h-8 relative {burgerMenuOpen
					? 'opacity-80'
					: 'opacity-40'} hover:opacity-100 hover:rounded-lg hover:scale-[1.1] transition-all duration-300 group z-20"
				on:click={() => (burgerMenuOpen = !burgerMenuOpen)}
			>
				<span class="sr-only">Open main menu</span>
				<div class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<span
						aria-hidden="true"
						class="dark:bg-slate-800 bg-slate-300 block absolute h-0.5 w-5 transform group-hover:scale-[1.1] transition-all duration-500 ease-in-out {burgerMenuOpen
							? 'rotate-45'
							: '-translate-y-1.5'}"
					/>
					<span
						aria-hidden="true"
						class="dark:bg-slate-800 bg-slate-300 block absolute h-0.5 w-5 transform group-hover:scale-[1.1] transition-all duration-500 ease-in-out {burgerMenuOpen ? 'opacity-0' : ''}"
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
				{#if playButtonLoading}
					<svg in:fade class="animate-spin h-5 w-5 text-white dark:text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-50" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
						<path class="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
				{:else}
					<div in:fade class="w-5 h-5 ml-1">
						<svg id="triangle" viewBox="0 0 100 100" class="dark:stroke-slate-800 stroke-slate-300 dark:fill-slate-800 fill-slate-300" xmlns="http://www.w3.org/2000/svg">
							<polygon points="100 50, 0, 0, 0 100" />
						</svg>
					</div>
				{/if}
			</button>
		</div>
	</div>

	<div class="cursor-ew-resize w-2 bg-slate-300 dark:bg-slate-600 shadow-sm shadow-black z-50" id="resizer1" data-direction="horizontal" />

	<div style="display: flex; flex: 1 1 0%; flex-direction: column">
		<div class="bg-slate-100 dark:bg-slate-700 h-3/4 grid place-items-center text-2xl font-semibold text-black dark:text-white">Right</div>
		<div id="resizer2" class="h-2 bg-slate-400 dark:bg-slate-500 shadow-sm shadow-black cursor-ns-resize z-40" data-direction="vertical" />
		<div class="bg-slate-100 dark:bg-slate-700 flex-1 text-2xl font-semibold text-black dark:text-white overflow-auto">
			<ConsoleOutput {consoleOutput} bind:autoScroll={consoleOutputAutoScroll} />
		</div>
	</div>
</div>

<style>
</style>
