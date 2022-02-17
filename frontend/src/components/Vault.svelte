<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'

	import { VaultType, vaultTypeInfo, type VaultConfig } from '../lib/vaults'

	type T = $$Generic<VaultType>	
	
	
	// Internal state
	export let vaultConfig: VaultConfig<T>


	// Components
	import PieChart from './PieChart.svelte'


	// Styles/animations
	import { scale } from 'svelte/transition'
	import { flip } from 'svelte/animate'
</script>


<h2>{vaultConfig.about.name || $_('My Vault')}</h2>

{#if vaultConfig.about.description}
	<p transition:scale class="align-start">{vaultConfig.about.description}</p>
{/if}

<div class="row">
	<p>{$_(vaultTypeInfo[vaultConfig.type].label)}</p>

	<!-- {#if vaultConfig.type === VaultType.Degen}
		<PieChart data={[
			{ amount: vaultConfig.config.jackpot, label: 'Jackpot' },
			{ amount: vaultConfig.config.dividend, label: 'Dividend' },
			{ amount: vaultConfig.config.treasury, label: 'Treasury' },
		]} />
	{/if} -->
</div>

{#if vaultConfig.about.website || vaultConfig.about.twitter || vaultConfig.about.discord}
	<div class="row centered" transition:scale>
		{#each
			[
				{ link: vaultConfig.about.website, label: 'Website' },
				{ link: vaultConfig.about.twitter, label: 'Twitter' },
				{ link: vaultConfig.about.discord, label: 'Discord' }
			].filter(({ link }) => link)
			as
			{ link, label } (label)
		}
			<a href={vaultConfig.about.website} transition:scale animate:flip>{$_(label)}</a>
		{/each}
	</div>
{/if}
