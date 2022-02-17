<script lang="ts">
	import type { ERC20Token } from '$lib/tokens'


	export let availableTokens: ERC20Token[]

	export let token: ERC20Token
	export let amount: number
	
	
	import TokenSelect from './TokenSelect.svelte'
</script>


<input
	type="number"
	bind:value={amount}
/>


<TokenSelect {availableTokens} bind:token />


<style>
	input[type="number"] {
		width: 4rem;
	}
</style>