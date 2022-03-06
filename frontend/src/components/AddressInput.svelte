<script lang="ts">
	// External state
	export let address: string


	// Internal state
	let _address: string = address
	let isValid: boolean
	let isResolvingEns = false


	// Methods/hooks/lifecycle
	// $: _address = $$props.address
	$: isValid = !_address || isAddress(_address)

	const onChange = () => {
		// if(isValid)
		// 	address = _address
	}
	$: if(isValid)
		address = _address


	// Components
	import { isAddress } from '@ethersproject/address'
</script>


<input
	type="text"
	bind:value={_address}
	class:invalid={!isValid}
	placeholder="0xabc...6789 / ens.eth"
	on:input={onChange}
	on:blur={() => _address = _address.trim()}
/>


<style>
	:not(:placeholder-shown).invalid {
		border: red solid 2px;
	}
</style>
