<script lang="ts">
	export let value: number
	export let min = 0
	export let max = 100
	export let maxDecimals = 2
	export let required = false
</script>


<span class="row">
	<input
		type="number"
		{required}
		bind:value
		{min}
		{max}
		step={10 ** -maxDecimals}
		on:blur={() => value = Number(Math.max(Math.min(value, max), min).toFixed(maxDecimals))}
	/>
	<!-- on:blur={() => value = Math.floor(Math.max(Math.min(value, max), min) / step) * step} -->
	%
</span>
<!-- <button
	type="button"
	class="small"
	>
	{$_('Remaining')}
</button> -->


<style>
	.row {
		grid-template-columns: 1fr auto;
	}
</style>



<!-- <script context="module">
	let _id = 0

	const lastEditedAt = []
	const changeValue = {}
</script>


<script lang="ts">
	export let value: number
	export let min = 0
	export let max = 100


	const id = _id++
	changeValue[id] = (newValue) => value = newValue
</script>


<span class="row">
	<input
		type="number"
		{min}
		{max}
		bind:value
		on:change={() => {
			lastEditedAt.push(lastEditedAt.splice(id, 1))
			changeValue[lastEditedAt[0]]()
		}}
		on:blur={() => value = Math.max(Math.min(value, max), min)}
	/>
	%
</span> -->