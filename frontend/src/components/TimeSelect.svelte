<script lang="ts">
	enum TimeUnit {
		Second = 'seconds',
		Minute = 'minutes',
		Hour = 'hours',
		Day = 'days',
	}

	const timeUnitAmounts = {
		[TimeUnit.Day]: 86400,
		[TimeUnit.Hour]: 3600,
		[TimeUnit.Minute]: 60,
		[TimeUnit.Second]: 1,
	}


	export let value: number

	export let required = false


	let timeUnit = Object.entries(timeUnitAmounts).find(([timeUnit, timeUnitAmount]) => value % timeUnitAmount === 0)?.[0] || TimeUnit.Second
	let timeValue = value / timeUnitAmounts[timeUnit]

	$: value = timeValue * timeUnitAmounts[timeUnit]

	
	import Select from '../components/Select.svelte'
</script>


<div class="row">
	<input
		type="number"
		{required}
		min="1"
		bind:value={timeValue}
	/>

	<Select
		bind:value={timeUnit}
		values={Object.keys(TimeUnit)}
		labels={TimeUnit}
	/>
</div>
