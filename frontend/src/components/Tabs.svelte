<script lang="ts">
	// Constants/types
	type Value = $$Generic<string>


	// External state
	export let value: Value
	export let values: Value[]
	export let labels: Record<Value, string>
</script>


<div class="row">
	{#each values as optionValue (optionValue)}
		<label class="select-option">
			<input type="radio" bind:group={value} value={optionValue}>
			<span class="button">{labels[optionValue]}</span>
		</label>
	{/each}
</div>


<style>
    label {
		display: grid;
	}

	input[type="radio"] {
		display: none;
	}

	span {
		display: inline-flex;
		justify-content: center;
		background-color: transparent;
		opacity: 0.66;
		transition: 0.3s;
		cursor: pointer;
	}
	span:hover {
		opacity: 0.9;
	}
	input[type="radio"]:checked ~ span {
		background-color: var(--background-color-1);
		font-weight: bold;
		opacity: 1;
		box-shadow: rgba(231, 145, 245, 0.267) 0px 2px 4px;
	}
</style>