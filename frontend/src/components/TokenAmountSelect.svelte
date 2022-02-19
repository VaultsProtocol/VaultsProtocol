<script lang="ts">
	import type { ERC20Token } from '$lib/tokens'


	export let availableTokens: ERC20Token[]

	export let token: ERC20Token
	export let amount: number
	
	
	import TokenSelect from './TokenSelect.svelte'
</script>


<div class="row equal">
	<input
		type="number"
		bind:value={amount}
		min={0}
	/>

	<TokenSelect {availableTokens} bind:token />
</div>


<style>
	
</style>