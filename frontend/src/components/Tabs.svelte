<script context="module">
	let x = 0
</script>


<script lang="ts">
	// Constants/types
	type Value = $$Generic<string>


	// External state
	export let value: Value
	export let values: Value[]

	export let labels: Record<Value, string>
	export let getLabel: (Value) => string = value => labels?.[value] ?? value
	export let icons: Record<Value, string>
	export let getIcon: (Value) => string = value => icons?.[value]
	export let colors: Record<Value, string>
	export let getColor: (Value) => string = value => colors?.[value]

	export let required = false

	export let layoutClasses: 'row equal' | 'flex' = 'row equal'
	export let buttonClasses = "small round"


	// Internal state
	const groupName = `tabs-${x++}`
</script>


<div class="tabs {layoutClasses}">
	{#each values as optionValue (optionValue)}
		<label class="select-option">
			<input type="radio" bind:group={value} value={optionValue} {required} name={groupName} />

			<slot {value} label={getLabel(optionValue) ?? optionValue}>
				<span
					class="button {buttonClasses}"
					style="
						{getColor(optionValue) ? `--accent-color: ${getColor(optionValue)};` : ''}
					"
				>
					{#if optionValue && getIcon(optionValue)}
						<img src={getIcon(optionValue)} />
					{/if}

					{getLabel(optionValue)}
				</span>
			</slot>
		</label>
	{/each}
</div>


<style>
	.tabs {
		font-size: 1.3em;
	}

	label {
		display: grid;
	}

	input[type="radio"] {
		position: absolute;
		pointer-events: none;
		opacity: 0;
	}

	.button {
		border: 1px solid #343434;
	}

	span {
		background-color: var(--background-color-2);
		background-color: var(--background-color-0);
		/* background-color: var(--background-color-white); */
		transition: 0.3s;
		cursor: pointer;
	}
	span:hover {
		opacity: 0.9;
	}
	input[type="radio"]:checked ~ span {
		font-weight: bold;
		opacity: 1;
	}
</style>