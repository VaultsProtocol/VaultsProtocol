<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'


	// Stores
	import { account } from '../../stores/account'


	// Formatting
	import { utils } from 'ethers'
	const { parseUnits } = utils


	// Methods/hooks/lifecycle

	import { getRandomVaultConfig } from '../../lib/vaults'

	const getPlaceholderVault = () => {
		const vaultConfig = getRandomVaultConfig()

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
	// import type { TableMetadata } from '@tableland/sdk'

	// export let selectedTable: TableMetadata


	// Components
	import TablelandVaults from '../../components/TablelandVaults.svelte'
	import Vault from '../../components/Vault.svelte'
	import VaultManager from '../../components/VaultManager.svelte'

	// Images
	import manageIcon from '../../assets/icons/manage-icon.svg'

</script>

<section>
	<h1>
		<!-- temp -->
		<img src={manageIcon} width="30" />
		{$_('Manage Vaults')}</h1>
</section>

<section class="column">
	<TablelandVaults
		account={$account}
	/>
</section>

{#each vaults as { vaultConfig, vaultStatus, vaultPosition }}
	<section class="manage-vault row">
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
	</section>
{/each}


<style>
	.manage-vault {
		justify-content: center;
		margin: auto;
	}
</style>