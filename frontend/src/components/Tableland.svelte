<script lang="ts">
	// Constants/types
	import type { Connection } from '@tableland/sdk'

	import { _ } from 'svelte-i18n'


	// Stores
	import { account } from '../stores/account'


	// External state
	export let autoConnect = false


	// Internal state
	let connection: Connection


	// Formatting
	import { formatAddress } from '$lib/formatAddress'


	// Methods/hooks/lifecycle

	import { getTablelandConnection, getTables } from '$lib/tableland'

	const connect = async () =>
		connection = await getTablelandConnection({ signer: $account.signer })

	$: if(!$account)
		connection = undefined
	else if(autoConnect)
		connect()


	// Components
	import HeightContainer from './HeightContainer.svelte'


	// Styles/transitions
	import { fly, scale } from 'svelte/transition'
</script>


<article class="card column">
	<header class="row">
		<h2>{$_('Tableland › Saved Vaults')}</h2>

		<div class="stack align-end">
			{#if !$account}
				{$_('Connect wallet')}
			{:else if !connection}
				<button on:click={connect} transition:scale>{$_('Sign in to Tableland')}</button>
			{:else}
				<button transition:scale>{$_('Disconnect')}</button>
			{/if}
		</div>
	</header>

	{#if connection}
		<main transition:scale>
			<HeightContainer class="stack">
				{#await getTables(connection)}
					<div class="card" transition:fly={{ x: 100 }}>
						{$_('Fetching your tables from Tableland...')}
					</div>
				{:then tables}
					<div class="column" transition:scale>
						{#each tables as table, i (table.name)}
							<slot {table}>
								<div class="card row" transition:fly={{ x: 100, delay: i * 200 }}>
									<h3>{table.name}</h3>
									<p>{table.description}</p>
									{new Date(table.created_at).toLocaleString()}
									<output>{formatAddress(table.controller)}</output>
									<output>{formatAddress(table.structure)}</output>
								</div>
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