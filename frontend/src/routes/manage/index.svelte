<script>
	import { _ } from 'svelte-i18n'


	import { getDefaultVaultConfig, VaultType } from '../../lib/vaults'

	import { BigNumber, utils } from 'ethers'
	const { parseUnits } = utils

	import { random } from '../../lib/random'

	const getPlaceholderVault = () => {
		const vaultConfig = getDefaultVaultConfig(random(Object.values(VaultType)))

		const { decimals } = vaultConfig.tokens[0] ?? {}

		return {
			vaultConfig,

			vaultStatus: {
				tokenId: 0,
				totalBalance: parseUnits('12345678', decimals),
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


	import Tableland from '../../components/Tableland.svelte'
	import Vault from '../../components/Vault.svelte'
	import VaultManager from '../../components/VaultManager.svelte'
</script>


<main>
	<section>
		<h1>{$_('My Vaults')}</h1>
	</section>

	<section id="top" class="column">
		<Tableland />

		{#each vaults as { vaultConfig, vaultStatus, vaultPosition }}
			<div class="row">
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
</main>


<style>
	.row {
		align-items: start;
		grid-template-columns: auto 1fr;
	}
</style>