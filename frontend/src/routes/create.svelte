<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'

	import {
		type VaultConfig,
		getDefaultVaultConfig,
		VaultType,
		vaultTypeInfo,
		YieldStrategy,
		yieldStrategyInfo,
		GovernanceType,
		governanceTypeInfo,
		PayoutType,
		payoutTypeInfo,
		// GovernanceStrategy,
		// governanceStrategyInfo,
	} from '$lib/vaults'

	import { erc20Tokens } from '$lib/tokens'
	import { networks, networksByChainID, vaultAssetsByNetwork } from '$lib/networks'



	enum Steps {
		Idle,
		TransactionSigning,
		TransactionPending,
		TransactionFailed,
		TransactionSuccess
	}


	// Stores
	import { provider } from '../stores/provider'


	// Internal state

	let currentStep = Steps.Idle

	let vaultConfig: VaultConfig = getDefaultVaultConfig()

	$: isValid =
		!!vaultConfig.about.name &&
		!!vaultConfig.about.name && vaultConfig.about.name && vaultConfig.about.name


	// import DAOFactory from '../lib/contracts/DAOFactory.sol/DAOFactory.json'
	// $: if(currentStep = Steps.TransactionSigning)(async () => {
	// 	const contract = new Contract('0x', DAOFactory.abi, $provider)

	// 	try {
	// 		await contract.estimateGas.createDao()
	// 		await contract.estimateGas.createDao()
	// 	}catch(e){
	// 		errorMessage = e.message
	// 		currentStep = Steps.TransactionFailed
	// 	}
	// })()


	// Components
	import Vault from '../components/Vault.svelte'
	import HeightContainer from '../components/HeightContainer.svelte'
	import AddressInput from '../components/AddressInput.svelte'
	import Select from '../components/Select.svelte'
	import Tabs from '../components/Tabs.svelte'
	import TokenSelect from '../components/TokenSelect.svelte'
	import TokenAmountSelect from '../components/TokenAmountSelect.svelte'
	import MultipleAddressInput from '../components/MultipleAddressInput.svelte'
	import PercentInput from '../components/PercentInput.svelte'
	import TimeSelect from '../components/TimeSelect.svelte'


	import { fade, fly, scale } from 'svelte/transition'
</script>


<main>
	<section>
		<h1>{$_('Create a Vault')}</h1>
	</section>

	<section class="row">
		<div class="vault-preview sticky">
			<Vault {vaultConfig} />
		</div>

		<!-- svelte-ignore a11y-label-has-associated-control -->
		<form
			class="column"
			on:submit|preventDefault={() => currentStep = Steps.TransactionSigning}
			disabled={currentStep !== Steps.Idle}
		>
			<section class="card vault-content column">
				<h2>{$_('Vault Information')}</h2>

				<hr>

				<label class="column">
					<h3>{$_('Vault Name')}</h3>
					<p>{$_('The project, cause, or investment you\'re fundraising for.')}</p>
					<input
						type="text"
						bind:value={vaultConfig.about.name}
						placeholder={$_('My Vault')}
						required
					/>
				</label>

				<label class="column">
					<h3>{$_('Description')}</h3>
					<p>{$_('Tell your community what your goals are.')}</p>
					<textarea
						bind:value={vaultConfig.about.description}
						placeholder={$_('Describe {name}...', { values: { name: vaultConfig.about.name || 'your Vault' }})}
						rows={8}
					/>
				</label>

				<label class="column">
					<h3>{$_('Website')}</h3>
					<input
						type="text"
						bind:value={vaultConfig.about.website}
						placeholder={$_('mydao.example.com')}
					/>
				</label>

				<div class="grid">
					<label class="column">
						<h3>{$_('Twitter')}</h3>
						<input
							type="text"
							bind:value={vaultConfig.about.twitter}
							placeholder={$_('twitter.com/ETHDenver')}
						/>
					</label>

					<label class="column">
						<h3>{$_('Discord')}</h3>
						<input
							type="text"
							bind:value={vaultConfig.about.discord}
							placeholder={$_('discord.gg/xyz')}
						/>
					</label>
				</div>
			</section>

			<section class="card column">
				<h2>{$_('Vault Configuration')}</h2>

				<hr>

				<div class="column vault-row">
					<label class="card row equal">
						<h3>{$_('Network / Chain')}</h3>
						<div class="equal">
							<Select
								bind:value={vaultConfig.chainId}
								values={networks.map(({ chainId }) => String(chainId))}
								labels={Object.fromEntries(networks.map(({ chainId, name }) => [chainId, name]))}
							/>
						</div>
					</label>

					<label class="card row equal">
						<h3>{$_('Vault Asset')}</h3>

						<TokenSelect availableTokens={vaultAssetsByNetwork[networksByChainID[vaultConfig.chainId].slug] ?? []} bind:token={vaultConfig.tokens[0]} />
						<!-- {#each vaultConfig.config.tokens as token, i}}
							<TokenAmountSelect
								bind:token={vaultConfig.config.initialLiquidity.tokens[i]}
								bind:amount={vaultConfig.config.initialLiquidity.amount}
							/>
						{/each} -->
					</label>

					<label class="card column">
						<div class="row equal">
							<h3>{$_('Yield Strategy')}</h3>
							<div>
								<Select
									bind:value={vaultConfig.yieldStrategy}
									values={Object.keys(YieldStrategy)}
									labels={Object.fromEntries(Object.entries(yieldStrategyInfo).map(([key, {label}]) => [key, label]))}
									icons={Object.fromEntries(Object.entries(yieldStrategyInfo).map(([key, {icon}]) => [key, icon]))}
								/>
							</div>
						</div>
						<div class="row">
							<p class="row">{$_(yieldStrategyInfo[vaultConfig.yieldStrategy].description)}</p>
						</div>
					</label>
					

				</div>
			</section>

			<section class="card column vault-behavior">
				<h2>{$_('Vault Behavior')}</h2>

				<hr>

				<div class="column">
					<Tabs
						bind:value={vaultConfig.type}
						values={Object.keys(VaultType)}
						labels={Object.fromEntries(Object.entries(vaultTypeInfo).map(([key, {label}]) => [key, label]))}
						colors={{
							[VaultType.Standard]: 'var(--background-color-standard)',
							[VaultType.Degen]: 'var(--background-color-degen)',
							[VaultType.Charity]: 'var(--background-color-charity)',
							[VaultType.DAO]: 'var(--background-color-DAO)',
						}}
					/>

					<div class="stack">
						{#key vaultTypeInfo[vaultConfig.type]}
							<p class="card" transition:scale={{ start: 0.9 }}>
								{$_(vaultTypeInfo[vaultConfig.type]?.description ?? 'Choose a vault behavior.')}
							</p>
						{/key}
					</div>
				</div>

				<HeightContainer class="stack align-top">
					{#if vaultConfig.type === VaultType.Standard}
						<div class="grid" in:fly={{ x: 20 }} out:fly={{ x: -20 }}>
						</div>
					{:else if vaultConfig.type === VaultType.Degen}
						<div class="grid" in:fly={{ x: 20 }} out:fly={{ x: -20 }}>
							<label class="card column">
								<h4>{$_('Jackpot')}</h4>
								<PercentInput bind:value={vaultConfig.config.jackpot} />
								<p>{$_('This portion is paid out to the last contributor when the game ends.')}</p>
							</label>

							<label class="card column">
								<h4>{$_('Dividend')}</h4>
								<PercentInput bind:value={vaultConfig.config.dividend} />
								<p>{$_('This amount is distributed to all past contributors every time a new contribution is made.')}</p>
							</label>

							<label class="card column">
								<h4>{$_('Treasury')}</h4>
								<PercentInput bind:value={vaultConfig.config.treasury} />
								<p>{$_('After the jackpot winner and the dividends are paid out, the remaining funds go to the DAO treasury.')}</p>
							</label>

							<label class="card column">
								<h4>{$_('Initial Minimum Amount')}</h4>
								<TokenAmountSelect
									availableTokens={vaultConfig.tokens}
									bind:token={vaultConfig.config.initialLiquidity.token}
									bind:amount={vaultConfig.config.initialLiquidity.amount}
								/>
								<p>{$_('The initial amount of tokens to supply.')}</p>
							</label>

							<label class="card column">
								<h4>{$_('Deadline')}</h4>
								<TimeSelect bind:value={vaultConfig.config.deadline} />
								<p>{$_('The window of time starting from the time of the last contribution for another contribution to be made.')}</p>
							</label>
						</div>

					{:else if vaultConfig.type === VaultType.DAO}
						<div class="grid" in:fly={{ x: 20 }} out:fly={{ x: -20 }}>
							<div class="card column">
								<div class="column">
									<h3>{$_('Governance Type')}</h3>
									<Tabs
										bind:value={vaultConfig.config.governanceType}
										values={Object.values(GovernanceType)}
										labels={Object.fromEntries(Object.entries(governanceTypeInfo).map(([key, {label}]) => [key, label]))}
									/>
									<p>{$_(governanceTypeInfo[vaultConfig.config.governanceType]?.description)}</p>
								</div>

								<div class="stack">
									{#if vaultConfig.config.governanceType === GovernanceType.MultiSignature}
										<div class="grid">
											<label class="card column" transition:scale>
												<h3>{$_('Minimum Signatures')}</h3>
												<input type="number" bind:value={vaultConfig.config.minimumSignatures} />
												<p>{$_('The number of signers needed to approve changes to the vault.')}</p>
											</label>

											<label class="card column" transition:scale>
												<h3>{$_('Signers')}</h3>
												<p>{$_('The addresses of the signers participating in the multi-signature vault.')}</p>
												<MultipleAddressInput bind:values={vaultConfig.config.signers} />
											</label>
										</div>
									{:else if vaultConfig.config.governanceType === GovernanceType.TokenVoting}
										<label class="card column" transition:scale>
											<h3>{$_('Quorum')}</h3>
											<PercentInput bind:value={vaultConfig.config.quorum} />
											<p>{$_('The minimum amount of voting power participating in the vote for a proposal to be decided.')}</p>
										</label>
									{/if}
								</div>
							</div>

							<!-- Quadratic
							Proportional -->
						</div>

					{:else if vaultConfig.type === VaultType.Charity}
						<div class="grid" in:fly={{ x: 20 }} out:fly={{ x: -20 }}>
							<label class="card column">
								<h3>{$_('Recipient')}</h3>
								<AddressInput bind:address={vaultConfig.config.recipientAddress} />
								<p>{$_('The recipient to whom a specified portion of the yield will be sent.')}</p>
							</label>

							<label class="card column">
								<h3>{$_('Yield to Recipient')}</h3>
								<PercentInput bind:value={vaultConfig.config.recipientYieldPercent} />
								<p>{$_('The portion of the yield to set aside for the recipient. Remaining yield is distributed proportionally to holders.')}</p>
							</label>

							<label class="card column">
								<h3>{$_('Payout Type')}</h3>
								<div>
									<Select
										bind:value={vaultConfig.config.payoutType}
										values={Object.keys(PayoutType)}
										labels={Object.fromEntries(Object.entries(payoutTypeInfo).map(([key, {label}]) => [key, label]))}
									/>
								</div>
								{#if vaultConfig.config.payoutType}
									<p>{$_(payoutTypeInfo[vaultConfig.config.payoutType].description)}</p>
								{/if}
							</label>
						</div>
						
					<!-- {:else if vaultConfig.type === VaultType.Superfluid} -->
					{/if}
				</HeightContainer>
			</section>

			<!-- <section class="card column">
				<h2>{$_('Treasury')}</h2>

				<hr>

				<label class="column">
					<h3>{$_('Yield Strategy')}</h3>
					<div>
						<Select
							bind:value={vaultConfig.yieldStrategy}
							values={Object.keys(YieldStrategy)}
							labels={Object.fromEntries(Object.entries(yieldStrategyInfo).map(([key, {label}]) => [key, label]))}
						/>
					</div>
					<p>{$_(yieldStrategyInfo[vaultConfig.yieldStrategy].description)}</p>
				</label>
			</section> -->

			<!-- <section class="card column">
				<h2>{$_('Governance')}</h2>

				<hr>

				<label class="column">
					<h3>{$_('Governance Strategy')}</h3>
					<div>
						<Select
							bind:value={vaultConfig.governanceStrategy}
							values={Object.keys(GovernanceStrategy)}
							labels={Object.fromEntries(Object.entries(governanceStrategyInfo).map(([key, {label}]) => [key, label]))}
						/>
					</div>
					<p>{$_(governanceStrategyInfo[vaultConfig.governanceStrategy].description)}</p>
				</label>
			</section> -->

			<div class="row centered">
				<button type="submit" class="extra-large round primary" disabled={!isValid}>{$_('Create DAO')}</button>
			</div>
		</form>
	</section>
</main>


<style>
	main {
		--grid-gap: 2rem;
	}

	section.row {
		grid-template-columns: auto 1fr;
	}

	.vault-preview {
		width: 25rem;
		--grid-gap: 1rem;

		transform: rotateY(10deg);
	}
	form {
		/* grid-auto-rows: calc(100vh - var(--header-height) - 50vh); */

		scroll-snap-align: center;

		margin-bottom: 33vh;
	}
	form > section {
		margin: auto;
		/* min-width: min(30rem, 90vw); */
		width: 100%;
		/* max-height: calc(100vh - var(--header-height) - 2rem); */

		--grid-gap: 1rem;
	}

	.vault-behavior .card,
	.vault-behavior p {
		border-color: #f3f3f3;
	}


	.card.row .equal {
		width: 100%;
	}
	
	.row {
		align-items: start;
	}

	form > section > .card {
		--grid-gap: 3rem;
	}

	
	/* .card {
		place-content: start;
		place-items: start;
	} */

	.vault-row label {
		border-color: #f3f3f3;
	}

	label {
		transition: 0.2s;
	}
	label.card:focus-within {
		box-shadow: 0 1px 0.25rem var(--background-color-0);
		transition: 0.5s;
	}

	label p {
		font-size: 0.9em;
		/* opacity: 0.8; */
	}
</style>