<script context="module" lang="ts">
	const cachedImageSources = {}
	const cachedIndex = {}
</script>


<script lang="ts">
    import type { ChainID } from '$lib/networks'
	import { erc20TokensByContractAddress, erc20TokensBySymbol, type ERC20Token } from '../lib/tokens'


	export let chainId: ChainID
	export let symbol: string
	export let address: string
	export let name: string
	export let icon: string

	export let erc20Token: ERC20Token
	$: chainId = $$props.chainId || erc20Token?.chainId
	$: symbol = $$props.symbol || erc20Token?.symbol
	$: address = $$props.address || erc20Token?.address
	$: name = $$props.name || erc20Token?.name
	$: icon = $$props.icon || erc20Token?.icon


	let i = cachedIndex[(chainId + address) || symbol] ||= 0
	$: cachedIndex[(chainId + address) || symbol] = i
	$: imageSources = cachedImageSources[(chainId + address) || symbol] ||= [
		// symbol === 'AAVE' && 'assets/logos/aave.svg',
		// symbol === 'AURORA' && 'assets/logos/aurora.svg',
		// symbol === 'AVAX' && 'assets/logos/avalanche.svg',
		// symbol === 'CELO' && 'assets/logos/celo.svg',
		// symbol === 'DAI' && 'assets/logos/dai.svg',
		// symbol === 'ONE' && 'assets/logos/harmony.svg',
		// symbol === 'METIS' && 'assets/logos/metis.svg',
		// symbol === 'NAHMII' && 'assets/logos/nahmii.svg',
		// symbol === 'NERVOS' && 'assets/logos/nervos.svg',
		// symbol === 'MATIC' && 'assets/logos/polygon.svg',
		// symbol === 'SKALE' && 'assets/logos/skale.svg',
		// symbol === 'USDC' && 'assets/logos/usdc.svg',
		// symbol === 'YFI' && 'assets/logos/yearn.svg',

		// symbol && `https://zapper.fi/images/${symbol}-icon.png`,
		// address && `https://tokens.1inch.exchange/${address.toLowerCase()}.png`,
		// address && `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
		// address && erc20TokensByContractAddress[address.toLowerCase()]?.icon,
		// symbol && erc20TokensBySymbol[symbol]?.icon,
	].filter(Boolean)

	// let loadingError
</script>


<picture class="token-icon" title={symbol + (address ? ` (${address})` : '')} on:click={e=>console.log(address || symbol)}>
	{#if imageSources[i]}
		<img src={imageSources[i]} on:error={e => i++} />
	{:else}
		<span class="placeholder-icon" data-icon={symbol ?? '?'} />
	{/if}
</picture>


<style>
	.token-icon {
		--token-size: 1.25em;

		display: inline-flex;
		width: var(--token-size);
		height: 1em;
		align-self: center;
		align-items: center;
	}
	.token-icon + :global(.token-icon) {
		margin-left: calc(-0.25em - var(--padding-inner));
	}

	img, .placeholder-icon, .token-icon > :global(svg) {
		width: var(--token-size);
		height: var(--token-size);
		max-width: 100%;
		aspect-ratio: 1;
		border-radius: 0.3em;
		object-fit: contain;
	}

	.placeholder-icon {
		background: radial-gradient(transparent -175%, var(--accent-color) 125%);

		color: #fff;
		background-color: var(--background-color-2);

		display: inline-flex;
		/* place-items: center; */
		place-content: center;
		text-align: center;
		border-radius: 50%;
		overflow: hidden;

		line-height: var(--token-size);
		padding: 0 0.1em;
	}
	.placeholder-icon:before {
		content: attr(data-icon);

		font-size: 0.5em;
		font-weight: bold;

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>