<script lang="ts">
	export let value

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

	let timeUnit = Object.entries(timeUnitAmounts).find(([timeUnit, timeUnitAmount]) => value % timeUnitAmount === 0)?.[0] || TimeUnit.Second
	let timeValue = value / timeUnitAmounts[timeUnit]

	$: value = timeValue * timeUnitAmounts[timeUnit]

	
	import Select from '../components/Select.svelte'
</script>


<div class="row">
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
</div>
