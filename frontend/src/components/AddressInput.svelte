<script lang="ts">
	// External state
	export let address: string

	export let required = false


	// Internal state
	let _address: string = address

	let inputElement
	let isValid: boolean

	let isResolvingEns = false


	// Methods/hooks/lifecycle
	// $: _address = $$props.address
	// $: isValid = !_address || isAddress(_address)
	$: isValid = (_address, inputElement?.valid)

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
	{required}
	bind:this={inputElement}
	bind:value={_address}
	class:invalid={!isValid}
	placeholder="0xabc...6789 / ens.eth"
	pattern={`0x[0-9a-f]{40}|.+[.](eth|[a-z]{2,})`}
	on:input={onChange}
	on:blur={() => _address = _address.trim()}
/>


<style>
	/* :not(:placeholder-shown).invalid {
		border: red solid 2px;
	} */
</style>
