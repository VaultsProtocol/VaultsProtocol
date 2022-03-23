<script lang="ts">
	import type { BigNumberish } from 'ethers'

	export let symbol: string
	export let address: string
	export let name: string
	export let icon: string
	export let decimals: number

	export let erc20Token: ERC20Token
	$: symbol = $$props.symbol || erc20Token?.symbol
	$: address = $$props.address || erc20Token?.address
	$: name = $$props.name || erc20Token?.name
	$: icon = $$props.icon || erc20Token?.icon
	$: decimals = $$props.decimals || erc20Token?.decimals

	export let balance: number | string | BigNumberish = 0
	export let price
	export let showDecimalPlaces = 3

	export let isDebt = false

	export let showPlainFiat = false
	$: isFiat = showPlainFiat && ['USD'].includes(symbol)

	$: isZero = balance == 0
	$: isNegative = balance < 0

	$: compactLargeValues = !showPlainFiat


	export let tween = true


	import { tweened } from 'svelte/motion'

	import { utils } from 'ethers'
	const { formatUnits } = utils

	const tweenedValue = tweened(0, {
		duration: tween ? 200 : 0,
		delay: tween ? 1 : 0,
		easing: quintOut,
		interpolate: (from, to) => t => {
			const logFrom = from ? Math.log10(from) : -showDecimalPlaces - 1
			const logTo = to ? Math.log10(to) : -showDecimalPlaces - 1
			return Math.pow(10, logFrom + t * (logTo - logFrom))
		}
	})
	$: tweenedValue.set(Math.abs(formatUnits(balance, erc20Token?.decimals || 18) || 0))


	import { formatValue } from '../lib/formatValue'
	import { formatAddress } from '../lib/formatAddress'


	import type { ERC20Token } from '$lib/tokens'
	import Icon from './Icon.svelte'
	import { expoOut, quintOut } from 'svelte/easing'
</script>


<style>
	.token-balance-container {
		display: inline-grid;
		grid-auto-flow: column;
		justify-content: start;
		align-items: baseline;
		--padding-inner: 0.33em;
		gap: var(--padding-inner);
	}

	.token-balance-container > * {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.token-name {
		font-weight: 300;
		font-size: 0.8em;
		font-weight: 500;
		opacity: 0.75;
		/* font-weight: 900;
		opacity: 0.5; */
	}
	.token-balance {
		font-weight: 500;
	}

	.is-debt {
		color: hsl(31deg 93% 54%);
	}

	/* .is-zero {
		opacity: 0.55;
	} */
</style>


<span class="token-balance-container" class:is-debt={isDebt} class:is-zero={isZero} title="{balance} {name || symbol}{symbol && name ? ` (${symbol})` : ``}" draggable={true}>
	{#if isFiat}
		<span class="token-balance">{isNegative ? '−' : ''}
			{formatValue({
				value: $tweenedValue,
				symbol,
				showDecimalPlaces,
				compactLargeValues
			})}
		</span>
	{:else}
		<!-- <Icon {symbol} {address} {name} {icon} {erc20Token} /> -->
		<span>
			<span class="token-balance">
				{isNegative ? '−' : ''}{formatValue({
					value: $tweenedValue,
					showDecimalPlaces,
					compactLargeValues
				})}
			</span>
			<span class="token-name">{symbol || formatAddress(address)}</span>
		</span>
		<Icon {symbol} {address} {name} {icon} {erc20Token} />
	{/if}
</span>
