<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'

	import { getDefaultVaultConfig, VaultType } from '../../lib/vaults'


	// Stores
	import { account } from '../../stores/account'


	// Formatting
	import { BigNumber, utils } from 'ethers'
	const { parseUnits } = utils

	// Methods/hooks/lifecycle

	import { random } from '../../lib/random'

	const getPlaceholderVault = () => {
		const vaultConfig = getDefaultVaultConfig(random(Object.values(VaultType)))

		const { decimals } = vaultConfig.tokens[0] ?? {}

		return {
			vaultConfig,

			vaultStatus: {
				contractAddress: '0x0000000000000000000000000000000000000000',
				tokenId: 0,
				totalBalance: parseUnits((Math.random() * 12345678 | 0).toString(), decimals),
				endTimestamp: Date.now() + 120000
			},

			vaultPosition: {
				balance: parseUnits('1234', decimals),
				yieldEarned: parseUnits('1000', decimals)
			}
		}
	}

	const vaults = [
		getPlaceholderVault(),
		getPlaceholderVault(),
		getPlaceholderVault(),
		getPlaceholderVault(),
		getPlaceholderVault(),
		getPlaceholderVault(),
		getPlaceholderVault(),
		getPlaceholderVault(),
		getPlaceholderVault(),
	]



	// Internal state
	import type { TableMetadata } from '@tableland/sdk'

	export let selectedTable: TableMetadata


	// Components
	import Address from '../../components/Address.svelte'
	import Date_ from '../../components/Date.svelte'
	import Tableland from '../../components/Tableland.svelte'
	import Vault from '../../components/Vault.svelte'
	import VaultManager from '../../components/VaultManager.svelte'
</script>


<section>
	<h1>{$_('My Vaults')}</h1>
</section>

<section id="top" class="column">
	<Tableland
		account={$account}
		let:connection
		let:network let:account
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

		<article class="card column" slot="table"
			let:table
		>
			<header class="row">
				<h3>{table.name}</h3>
				<span>{$_('Tableland Table')}</span>
			</header>

			{#if table.description}<p>{table.description}</p>{/if}

			<footer class="row align-end">
				<span>managed by <Address {network} address={table.controller} /></span>
				<!-- <output>{(table.structure)}</output> -->
				<span>created <Date_ date={table.created_at} /></span>
			</footer>
		</article>
	</Tableland>

	{#each vaults as { vaultConfig, vaultStatus, vaultPosition }}
		<div class="vault-manager row">
			<Vault
				{vaultConfig}
				{vaultStatus}
				{vaultPosition}
			/>

			<VaultManager
				{vaultConfig}
				{vaultStatus}
				{vaultPosition}
			/>
		</div>
	{/each}
</section>


<style>
	.vault-manager {
		align-items: start;
		grid-template-columns: auto 1fr;
	}
</style>