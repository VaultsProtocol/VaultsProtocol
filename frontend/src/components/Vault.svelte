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
		<header class="row">
			<div class="row">
				<span class="chain">
					<TokenIcon token={networksByChainID[vaultConfig.chainId].nativeCurrency} />
				</span>

				{#if vaultConfig.about.name}
					<h2 class="align-start" transition:scale>{vaultConfig.about.name}</h2>
				{/if}
			</div>

			{#if isPosition ? vaultStatus.totalBalance : vaultConfig.config.initialLiquidity}
				<TokenBalance balance={isPosition ? vaultStatus.totalBalance : vaultConfig.config.initialLiquidity} token={vaultConfig.tokens[0]} />
			{/if}
		</header>

		<div class="stack">
			{#key vaultConfig.type}
				<figure class="illustration-wrapper card" transition:fade>
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
			<div class="stack centered">
				<span class="token-id row centered">{vaultStatus.tokenId}</span>
				<svg width="50" height="50" viewBox="-1.5 -1.5 3 3">
					<defs>
						<!-- <path id="c" d="m -1, 0 a 1,1 0 0,1 2,0 a 1,1 0 0,1 -2,0 "/> -->
						<!-- <path id="c" d="m -1,0 a 1,1 0 0,1 2,0 a 1,1 0 0,1 -2,0 "/> -->
						<path id="c" d="
							M-1,0
							A1,1,0,1,1,1,0 A1,1,0,1,1,-1,0
							A1,1,0,1,1,1,0 A1,1,0,1,1,-1,0
						"/>
					</defs>
					<text fill="currentColor" style="font-size: 0.66px; letter-spacing: 0.15px">
						<textPath xlink:href="#c">
							EDITION
							<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" />
						</textPath>
					</text>
				</svg>
			</div>
			
			<div class="stack">
				{#key vaultConfig.type}
					<div class="vault-type card row centered" transition:scale={{ start: 0.33 }}>
						{$_(vaultTypeInfo[vaultConfig.type]?.label) ?? $_('???')}
					</div>
				{/key}
			</div>

			<img width="50" height="50" />

			<!-- {#if vaultConfig.type === VaultType.Degen}
				<PieChart data={[
					{ amount: vaultConfig.config.jackpot, label: 'Jackpot' },
					{ amount: vaultConfig.config.dividend, label: 'Dividend' },
					{ amount: vaultConfig.config.treasury, label: 'Treasury' },
				]} />
			{/if} -->
		</div>

		{#if vaultConfig.about.description}
			<HeightContainer>
				<p class="description align-start" transition:scale>{vaultConfig.about.description}</p>
			</HeightContainer>
		{/if}

		<div class="metadata column">
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
					<div class="row">
						<img src={icon} width="20" height="20" />
						<span>{$_(label)}</span>
					</div>

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
		</div>

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
		filter: drop-shadow(0 1px 0.5em var(--background-color-0));
	}
	
	.vault {
		border: var(--background-color-2) 0.5em solid;
		overflow: auto;
		max-height: calc(100vh - var(--header-height) - 4rem);
		font-size: 16px;
	}

	header {
		--grid-gap: 2em;
		/* align-items: start; */
	}
	.chain {
		transform: scale(3);
		z-index: 1;
		filter: drop-shadow(0 0 1px var(--background-color-1));
		align-self: start;
	}
	h2 {
		font-size: 1.1em;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.illustration-wrapper {
		background: var(--background-color-2);
		border: var(--background-color-3) 0.25em solid;
	}
	.illustration {
		aspect-ratio: 1.5;
	}

	.silhouette {
		fill: black;
	}

	.description {
		font-size: 0.8em;
		word-break: break-word;
	}

	.vault-type-info {
		grid-template-columns: auto 1fr auto;
		margin: 0 -1em;
	}

	.vault-type-info .token-id {
		font-size: 0.85em;
		background-color: black;
		border-radius: 50%;
		width: 1.66em;
		height: 1.66em;
	}

	.vault-type-info .vault-type {
		padding: 0.5em;
		border-radius: 0;
		border: 0;
		background: radial-gradient(50% 50% at 50% 50%, #D2C26E 0%, #DEB60D 100%);
		font-weight: 800;
	}

	.vault-type .card .row {
		background: radial-gradient(50% 50% at 50% 50%, #D2C26E 0%, #DEB60D 100%);
		border: 30px solid red;

	}

	/* .text-path {
		animation: Spin 10s linear infinite;
	}
	@keyframes Spin {
		to { transform: rotate(1turn) }
	} */

	.metadata {
		gap: 0.5em;
	}
	.metadata > * {
		padding: 0.85em;
	}
	.metadata > * > .row {
		gap: 0.5em;
	}
</style>