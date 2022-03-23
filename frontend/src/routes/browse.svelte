<script>
	import { _ } from 'svelte-i18n'


	import { getRandomVaultConfig } from '../lib/vaultConfig'

	import { utils } from 'ethers'
	const { parseUnits } = utils

	const getPlaceholderVault = () => {
		const vaultConfig = getRandomVaultConfig()

		return {
			vaultConfig,

			vaultStatus: {
				tokenId: 0,
				totalBalance: parseUnits(((Math.random() * 1000000 | 0) / 100).toString(), vaultConfig.tokens[0].decimals),
				endTimestamp: Date.now() + 120000
			}
		}
	}

	const vaults = []
	for(let i = 0; i < 60; i++)
		vaults.push(getPlaceholderVault())


	// import { queryTable } from '$lib/tableland'

	// let results
	// queryTable({ query: 'SELECT * FROM table' }).then(_ => vaults = _)


	import Vault from '../components/Vault.svelte'

	// Images
	import browseIcon from '../assets/icons/browse-icon.svg'
</script>


<section class="column centered">
	<h1 class="row-inline">
		<img src={browseIcon} width="50" />
		{$_('Browse Vaults')}
	</h1>
</section>

<section id="top">
	<div class="grid">
		{#each vaults as { vaultConfig, vaultStatus }}
			<Vault
				{vaultConfig}
				{vaultStatus}
				isRotatable
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
		grid-auto-rows: 620px;
		/* --grid-gap: 2rem; */
	}
</style>
