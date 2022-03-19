<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'
	import { type VaultConfig, type VaultStatus, type VaultPosition, MetadataType, VaultType, vaultTypeInfo, yieldStrategyInfo, GovernanceType, YieldStrategy } from '../lib/vaults'
	import { type Network, networkIcons, networksByChainID } from '$lib/networks'
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
		balance: BigNumber.from(0),
		yieldEarned: BigNumber.from(0)
	}


	// Internal state

	let isPosition = false // Vault vs individual position
	// $: isPosition = !!vaultPosition

	let network: Network
	$: network = networksByChainID[vaultConfig.chainId]

	let metadata
	$: metadata =
		/* isPosition ?
			[
				{ icon: '', label: 'Balance', displayType: MetadataType.TokenBalance, value: vaultPosition.withdrawableBalance },
				{ icon: '', label: 'Earned', displayType: MetadataType.TokenBalance, value: vaultPosition.yieldEarned },
			]
		: */ vaultConfig.type === VaultType.Degen ?
			[
				{ icon: '🎰', label: 'Jackpot', displayType: MetadataType.Percent, value: vaultConfig.config.jackpot },
				{ icon: '💸', label: 'Dividend', displayType: MetadataType.Percent, value: vaultConfig.config.dividend },
				{ icon: '💸', label: 'Treasury', displayType: MetadataType.Percent, value: vaultConfig.config.treasury },
				{ icon: '🛑', label: 'Deadline', displayType: MetadataType.Date, value: vaultConfig.config.deadline },
			]
		: vaultConfig.type === VaultType.DAO && vaultConfig.config.governanceType === GovernanceType.MultiSignature ?
			[
				{ icon: '🗳', label: 'Governance Type', displayType: MetadataType.String, value: vaultConfig.config.governanceType },
				{ icon: '📝', label: 'Minimum Signatures', displayType: MetadataType.String, value: vaultConfig.config.minimumSignatures },
				{ icon: '✍️', label: 'Signers', displayType: MetadataType.String, value: vaultConfig.config.signers.filter(Boolean).length },
			]
		: vaultConfig.type === VaultType.DAO && vaultConfig.config.governanceType === GovernanceType.TokenVoting ?
			[
				{ icon: '🗳', label: 'Governance Type', displayType: MetadataType.String, value: vaultConfig.config.governanceType },
				{ icon: '👋', label: 'Quorum', displayType: MetadataType.Percent, value: vaultConfig.config.quorum },
			]
		: vaultConfig.type === VaultType.Charity ?
			[
				{ icon: '🤲', label: 'Recipient', displayType: MetadataType.Address, value: vaultConfig.config.recipientAddress },
				{ icon: '🍰', label: 'Yield to Recipient', displayType: MetadataType.Percent, value: vaultConfig.config.recipientYieldPercent },
				{ icon: '💰', label: 'Payout Type', displayType: MetadataType.String, value: vaultConfig.config.payoutType },
			]
		: []


	// Components
	import Address from './Address.svelte'
	import Container from './Container.svelte'
	import TokenBalance from './TokenBalance.svelte'
	// import PieChart from './PieChart.svelte'
	// import Icon from './Icon.svelte'


	// Images
	import websiteIcon from '../assets/icons/website.svg'
	import twitterIcon from '../assets/icons/twitter.svg'
	import discordIcon from '../assets/icons/discord.svg'

	import cardBack from '../assets/card-faces/card-back.svg'

	import cardFaceFrog from '../assets/card-faces/frog.svg'
	import cardFaceGift from '../assets/card-faces/gift.svg'
	import cardFaceVote from '../assets/card-faces/voting-box.svg'
	import cardFaceShark from '../assets/card-faces/shark.svg'
	import cardFaceFrogShadow from '../assets/card-faces/shadow-svg-1.svg'
	import cardFaceGiftShadow from '../assets/card-faces/shadow-svg-2.svg'
	import cardFaceVoteShadow from '../assets/card-faces/shadow-svg-3.svg'
	import cardFaceSharkShadow from '../assets/card-faces/shadow-svg-4.svg'


	// Styles/animations
	import { fade, scale } from 'svelte/transition'
	import { flip } from 'svelte/animate'
</script>


<svg class="vault-container" viewBox="0 0 400 666.666" xmlns="http://www.w3.org/2000/svg">
	<foreignObject x="0" y="0" width="400" height="666.666">
<!-- <svg class="vault-container" viewBox="-100 -100 600 866.666" xmlns="http://www.w3.org/2000/svg">
	<foreignObject x="-100" y="-100" width="600" height="866.666"> -->
		<div xmlns="http://www.w3.org/1999/xhtml">

		<article class="vault stack" style="--card-background: url({cardBack})">
	<div class="back card">
		
	</div>

	<div class="front card">
		<Container class="column">
			<header class="row">
				<div class="row">
					<div class="stack">
						{#key vaultConfig.chainId}
							<div class="chain" transition:scale>
								<img src={networkIcons[vaultConfig.chainId]} width="14"/>
							</div>
						{/key}
					</div>

					{#if vaultConfig.about.name}
						<h2 class="align-start" transition:scale>{vaultConfig.about.name}</h2>
					{/if}
				</div>

				{#if isPosition ? vaultStatus.totalBalance : vaultConfig.config.initialLiquidity}
					<TokenBalance balance={isPosition ? vaultStatus.totalBalance : vaultConfig.config.initialLiquidity.amount} erc20Token={vaultConfig.tokens[0]} />
				{/if}
			</header>

			<div class="stack">
				<figure class="illustration-wrapper card stack centered" style="background-color: {vaultTypeInfo[vaultConfig.type]?.color}">
					{#key vaultConfig.type}
						<!-- svelte-ignore a11y-missing-attribute -->
						<img
							class="illustration"
							src={
								isPosition
									? {
										[VaultType.Standard]: cardFaceShark,
										[VaultType.Degen]: cardFaceFrog,
										[VaultType.DAO]: cardFaceVote,
										[VaultType.Charity]: cardFaceGift,
									}[vaultConfig.type]
									: {
										[VaultType.Standard]: cardFaceSharkShadow,
										[VaultType.Degen]: cardFaceFrogShadow,
										[VaultType.DAO]: cardFaceVoteShadow,
										[VaultType.Charity]: cardFaceGiftShadow,
									}[vaultConfig.type]
							}
							transition:scale
						/>
					{/key}
				</figure>
			</div>

			<div class="vault-type-info row">
				<div class="stack centered">
					<span class="token-id row centered">{vaultStatus.tokenId}</span>
					<svg class="text-path" width="50" height="50" viewBox="-1.5 -1.5 3 3">
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
								<!-- <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" /> -->
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

				<div class="yield-strategy stack">
					{#key vaultConfig.yieldStrategy}
						{#if vaultConfig.yieldStrategy !== YieldStrategy.None}
							<img src={yieldStrategyInfo[vaultConfig.yieldStrategy]?.icon} width="32" height="32" transition:scale />
						{/if}
					{/key}
				</div>

				<!-- {#if vaultConfig.type === VaultType.Degen}
					<PieChart data={[
						{ amount: vaultConfig.config.jackpot, label: 'Jackpot' },
						{ amount: vaultConfig.config.dividend, label: 'Dividend' },
						{ amount: vaultConfig.config.treasury, label: 'Treasury' },
					]} />
				{/if} -->
			</div>

			{#if vaultConfig.about.description}
				<Container>
					<p class="description align-start" transition:scale>{vaultConfig.about.description}</p>
				</Container>
			{/if}

			<div class="metadata column" style="--l: {metadata.length}">
				{#each metadata as { icon, label, displayType, value }, i (label)}
					<div class="card row" in:scale={{ delay: i * 100 }} out:scale animate:flip>
						<div class="row">
							<!-- <img src={icon} width="20" height="20" /> -->
							<span>{$_(icon)}</span>
							<span class="label">{$_(label)}</span>
						</div>

						<div class="stack align-end">
							{#key value}
								<span class="value" transition:scale={{ start: 0.3 }}>
									{#if displayType === MetadataType.TokenBalance}
										<TokenBalance {value} erc20Token={vaultConfig.tokens[0]} />
									{:else if displayType === MetadataType.Date}
										<span>{value} seconds</span>
										<!-- <Countdown toTimestamp={value} /> -->
									{:else if displayType === MetadataType.Percent}
										<span>{value}%</span>
									{:else if displayType === MetadataType.Address}
										<Address network={networksByChainID[vaultConfig.chainId]} address={value} linked={false} />
									{:else if displayType === MetadataType.String}
										<!-- <span>{$_(value)}</span> -->
										{value ?? ''}
									{/if}
								</span>
							{/key}
						</div>
					</div>
				{/each}
			</div>

			{#if vaultConfig.about.website || vaultConfig.about.twitter || vaultConfig.about.discord}
				<div class="row centered icons-row" transition:scale>
					
					{#each
						[
							{ label: 'Website', link: vaultConfig.about.website, icon: websiteIcon },
							{ label: 'Twitter', link: vaultConfig.about.twitter, icon: twitterIcon },
							{ label: 'Discord', link: vaultConfig.about.discord, icon: discordIcon }
						].filter(({ link }) => link)
						as
						{ label, link, icon } (label)
					}
						<a class="icon button round" href={link.includes('://') ? link : 'https://' + link} target="_blank" rel="nofollow" transition:scale animate:flip>
							<!-- {$_(label)} -->
							<img src={icon} alt={label} width="22" />
						</a>
					{/each}
				</div>
			{/if}
		</Container>
	</div>
</article>

		</div>
	</foreignObject>
</svg>


<style>
	.card {
		background-color: var(--background-color-white);
		border: 2px solid var(--border-color-cc);
		box-shadow: none;
	}


	.vault-container {
		width: 400px;
		height: 666.666px;
		transition: 1s;
		perspective: 1000px;
		transform-style: preserve-3d;
		filter: drop-shadow(0 1px 0.5em var(--background-color-4));
	}
	
	.vault {
		font-size: 16px;
		/* position: absolute; */
		--grid-gap: 1em;

		transition: 1s;
		/* transform-origin: left; */
	}
	.vault-container:is(:hover, :focus) .vault {
		/* transform: rotateY(0.5turn); */


		/* transform: translateZ(-200px) rotateY(0.5turn) translateZ(-200px); */
		/* transform-origin: center; */
	}

	.vault > .card {
		backface-visibility: hidden;
		transition: 1s;
	}
	.vault > .card.front {
		overflow-y: auto;
		max-height: calc(100vh - var(--header-height) - 4rem);
		/* transform: translateZ(1px); */
	}
	.vault > .card.back {
		background: black var(--card-background) center / cover no-repeat;
		transform: rotateY(0.5turn);
	}

	header {
		--grid-gap: 2em;
		/* align-items: start; */
	}
	.chain {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--background-color-white);
		width: 1.25em;
		height: 1.25em;
		border-radius: 50%;
		transform: scale(3) translateZ(1px);
		z-index: 1;
		border: 0.1px solid var(--background-color-4);
		filter: drop-shadow(0 0 1px var(--background-color-3));
		align-self: start;
	}
	h2 {
		font-size: 1.1em;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.illustration-wrapper {
		background-color: var(--background-color-2);
		border: rgba(0, 0, 0, 0.3) 0.25em solid;
		transition: 0.3s;
		border-radius: 5px;
	}
	.illustration {
		aspect-ratio: 1.5;
		animation: Float 6s infinite ease-in-out;
		height: 12em;
	}
	@keyframes Float {
		0%, 100% { transform: translateY(3px) rotate(-0.5deg) }
		25%, 75% { transform: scale(1.03) }
		50% { transform: translateY(-3px) rotate(0.5deg) }
	}

	/* .silhouette {
		fill: black;
	} */

	.yield-strategy {
		/* display: flex; */
		padding: 0.5rem;
	}

	.description {
		font-size: 0.8em;
		word-break: break-word;
	}

	.vault-type-info {
		grid-template-columns: auto 1fr auto;
		margin-left: -1em;
		margin-right: -1em;
	}

	.vault-type-info .token-id {
		font-size: 0.85em;
		background-color: black;
		border-radius: 50%;
		width: 1.66em;
		height: 1.66em;
		color: #fff;
	}
	.vault-type-info .text-path {
		animation: Spin 10s linear infinite;
	}
	@keyframes Spin {
		to { transform: rotate(1turn) }
	}

	.vault-type-info .vault-type {
		padding: 0.5em;
		border-radius: 3px;
		border: 0;
		background: radial-gradient(50% 50% at 50% 50%, #D2C26E 0%, #DEB60D 100%);
		font-weight: 800;
	}

	.metadata {
		--grid-gap: 0.5rem;
		align-content: center;

		overflow-y: auto;
		max-height: 200px;
		font-size: clamp(0.85em, 3em / var(--l), 1em);
	}
	.metadata > * {
		/* padding: 0.85em; */
		padding: 0.66em;
		border: none;
		background-color: rgba(0, 0, 0, 0.05);
	}
	.metadata > * > .row {
		--grid-gap: 0.5rem;
	}
	.metadata .label {
		font-weight: 500;
	}
	.metadata .value {
		display: block;
		overflow: hidden;
		line-height: 1.2;
		text-overflow: ellipsis;
		opacity: 0.8;
		text-align: right;
		transform-origin: right;
	}

	/* .metadata > * { transition: zoom 0.3s; } */
	/* .metadata > * { transition: font-size 0.3s; } */
	/* .metadata > :first-child:nth-last-child(1), .metadata > :first-child:nth-last-child(1) ~ * { --l: 1; }
	.metadata > :first-child:nth-last-child(2), .metadata > :first-child:nth-last-child(2) ~ * { --l: 2; }
	.metadata > :first-child:nth-last-child(3), .metadata > :first-child:nth-last-child(3) ~ * { --l: 3; }
	.metadata > :first-child:nth-last-child(4), .metadata > :first-child:nth-last-child(4) ~ * { --l: 4; }
	.metadata > :first-child:nth-last-child(5), .metadata > :first-child:nth-last-child(5) ~ * { --l: 5; }
	.metadata > :first-child:nth-last-child(6), .metadata > :first-child:nth-last-child(6) ~ * { --l: 6; }
	.metadata > :first-child:nth-last-child(7), .metadata > :first-child:nth-last-child(7) ~ * { --l: 7; }
	.metadata > :first-child:nth-last-child(8), .metadata > :first-child:nth-last-child(8) ~ * { --l: 8; } */
	/* .metadata > * {
		zoom: clamp(0.85, 3 / var(--l), 1);
		font-size: calc(1em * clamp(0.85, 3 / var(--l), 1));
	} */

	.icons-row {
		--grid-gap: 2.5em;
	}
	.icon {
		border-radius: 50%;
		width: 40px;
		height: 40px;
		border: 2px solid var(--background-color-charity);
		padding: 0;
	}
	.icon img {
		margin: auto;
	}
</style>