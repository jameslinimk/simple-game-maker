<script lang="ts">
	import optionValues from "$lib/optionValues";
	import { slide } from "svelte/transition";

	export let options: {
		[key: string]: {
			checkboxOptions: [label: string, onToggle: (on: boolean) => any, defaultValue: boolean][];
			dropdownOptions: [label: string, options: [label: string, value: string][], onChange: (value: string) => any, defaultValue: string][];
		};
	};

	Object.keys(options).forEach((key) => {
		if ($optionValues[key] === undefined) {
			$optionValues[key] = [{}, {}];
			options[key].checkboxOptions.forEach((option, i) => {
				$optionValues[key][0][i] = option[2];
			});
			options[key].dropdownOptions.forEach((option, i) => {
				$optionValues[key][1][i] = option[3];
			});
		}
	});
</script>

<div in:slide out:slide class="absolute top-0 right-0 bottom-0 left-0 bg-slate-300 dark:bg-gray-700 z-10 p-3 m-5 shadow-lg shadow-black">
	<div>
		{#each Object.keys(options) as key}
			<div class="dark:text-white text-black text-2xl font-semibold capitalize">{key} options:</div>
			<hr class="border-2 rounded-md m-1 dark:border-white border-black" />
			{#each options[key].checkboxOptions as option, i}
				<label for="toggle-{option[0]}" class="flex items-center cursor-pointer p-2">
					<div class="relative">
						<input
							type="checkbox"
							id="toggle-{option[0]}"
							class="sr-only"
							checked={$optionValues[key][0][i]}
							on:click={(event) => {
								{
									// @ts-ignore: Will always have checked (cant use casting in non script tag in svelte ">:(")
									const checked = event.target.checked;

									$optionValues[key][0][i] = checked;
									option[1](checked);
								}
							}}
						/>
						<div class="block bg-gray-800 w-14 h-8 rounded-full" />
						<div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
					</div>

					<div class="ml-3 text-black dark:text-white text-lg font-semibold">{option[0]}</div>
				</label>
			{/each}

			{#each options[key].dropdownOptions as option, i}
				<label for="dropdonw-{option[0]}" class="flex items-center p-2">
					<select
						id="test"
						class="bg-gray-800 text-white p-1 rounded-md font-semibold text-md"
						value={$optionValues[key][1][i]}
						on:change={(event) => {
							// @ts-ignore: Will always have checked (cant use casting in non script tag in svelte ">:(")
							const value = event.target.value;

							$optionValues[key][1][i] = value;
							option[2](value);
						}}
					>
						{#each option[1] as subOption}
							<option value={subOption[1]}>{subOption[0]}</option>
						{/each}
					</select>

					<div class="ml-3 text-black dark:text-white text-lg font-semibold">{option[0]}</div>
				</label>
			{/each}
		{/each}
	</div>
</div>

<style>
	input:checked ~ .dot {
		transform: translateX(100%);
		background-color: #48bb78;
	}
</style>
