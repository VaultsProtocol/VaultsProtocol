<script lang="ts">
	export let value

	enum TimeUnit {
		Second = 'seconds',
		Minute = 'minutes',
		Hour = 'hours',
		Day = 'days',
	}

	const timeUnitAmounts = {
		[TimeUnit.Second]: 1,
		[TimeUnit.Minute]: 60,
		[TimeUnit.Hour]: 3600,
		[TimeUnit.Day]: 86400,
	}

	let timeUnit = Object.entries(timeUnitAmounts).find(([timeUnit, timeUnitAmount]) => value % timeUnitAmount === 0)[0] || TimeUnit.Second
	let timeValue = value / timeUnitAmounts[timeUnit]

	$: value = timeValue * timeUnitAmounts[timeUnit]

	
	import Select from '../components/Select.svelte'
</script>


<input
	type="number"
	min="1"
	bind:value={timeValue}
/>


<Select
	bind:value={timeUnit}
	values={Object.keys(TimeUnit)}
	labels={TimeUnit}
/>


<style>
	input[type="number"] {
		width: 4rem;
	}
</style>