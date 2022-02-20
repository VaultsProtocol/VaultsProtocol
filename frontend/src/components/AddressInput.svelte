<script lang="ts">
	// External state
	export let address: string


	// Internal state
	let isValid: boolean
	$: isValid = isAddress(address)

	let isResolvingEns = false


	// Methods/hooks/lifecycle
	isResolvingEns


	// Components
	import { isAddress } from '@ethersproject/address'
</script>


<input
	type="text"
	bind:value={address}
	class:invalid={address && !isValid}
	placeholder="0xabc...6789 / ens.eth"
	on:blur={() => address = address.trim()}
/>


<style>
	.invalid {
		border: red solid 2px;
	}
</style>
