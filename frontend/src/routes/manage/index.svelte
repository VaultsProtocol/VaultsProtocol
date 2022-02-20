<script>
	import { _ } from 'svelte-i18n'


	import { getDefaultVaultConfig } from '../lib/vaults'

	import { BigNumber } from 'ethers'

	const getPlaceholderVault = () => ({
		vaultConfig: getDefaultVaultConfig(),

		vaultStatus: {
			tokenId: 0,
			totalBalance: BigNumber.from(10000),
			endTimestamp: Date.now() + 120000
		},

		vaultPosition: {

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
</script>


<main>
	<section>
		<h1>{$_('My Vaults')}</h1>
	</section>

	<section id="top">
		<div class="grid">
			{#each vaults as { vaultConfig, vaultStatus, vaultPosition }}
				<Vault
					{vaultConfig}
					{vaultStatus}
					{vaultPosition}
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