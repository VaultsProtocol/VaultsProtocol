<script lang="ts">
	// Constants/types
	import type { Connection, TableMetadata } from '@tableland/sdk'
	
	import { _ } from 'svelte-i18n'

	import { networksBySlug } from '$lib/networks'

	const network = networksBySlug['ethereum-rinkeby']


	// Stores
	import { account } from '../stores/account'


	// External state
	export let autoConnect = false

	export let selectedTable: TableMetadata


	// Internal state
	let connection: Connection


	// Methods/hooks/lifecycle

	import { getTablelandConnection, getTables } from '$lib/tableland'

	const connect = async () =>
		connection = await getTablelandConnection({ signer: $account.signer })
	
	const disconnect = () =>
		connection = undefined

	$: $account ? connect() : disconnect()


	// Components
	import Address from './Address.svelte'
	import Date from './Date.svelte'
	import HeightContainer from './HeightContainer.svelte'

	// Styles/transitions
	import { fly, scale } from 'svelte/transition'
</script>


<article class="card column">
	<header class="row">
		<h2>
			{$_('Tableland')}
			 › 
			 {#if $account}
				<Address {network} address={$account.address} />
				› 
			{/if}
			{$_('Saved Vaults')}
		</h2>

		<div class="stack align-end">
			{#if !$account}
				{$_('Connect wallet')}
			{:else if !connection}
				<button class="primary" on:click={connect} transition:scale>{$_('Sign in to Tableland')}</button>
			{:else}
				<button class="destructive" on:click={disconnect} transition:scale>{$_('Disconnect')}</button>
			{/if}
		</div>
	</header>

	{#if connection}
		<main transition:scale>
			<HeightContainer>
				{#await getTables(connection)}
					<div class="card" transition:fly={{ x: 100 }}>
						{$_('Fetching your tables from Tableland...')}
					</div>
				{:then tables}
					<div class="column" transition:scale>
						{#each tables as table, i (table.name)}
							<slot {table}>
								<label class="card row" transition:fly={{ x: 100, delay: i * 200 }}>
									<h3>{table.name}</h3>
									<p>{table.description}</p>
									<Address {network} address={table.controller} />
									<output>{(table.structure)}</output>
									<Date date={table.created_at} />
								</label>
							</slot>
						{/each}
					</div>
				{/await}
			</HeightContainer>
		</main>
	{/if}
</article>


<style>

</style>