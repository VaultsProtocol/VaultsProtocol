<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'
	import { MetadataType, VaultType, vaultTypeInfo, type VaultConfig, type VaultStatus, type VaultPosition } from '../lib/vaults'
	import { networksByChainID } from '$lib/networks'
	import { BigNumber } from 'ethers'
	
	
	// External state
	type T = $$Generic<VaultType>
	
	export let vaultConfig: VaultConfig<T>

	export let vaultStatus: VaultStatus = {
		tokenId: 0,
		totalBalance: BigNumber.from(10000),
		endTimestamp: Date.now() + 120000
	}

	export let vaultPosition: VaultPosition = {
		withdrawableBalance: BigNumber.from(0),
		yieldEarned: BigNumber.from(0)
	}

	let isPosition = false // Vault vs individual position
	$: isPosition = !!vaultPosition


	// Components
	import Countdown from './Countdown.svelte'
	import HeightContainer from './HeightContainer.svelte'
	import PieChart from './PieChart.svelte'
	import TokenBalance from './TokenBalance.svelte'
	import TokenIcon from './TokenIcon.svelte'


	// Images
	import websiteIcon from '../assets/icons/website.svg'
	import twitterIcon from '../assets/icons/twitter.svg'
	import discordIcon from '../assets/icons/discord.svg'


	// Styles/animations
	import { fade, scale } from 'svelte/transition'
	import { flip } from 'svelte/animate'
</script>


<svg class="vault-container" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg">
	<foreignObject x="0" y="0" width="400" height="800">
		<div xmlns="http://www.w3.org/1999/xhtml">

<article class="vault card">
	<HeightContainer class="column">
		<header>
			<div class="row">
				<TokenIcon token={networksByChainID[vaultConfig.chainId].nativeCurrency} />

				<h2>{vaultConfig.about.name}</h2>
				<!-- <h2>{vaultConfig.about.name || $_('My Vault')}</h2> -->

				{#if vaultStatus.totalBalance}
					<TokenBalance balance={vaultStatus.totalBalance} token={vaultConfig.tokens[0]} />
				{/if}
			</div>
		</header>

		<div class="stack">
			{#key vaultConfig.type}
				<figure class="card" transition:fade>
					<svg class="illustration">
						{#if vaultConfig.type === VaultType.Standard}
							<path class:silhouette={isPosition} />
						{:else if vaultConfig.type === VaultType.Degen}
							<path class:silhouette={isPosition} />
						{:else if vaultConfig.type === VaultType.DAO}
							<path class:silhouette={isPosition} />
						{:else if vaultConfig.type === VaultType.Charity}
							<path class:silhouette={isPosition} />	
						<!-- {:else if vaultConfig.type === VaultType.Superfluid}
							<path class:silhouette={isPosition} /> -->
						{/if}
					</svg>
				</figure>
			{/key}
		</div>

		<div class="vault-type-info row">
			{vaultStatus.tokenId}
			
			<div class="stack">
				{#key vaultConfig.type}
					<div class="vault-type card row centered" transition:scale={{ start: 0.33 }}>
						{$_(vaultTypeInfo[vaultConfig.type]?.label) ?? $_('???')}
					</div>
				{/key}
			</div>

			<img />

			<!-- {#if vaultConfig.type === VaultType.Degen}
				<PieChart data={[
					{ amount: vaultConfig.config.jackpot, label: 'Jackpot' },
					{ amount: vaultConfig.config.dividend, label: 'Dividend' },
					{ amount: vaultConfig.config.treasury, label: 'Treasury' },
				]} />
			{/if} -->
		</div>

		{#if vaultConfig.about.description}
			<p class="align-start" transition:scale>{vaultConfig.about.description}</p>
		{/if}

		{#each
			isPosition ?
				[
					{ icon: '', label: 'Balance', displayType: MetadataType.TokenBalance, value: vaultPosition.withdrawableBalance },
					{ icon: '', label: 'Earned', displayType: MetadataType.TokenBalance, value: vaultPosition.yieldEarned },
				]
			: vaultConfig.type === VaultType.Degen ?
				[
					{ icon: '', label: 'Jackpot', displayType: MetadataType.TokenBalance, value: vaultConfig.config.jackpot },
					{ icon: '', label: 'Dividend', displayType: MetadataType.TokenBalance, value: vaultConfig.config.dividend },
					{ icon: '', label: 'Treasury', displayType: MetadataType.TokenBalance, value: vaultConfig.config.treasury },
					{ icon: '', label: 'Deadline', displayType: MetadataType.Date, value: vaultConfig.config.deadline },
				]
			: vaultConfig.type === VaultType.DAO ?
				[
					{ icon: '', label: 'Governance Type', displayType: MetadataType.Date, value: vaultConfig.config.governanceType },
				]
			: vaultConfig.type === VaultType.Charity ?
				[
					{ icon: '', label: 'Payout Type', displayType: MetadataType.String, value: vaultConfig.config.payoutType },
				]
			: []
			as
			{ icon, label, displayType, value } (label)
		}
			<div class="card row" transition:scale animate:flip>
				<img src={icon} alt={$_(label)} />
				<span>
					{#if displayType === MetadataType.TokenBalance}
						<TokenBalance {value} />
					{:else if displayType === MetadataType.Date}
						{value} seconds
						<!-- <Countdown toTimestamp={value} /> -->
					{:else}
						{$_(value)}
					{/if}
				</span>
			</div>
		{/each}

		{#if vaultConfig.about.website || vaultConfig.about.twitter || vaultConfig.about.discord}
			<div class="row centered" transition:scale>
				{#each
					[
						{ label: 'Website', link: vaultConfig.about.website, icon: websiteIcon },
						{ label: 'Twitter', link: vaultConfig.about.twitter, icon: twitterIcon },
						{ label: 'Discord', link: vaultConfig.about.discord, icon: discordIcon }
					].filter(({ link }) => link)
					as
					{ label, link, icon } (label)
				}
					<a href={link} transition:scale animate:flip>
						<!-- {$_(label)} -->
						<img src={icon} alt={label} />
					</a>
				{/each}
			</div>
		{/if}
	</HeightContainer>
</article>

		</div>
	</foreignObject>
</svg>


<style>
	.vault-container {
		width: 400px;
		height: 800px;
	}

	.vault {
		border: var(--background-color-2) 0.5em solid;
		overflow: auto;
		max-height: calc(100vh - var(--header-height) - 4rem);
		width: 400px;
	}

	.illustration {
		aspect-ratio: 1.5;
	}

	.silhouette {
		fill: black;
	}

	h2 {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	p {
		word-break: break-word;
	}

	.vault-type-info {
		grid-template-columns: auto 1fr auto;
	}

	.vault-type-info .vault-type {
		padding: 0.5em;
	}
</style>