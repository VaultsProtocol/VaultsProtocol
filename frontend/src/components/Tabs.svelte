<script context="module">
	let id = 0
</script>


<script lang="ts">
	// Constants/types
	type Value = $$Generic<string>


	// External state
	export let value: Value
	export let values: Value[]
	export let labels: Record<Value, string>
	export let colors: Record<Value, string> = {}
	export let required = false


	// Internal state
	const groupName = String(id++)
</script>


<div class="row tabs-row equal">
	{#each values as optionValue (optionValue)}
		<label class="select-option">
			<input type="radio" bind:group={value} value={optionValue} {required} name={groupName} />
			<span class="button" style={colors[optionValue] ? `--active-background-color: ${colors[optionValue]}` : ''}>{labels[optionValue]}</span>
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

	.tabs-row .button{
		border: 2px solid #343434;
		padding: 5px 10px;
		min-height: 40px;
		height: 100%;
		border-radius: 120px;
		text-align: center;
		font-size: 0.75em;
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
		background-color: var(--active-background-color, var(--background-color-DAO));
		font-weight: bold;
		opacity: 1;
	}
</style>