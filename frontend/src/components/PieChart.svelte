
<script lang="ts">
	export const data: {
		amount,
		label: string,
		color?: string
	}[] = []

	export let colors: string[] = []

	$: console.log('data', data)
	

	let cumulativeAmounts = []
	let sum: number
	// $: sum = data.reduce((sum, {amount}) => sum + amount, 0)
	$: {
		sum = 0
		cumulativeAmounts = [0, ...data.map(({ amount }) => sum += amount)]
	}
</script>


<svg viewBox="0 0 64 64" class="pie">
	{#each data as { amount, label, color }, i (label)}
		<circle
			r="25%"
			cx="50%"
			cy="50%"
			style="
				stroke-dasharray: {amount / sum} 1;
				stroke: {colors[i] || color};
				stroke-dashoffset: {-cumulativeAmounts[i] / sum};
				animation-delay: {i * 0.25}s
			"
		/>
	{/each}
</svg>


<style>
	.pie {
		width: 100%;
		aspect-ratio: 1;
	}
</style>