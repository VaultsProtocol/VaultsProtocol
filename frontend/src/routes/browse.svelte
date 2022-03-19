<script>
	import { _ } from 'svelte-i18n'


	import { getRandomVaultConfig } from '../lib/vaults'

	import { BigNumber } from 'ethers'

	const getPlaceholderVault = () => ({
		vaultConfig: getRandomVaultConfig(),

		vaultStatus: {
			tokenId: 0,
			totalBalance: BigNumber.from(10000),
			endTimestamp: Date.now() + 120000
		}
	})

	const vaults = []
	for(let i = 0; i < 50; i++)
		vaults.push(getPlaceholderVault())


	// import { queryTable } from '$lib/tableland'

	// let results
	// queryTable({ query: 'SELECT * FROM table' }).then(_ => vaults = _)


	import Vault from '../components/Vault.svelte'
</script>


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


<style>
	.grid {
		--grid-size: 400px;
		grid-auto-rows: 540px;
		grid-auto-rows: 800px;
		grid-auto-rows: 666.666px;
		/* --grid-gap: 2rem; */
	}
</style>
