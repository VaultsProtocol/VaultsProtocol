<script lang="ts">
	// Constants/types
	import type { Connection } from '@tableland/sdk'
	import type { ConnectedAccount } from '../stores/account'
	
	import { _ } from 'svelte-i18n'

	import { networksBySlug } from '$lib/networks'


	
	// External state
	export let account: ConnectedAccount
	export let network = networksBySlug['ethereum-rinkeby']

	export let autoConnect = false


	// Internal state
	let connection: Connection


	// Methods/hooks/lifecycle

	import { getTablelandConnection, getTables } from '$lib/tableland'

	const connect = async () =>
		connection = await getTablelandConnection({ signer: account.signer })
	
	const disconnect = () =>
		connection = undefined

	$: account ? connect() : disconnect()


	// Components
	import HeightContainer from './HeightContainer.svelte'


	// Styles/transitions
	import { fly, scale } from 'svelte/transition'
</script>


<article class="card column">
	<header class="row">
		<slot name="title"
			{connection}
			{network} {account}
		/>

		<div class="stack align-end">
			{#if !account}
				{$_('Connect wallet')}
			{:else if !connection}
				<button class="primary" on:click={connect} transition:scale>{$_('Sign in to Tableland')}</button>
			{:else}
				<button class="destructive" on:click={disconnect} transition:scale>{$_('Disconnect')}</button>
			{/if}
		</div>
	</header>

	<HeightContainer isOpen={!!connection} renderOnlyWhenOpen>
		<main class="stack">
			{#await getTables(connection)}
				<div class="card column centered" transition:scale>
					{$_('Fetching your tables from Tableland...')}
				</div>
			{:then tables}
				<div class="column list" transition:scale>
					{#each tables as table, i (table.name)}
						<article class="card row" transition:fly={{ x: 100, delay: i * 200 }}>
							<slot name="table"
								{table}
								{connection}
								{network} {account}
							/>
						</article>
					{/each}
				</div>
			{/await}
		</main>
	</HeightContainer>
</article>
