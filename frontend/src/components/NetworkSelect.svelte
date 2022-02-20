<script lang="ts">
	import type { Network } from '@ethersproject/providers'
	import { availableNetworks as _availableNetworks, networkIcons, networks, networksBySlug } from '$lib/networks'


	export let availableNetworks: Network[] = _availableNetworks

	export let network: Network = networksBySlug['ethereum-ropsten']
	
	
	import Select from '../components/Select.svelte'



	import { scale } from 'svelte/transition'
</script>


<Select
	bind:value={network}
	values={availableNetworks.map(({ chainId }) => String(chainId))}
	labels={Object.fromEntries(networks.map(({ chainId, name }) => [chainId, name]))}
	icons={networkIcons}
/>