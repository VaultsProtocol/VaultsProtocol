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
	import Container from './Container.svelte'


	// Images
	import tablelandIcon from '../assets/dapps/tableland.png'


	// Styles/transitions
	import { fly, scale, fade } from 'svelte/transition'
</script>


<article class="card column clip">
	<header class="row">
		<span class="row-inline">
			<img src={tablelandIcon} width="30" />

			<slot name="title"
				{connection}
				{network} {account}
			/>
		</span>

		<div class="stack align-end">
			{#if !account}
				{$_('Connect wallet')}
			{:else if !connection}
				<button class="primary large" on:click={connect} transition:scale>{$_('Sign in')}</button>
			{:else}
				<button class="destructive large" on:click={disconnect} transition:scale>{$_('Disconnect')}</button>
			{/if}
		</div>
	</header>

	<Container isOpen={!!connection} renderOnlyWhenOpen>
		<main class="stack">
			{#await getTables(connection)}
				<div class="card column centered" transition:scale>
					<span class="row-inline">
						<img src={tablelandIcon} width="30" />
						{$_('Fetching your tables from Tableland...')}
					</span>
				</div>
			{:then tables}
				<div class="column list">
					<hr transition:scale />
					{#each tables as table, i (table.name)}
						<div in:fly={{ x: 100, delay: i * 200 }} out:fly={{ x: -100, delay: (tables.length - i - 1) * 20 }}>
							<slot name="table"
								{table}
								{connection}
								{network} {account}
							/>
						</div>
					{/each}
				</div>
			{/await}
		</main>
	</Container>
</article>
