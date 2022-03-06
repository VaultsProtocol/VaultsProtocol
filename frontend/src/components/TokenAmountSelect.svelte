<script lang="ts">
	import type { ERC20Token } from '$lib/tokens'
	import { BigNumber, utils } from 'ethers'
	const { formatUnits, parseUnits } = utils
	import { _ } from 'svelte-i18n'


	export let availableTokens: ERC20Token[]

	export let token: ERC20Token
	export let amount: BigNumber

	export let min: BigNumber = BigNumber.from(0)
	export let max: BigNumber

	export let stepDecimals = 3


	const onInput = (value: number) => {
		try {
			if(value != undefined && value !== '')
				amount = parseUnits(String(value), token?.decimals || 18)
		}catch(e){
			console.error(e)
		}
	}

	const onBlur = () => {
		if(max !== undefined && amount.gt(max))
			amount = max
		else if(min !== undefined && amount.lt(min))
			amount = min
	}

	const setMax = () => {
		if(max !== undefined)
			amount = max
	}

	
	import TokenSelect from './TokenSelect.svelte'
</script>


<div class="row">
	<div class="stack">
		<input
			type="number"
			step={10 ** -stepDecimals}
			value={formatUnits(amount, token?.decimals || 18)}
			on:input={e => onInput(e.target.value)}
			on:blur={onBlur}
			{min}
			{max}
		/>

		{#if max !== undefined}
			<button type="button" class="max small" on:click={setMax}>{$_('max')}</button>
		{/if}
	</div>

	<TokenSelect {availableTokens} bind:token />
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