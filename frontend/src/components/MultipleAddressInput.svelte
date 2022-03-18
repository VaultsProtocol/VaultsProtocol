<script context="module">
	let key = 0
</script>


<script lang="ts">
	// Constants/types
	type Value = string // $$Generic<string | any>

	import { _ } from 'svelte-i18n'


	// External state
	export let values: Value[] = []

	export let minimumLength = 1
	export let defaultLength = 2


	// Internal state
	let keys = values.map(_ => key++)


	// Stores
	import { account } from '../stores/account'


	// Methods/hooks/lifecycle
	var getDefaultValue = () =>
		$account?.address && values && !values?.includes($account.address)
			? $account.address
			: ''

	const add = (value = getDefaultValue()) => {
		values = [...values, value]
		keys = [...keys, key++]
	}

	const remove = (i) => {
		values.splice(i, 1); values = values
		keys.splice(i, 1); keys = keys
	}

	while(values.length < defaultLength)
		add()
	
	$: while(values.length < minimumLength)
		add()


	// Components
	import AddressInput from './AddressInput.svelte'
	import Container from './Container.svelte'


	// Styles/animations
	import { scale } from 'svelte/transition'
	import { flip } from 'svelte/animate'
	import { backOut } from 'svelte/easing'
</script>


<div class="column">
	<Container class="column">
		{#each values as value, i (keys[i])}
			<div class="row" transition:scale|local animate:flip={{ duration: 300, easing: backOut }}>
				<AddressInput bind:address={value} />
				<button type="button" class="round" on:click={() => remove(i)}>–</button>
			</div>
		{/each}
	</Container>

	<!-- {#if values[values.length - 1]} -->
		<button type="button" class="round" on:click={() => add()} transition:scale|local={{ duration: 200 }}>{$_('+ Add Address')}</button>
	<!-- {/if} -->
</div>


<style>
	.row {
		grid-template-columns: 1fr auto;
		--grid-gap: 1em;
	}

	.column {
		--grid-gap: 0.75em;
	}
</style>