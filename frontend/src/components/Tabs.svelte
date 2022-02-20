<script lang="ts">
	// Constants/types
	type Value = $$Generic<string>


	// External state
	export let value: Value
	export let values: Value[]
	export let labels: Record<Value, string>
	export let colors: Record<Value, string> = {}
</script>


<div class="row equal">
	{#each values as optionValue (optionValue)}
		<label class="select-option">
			<input type="radio" bind:group={value} value={optionValue} />
			<span class="button" style={colors[optionValue] ? `background-color: ${colors[optionValue]}` : ''}>{labels[optionValue]}</span>
		</label>
	{/each}
</div>


<style>
	div {
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

	span {
		background-color: var(--background-color-2);
		background-color: var(--background-color-white);
		transition: 0.3s;
		cursor: pointer;
	}
	span:hover {
		opacity: 0.9;
	}
	input[type="radio"]:checked ~ span {
		background-color: var(--background-color-4);
		font-weight: bold;
		opacity: 1;
	}
</style>