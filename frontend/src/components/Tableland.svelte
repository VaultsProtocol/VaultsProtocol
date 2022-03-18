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


	// Styles/transitions
	import { scale } from 'svelte/transition'
</script>


<div class="card column">
	<div class="row">
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
	</div>

	{#if connection}
		<div class="stack" transition:scale>
			{#await getTables(connection)}
				<div transition:scale>
					{$_('Fetching your tables from Tableland...')}
				</div>
			{:then tables}
				<div class="column" transition:scale>
					{#each tables as table, i (table.name)}
						<slot {table}>
							<div class="row" transition:scale={{ delay: i * 100 }}>
								<h3>{table.name}</h3>
								<p>{table.description}</p>
								{new Date(table.created_at).toLocaleString()}
								<p>{formatAddress(table.controller)}</p>
								<output>{formatAddress(table.structure)}</output>
							</div>
						</slot>
					{/each}
				</div>
			{/await}
		</div>
	{/if}
</div>


<style>

</style>