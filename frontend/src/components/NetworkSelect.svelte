<script lang="ts">
	// Constants/types
	import { type Network, availableNetworks as _availableNetworks, networkIcons, networks, networksBySlug, networksByChainID } from '$lib/networks'
	import { rpcProviders, rpcProvidersForNetwork } from '$lib/providers'


	// Stores
	import { account } from '../stores/account'
	import { rpcProvider } from '../stores/rpcProvider'


	// External state
	export let availableNetworks: Network[] = _availableNetworks

	export let network: Network // networksBySlug['ethereum-rinkeby']

	export let rpcProviderConfig


	// Formatting
	import { utils } from 'ethers'
	const { hexValue } = utils

	import { random } from '$lib/random'


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

	$: if(network && $account && $account.chainId === network.chainId)(async () => {
		await $account.signer.connect(rpcProviderConfig)
	})

	$: if(network)
		if(rpcProviderConfig)
			$rpcProvider = rpcProviderConfig.get({ network })
		else
			rpcProviderConfig = rpcProviders.find(rpcProvider => rpcProvider.type === random(rpcProvidersForNetwork[network.slug]))


	// Components
	import Select from '../components/Select.svelte'
</script>


<Select
	bind:value={rpcProviderConfig}
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
