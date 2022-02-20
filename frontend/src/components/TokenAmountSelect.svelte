<script lang="ts">
	import type { ERC20Token } from '$lib/tokens'
	import { BigNumber } from 'ethers'
	import { formatUnits, parseUnits } from 'ethers/lib/utils'
	import { _ } from 'svelte-i18n'


	export let availableTokens: ERC20Token[]

	export let token: ERC20Token
	export let amount: BigNumber

	export let min: BigNumber = BigNumber.from(0)
	export let max: BigNumber

	export let stepDecimals = 3


	const onInput = (value: number) => {
		if(value != undefined && value !== '')
			amount = parseUnits(String(value), token?.decimals || 18)
	}

	const onBlur = () => {
		if(amount.gt(max))
			amount = max
		else if(amount.lt(min))
			amount = min
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

		<button class="max small" on:click={() => amount = max}>{$_('max')}</button>
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
	}
</style>