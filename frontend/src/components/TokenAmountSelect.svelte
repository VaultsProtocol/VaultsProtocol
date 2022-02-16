<script lang="ts">
	import { erc20Tokens, erc20TokensBySymbol, type ERC20Token } from '$lib/tokens'
	
	
	export let token: ERC20Token = erc20TokensBySymbol['DAI']
	export let amount: number
	
	
	import Select from '../components/Select.svelte'


	import { scale } from 'svelte/transition'
</script>


<input
	type="number"
	bind:value={amount}
/>


<Select
	bind:value={token}
	values={erc20Tokens}

	let:value
>
	<!-- <div class="stack">
		{#key value}
			<div class="row" transition:scale> -->
				<img src={value.icon} alt={value.symbol} />
				{value.symbol}
			<!-- </div>
		{/key}
	</div> -->
</Select>


<style>
	input[type="number"] {
		width: 4rem;
	}

	/* .row {
		--grid-gap: 0.66em;
	} */
	img {
		width: 1em;
		height: 1em;
	}
</style>