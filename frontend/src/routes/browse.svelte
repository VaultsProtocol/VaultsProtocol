<script>
	import { _ } from 'svelte-i18n'


	import { getDefaultVaultConfig, VaultType } from '../lib/vaults'

	import { BigNumber } from 'ethers'

	const getPlaceholderVault = () => ({
		vaultConfig: getDefaultVaultConfig(random(Object.values(VaultType))),

		vaultStatus: {
			tokenId: 0,
			totalBalance: BigNumber.from(10000),
			endTimestamp: Date.now() + 120000
		}
	})

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


	import Vault from '../components/Vault.svelte'
import { random } from '../lib/random';
</script>


<main>
	<section>
		<h1>{$_('Browse Vaults')}</h1>
	</section>

	<section id="top">
		<div class="grid">
			{#each vaults as { vaultConfig, vaultStatus }}
				<Vault
					{vaultConfig}
					{vaultStatus}
				/>
			{/each}
		</div>
	</section>
</main>


<style>
	.grid {
		--grid-size: 400px;
		grid-auto-rows: 540px;
		/* --grid-gap: 2rem; */
	}
</style>