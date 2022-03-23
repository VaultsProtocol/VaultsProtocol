<script lang="ts">
	// Types
	import type { ERC20Token } from '$lib/tokens'
	import { _ } from 'svelte-i18n'


	// Formatting
	import { BigNumber, utils } from 'ethers'

	const { formatUnits, parseUnits } = utils

	const truncate = (n: string, decimals = token?.decimals || 18) =>
		n.match(/^\d*(\.\d{0,18})?/)[0]
		// Intl.NumberFormat('en', {
		// 	notation: 'standard',
		// 	maximumFractionDigits: decimals,
		// 	useGrouping: false,
		// 	roundingMode: 'trunc'
		// }).format(n)

	const format = (n: BigNumber, decimals = token?.decimals || 18) =>
		truncate(formatUnits(n, decimals))

	const parse = (n: string | number, decimals = token?.decimals || 18) =>
		parseUnits(truncate(String(n)), decimals)
		// parseUnits(
		// 	Intl.NumberFormat('en', {
		// 		notation: 'compact',
		// 		maximumFractionDigits: decimals
		// 	}).format(n),
		// 	decimals
		// )


	// External state
	export let availableTokens: ERC20Token[]

	export let token: ERC20Token
	export let amount: BigNumber

	export let min: BigNumber
	export let max: BigNumber
	export let stepDecimals = token?.decimals // 3

	export let autoFallback = false
	export let required = false


	// Internal state
	let inputValue: string


	// Methods/hooks/lifecycle
	const onInput = (inputValue: string) => {console.log('onInput', inputValue)
		try {
			if(inputValue != undefined && inputValue !== '')
				amount = parse(inputValue)
		}catch(e){
			console.error(e)
		}
	}

	const onBlur = () => {
		if(max && amount.gt(max))
			amount = max
		else if(min && amount.lt(min))
			amount = min
		
		inputValue = amount ? format(amount) : ''
	}

	const setMax = () => {
		if(max)
			amount = max
	}


	// Components
	import TokenSelect from './TokenSelect.svelte'
</script>


<div class="row">
	<div class="stack">
		<input
			type="number"
			bind:value={inputValue}
			step={10 ** -stepDecimals}
			min="{format(min ?? BigNumber.from(1))}"
			max="{max && format(max)}"
			{required}
			on:blur={onBlur}
			on:input={e => onInput(e.target.value)}
			placeholder="0"
		/>

		{#if max !== undefined}
			<button type="button" class="max small" on:click={setMax}>{$_('max')}</button>
		{/if}
	</div>

	<TokenSelect {availableTokens} {autoFallback} {required} bind:token />
</div>


<style>
	.row {
		grid-template-columns: 1fr auto;
		--grid-gap: 1em;
	}

	.max {
		justify-self: end;
		align-self: center;
		margin-right: .5rem;
	}
</style>