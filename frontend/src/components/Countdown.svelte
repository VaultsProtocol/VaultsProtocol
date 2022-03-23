<script lang="ts">
	// Stores
	import { now } from '../stores/now'


	// External state
	export let toTimestamp: number


	// Internal state
	let relativeTime: string


	// Formatting
	import { formatRelativeTime } from '../lib/formatRelativeTime'


	// Methods/hooks/lifecycle
	$: relativeTime = formatRelativeTime(toTimestamp, $now)
</script>


{@html relativeTime.replace(/ [a-z]+/g, m => m[1]).replace(/\d+/g, (m) => `<span>${m}</span>`)}
