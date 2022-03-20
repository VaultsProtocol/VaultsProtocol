<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'
	import type { ConnectedAccount } from '../stores/account'
	import type { Connection, CreateTableOptions } from '@tableland/sdk'
	import { createTable, queryTable } from '$lib/tableland'


	// External state
	export let account: ConnectedAccount


	// Internal state
	let showCreateTableFlow = false

	const newTableOptions = {
		description: 'Vaults created with Vaults Protocol.'
	}

	// import type { TableMetadata } from '@tableland/sdk'

	// export let selectedTable: TableMetadata


	// Methods/hooks/lifecycle

	const VAULTS_PROTOCOL_QUERIES = {
		CREATE: `CREATE TABLE vaults (
	id					varchar(255) primary key,
	chain_id 			int,
	vault_config 		json,
	contract_address 	text,
	transaction_hash 	text
);`
	}

	const actions = {
		createTable: async ({
			connection,
			options
		}: {
			connection: Connection,
			options: CreateTableOptions
		}) => {
			const receipt = await createTable(
				connection,
				VAULTS_PROTOCOL_QUERIES.CREATE,
				options
			)
			const tableName = receipt.name
			console.log('receipt', receipt)
			return receipt
		},

		getAll: async ({
			connection,
			tableName
		}: {
			connection: Connection,
			tableName: string
		}) =>
			(await queryTable(
				connection,
				`
					SELECT * FROM ${tableName};		
				`
			)).data,

		add: async ({
			connection,
			tableName,
			vaultConfig,
			contractAddress,
			transactionHash,
		}) => await queryTable(
			connection,
			`
				INSERT INTO ${tableName} (
					id,
					chain_id,
					vault_config,
					contract_address,
					transaction_hash
				) VALUES (
					${JSON.stringify(`${vaultConfig.chainId}-${contractAddress}`)},
					${Number(vaultConfig.chainId)},
					'${JSON.stringify(vaultConfig)}',
					${JSON.stringify(String(contractAddress))},
					${JSON.stringify(String(transactionHash))}
				);
			`
		)
	}


	// Components
	import Address from './Address.svelte'
	import Container from './Container.svelte'
	import Date from './Date.svelte'
	import Tableland from './Tableland.svelte'
	import TransactionFlow, { Steps } from './TransactionFlow.svelte'


	// Styles/transitions
	import { scale } from 'svelte/transition'
</script>


<Tableland
	{account}
	let:connection
	let:network let:account
	let:reload
>
	<svelte:fragment slot="title">
		<h2>
			{$_('Tableland')}
			{#if connection}
				› 
				<Address {network} address={account.address} />
				› 
				{$_('Tables')}
			{/if}
			<!-- {$_('Saved Vaults')} -->
		</h2>
	</svelte:fragment>

	<svelte:fragment slot="actions">
		<div class="stack align-end">
			{#if !showCreateTableFlow}
				<button class="large primary" on:click={() => showCreateTableFlow = true} transition:scale>{$_('+ Create Table')}</button>
			<!-- {:else}
				<button class="large" on:click={() => showCreateTableFlow = false} transition:scale>{$_('Cancel')}</button> -->
			{/if}
		</div>
	</svelte:fragment>

	<Container class="column" isOpen={showCreateTableFlow} renderOnlyWhenOpen>
		<hr transition:scale />

		<div class="card column" transition:scale>
			<TransactionFlow
				{account}

				createTransaction={async () =>
					actions.createTable({ connection, options: newTableOptions })
				}
		
				onTransactionSuccess={() => reload()}
			>
				<svelte:fragment slot="header" let:currentStep>
					<header class="row">
						<h3>{$_('Create Vaults Protocol table')}</h3>

						<div class="stack align-end">
							{#if currentStep === Steps.Idle || currentStep === Steps.Confirming}
								<button on:click={() => showCreateTableFlow = false} transition:scale>{$_('Cancel')}</button>
							{/if}
						</div>
					</header>

					<hr>
				</svelte:fragment>

				<svelte:fragment slot="idle">

					<label class="column">
						<h4>{$_('Description')}</h4>
						<textarea bind:value={newTableOptions.description} />
					</label>

					<div class="row centered">
						<button class="primary large round" type="submit">{$_('Create Table')}</button>
					</div>
				</svelte:fragment>

				<svelte:fragment slot="confirming-message">
					<h2>{$_('Creating a new Tableland table with the following SQL schema:')}</h2>

					<pre class="card">{VAULTS_PROTOCOL_QUERIES.CREATE}</pre>
				</svelte:fragment>

				<svelte:fragment slot="success-message" let:tx={receipt}>
					<p>{$_('Created a new Tableland table "{tableName}".', { values: { tableName: receipt.name }})}</p>

					<button class="large round" on:click={() => showCreateTableFlow = false}>{$_('Done')}</button>
				</svelte:fragment>
			</TransactionFlow>
		</div>
	</Container>

	<article class="card column" slot="table" let:table>
		<header class="row">
			<h3>{table.name}</h3>
			<span>{$_('Tableland Table')}</span>
		</header>

		{#if table.description}<p>{table.description}</p>{/if}

		<div class="column">
			{#await actions.getAll({ connection, tableName: table.name })}
				<div transition:scale>
					{$_('Loading content...')}
				</div>
			{:then { columns, rows }}
				<!-- <table class="card clip" transition:scale> -->
				<table transition:scale>
					<thead>
						{#each columns as column}
							<th>
								{column.name.replace(/(?:_|^)([A-Z])/g, (m, $1) => $1.toUppercase())}
							</th>
						{/each}
					</thead>
					{#if rows.length}
						<tbody>
							{#each rows as row}
								<tr>
									{#each row as value}
										<td>
											{value}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					{:else}
						<caption>{$_('No data found.')}</caption>
					{/if}
				</table>
			{/await}
		</div>

		<footer class="row align-end">
			<span>managed by <Address {network} address={table.controller} /></span>
			<!-- <output>{(table.structure)}</output> -->
			<span>created <Date date={table.created_at} /></span>
		</footer>
	</article>
</Tableland>
