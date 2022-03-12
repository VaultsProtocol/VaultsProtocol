<script lang="ts">
	// Constants/types
	import { type Network, availableNetworks as _availableNetworks, networkIcons, networks, networksBySlug, rpcProviders, networksByChainID } from '$lib/networks'
	import { account } from '../stores/account'


	// External state
	export let availableNetworks: Network[] = _availableNetworks

	export let rpcProvider
	export let network: Network // networksBySlug['ethereum-rinkeby']


	// Formatting
	import { utils } from 'ethers'
	const { hexValue } = utils


	// Methods/hooks/lifecycle
	$: network = networksByChainID[$account?.chainId]
	// network = networksByChainID[$account?.chainId]

	$: if(network && $account && $account.chainId !== network.chainId)(async () => {
		const provider = $account.walletConnection.provider

		console.log({network, provider, account: $account})

		try {
			await provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{
					chainId: hexValue(network.chainId)
				}],
			})
		} catch (e) {
			// This error code indicates that the chain has not been added to MetaMask.
			if (e.code === 4902) {
				try {
					await provider.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: hexValue(network.chainId),
								chainName: network.name,
								rpcUrls: network.rpc,
								nativeCurrency: network.nativeCurrency,
								blockExplorerUrls: network.explorers.map(explorer => explorer.url)
							},
						],
					})
				} catch (e) {
					console.error(e)
				}
			}else{
				console.error(e)
			}
		}
	})()
	

	// Components
	import Select from '../components/Select.svelte'


	// Styles/animation
	import { scale } from 'svelte/transition'
</script>


<Select
	bind:value={rpcProvider}
	values={rpcProviders}
	getLabel={rpcProvider => rpcProvider.name}
	getIcon={rpcProvider => rpcProvider.icon}
	placeholderLabel="Choose RPC Network..."
/>

<Select
	bind:value={network}
	values={availableNetworks}
	getLabel={network => network.name}
	getIcon={network => networkIcons[network.chainId]}
	placeholderLabel="Choose EVM Network..."
/>
