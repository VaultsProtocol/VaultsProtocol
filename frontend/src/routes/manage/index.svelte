<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'
	import { networksByChainID } from '$lib/networks'


	// Stores
	import { account } from '../../stores/account'
	import { rpcProvider } from '../../stores/rpcProvider'

	import { deployedVaults } from '../../stores/deployedVaults'


	// Formatting
	import { utils } from 'ethers'
	const { parseUnits } = utils


	// Methods/hooks/lifecycle

	import { getVaultStatus, getVaultPosition } from '$lib/vaultsProtocol'

	import { getRandomVaultConfig } from '../../lib/vaultConfig'

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
				balance: parseUnits((Math.random() * 1234 | 0).toString(), decimals),
				yieldEarned: parseUnits((Math.random() * 12 | 0).toString(), decimals),
			}
		}
	}

	const placeholderVaults = [
		getPlaceholderVault(),
		getPlaceholderVault(),
		getPlaceholderVault(),
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
	import VaultPositionManager from '../../components/VaultPositionManager.svelte'


	// Images
	import manageIcon from '../../assets/icons/manage-icon.svg'
	
	
	// Styles/animations
	import { scale } from 'svelte/transition'
</script>

<section class="column centered">
	<h1 class="row-inline">
		<img src={manageIcon} width="50" />
		{$_('Manage Vaults')}
	</h1>
</section>

<!-- <section class="row equal"> -->
<section class="column">
	<section class="card column">
		<header class="row">
			<h2>{$_('Your Deployed Vaults')}</h2>
		</header>

		{#each $deployedVaults as { vaultConfig, contractAddress }}
			<div class="stack">
				{#await (async () =>
					({
						vaultStatus: await getVaultStatus({
							contractAddress,
							network: networksByChainID[vaultConfig.chainId],
							provider: $rpcProvider,
						}),
						vaultPositions: await Promise.all(
							[0].map(tokenId =>
								getVaultPosition({
									contractAddress,
									network: networksByChainID[vaultConfig.chainId],
									provider: $rpcProvider,
									tokenId,
								})
							)
						)
					})
				)()}
					<div class="card" transition:scale>
						{$_('Loading your vault positions...')}
					</div>
				{:then { vaultStatus, vaultPositions }}
					<div class="card" transition:scale>
						{#each vaultPositions as vaultPosition}
							<div class="manage-vault row">
								<Vault
									{vaultConfig}
									{vaultStatus}
									{vaultPosition}
								/>

								<VaultPositionManager
									{vaultConfig}
									{vaultStatus}
									{vaultPosition}
								/>
							</div>
						{:else}
							{$_('You don\'t have any vaults!')}
						{/each}
					</div>
				{:catch e}
					<div class="card" transition:scale>
						<output>{e}</output>
					</div>
				{/await}
			</div>
		{/each}

		{#each placeholderVaults as { vaultConfig, vaultStatus, vaultPosition }}
			<div class="manage-vault row">
				<Vault
					{vaultConfig}
					{vaultStatus}
					{vaultPosition}
				/>

				<VaultPositionManager
					{vaultConfig}
					{vaultStatus}
					{vaultPosition}
				/>
			</div>
		{/each}
	</section>

	<TablelandVaults
		account={$account}
	/>
</section>


<style>
	.manage-vault {
		justify-content: center;
		align-items: start;
		max-height: 600px;
		overflow: hidden;
		padding: 1em;
		gap: 2em;
	}
</style>