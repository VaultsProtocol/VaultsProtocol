<script lang="ts">
	// Constants/types
	import type { Network } from '$lib/networks'


	// External state
	export let network: Network
	export let address = ''
	export let linked = true


	// Internal state
	let explorer: Network['explorers'][number]
	$: explorer = network.explorers?.[0]


	// Formatting
	import { formatAddress } from '$lib/formatAddress'


	// Internal state
	$: formattedAddress = formatAddress(address)
</script>


<style>
	.address {
		font-family: var(--font-monospace);
		font-size: 0.95em;
		white-space: nowrap;
	}
</style>


{#if linked && explorer}
	<a class="address" href="{explorer.url}/address/{address}" target="_blank">
		<abbr title={address}>{formattedAddress}</abbr>
	</a>
{:else}
	<abbr class="address" title={address}>{formattedAddress}</abbr>
{/if}
