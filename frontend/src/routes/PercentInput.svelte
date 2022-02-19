<script lang="ts">
	export let value: number
	export let min = 0
	export let max = 100
</script>


<span class="row">
	<input
		type="number"
		{min}
		{max}
		bind:value
		on:blur={() => value = Math.max(Math.min(value, max), min)}
	/>
	%
</span>


<style>
	.row {
		grid-template-columns: 1fr auto;
	}
</style>