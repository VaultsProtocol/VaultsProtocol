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
	import { availableNetworks, networkIcons, mainnetForTestnet, networks, networksByChainID, networksBySlug, vaultAssetsByNetwork } from '$lib/networks'

	import { walletsByType } from '$lib/wallets'



	enum Steps {
		Idle,
		Confirming,
		TransactionSigning,
		TransactionPending,
		TransactionFailed,
		TransactionReverted,
		TransactionSuccess
	}


	// Stores
	import { provider } from '../stores/provider'
	import { account } from '../stores/account'


	// Internal state

	let currentStep = Steps.Idle

	let vaultConfig: VaultConfig = getDefaultVaultConfig()

	let formElement: HTMLFormElement

	$: isValid =
		!!vaultConfig.about.name &&
		!!vaultConfig.type &&
		formElement?.valid
		// formElement && [...formElement.elements].every(fieldElement => !fieldElement.required || !fieldElement.isEmpty)
	
	let tx
	let errorMessage

	
	// Methods/hooks/lifecycle

	import { ContractFactory, ethers, utils } from 'ethers'
	const { AbiCoder } = utils
	import { getContract, getContractBytecode } from '$lib/contracts'

	$: if($account && currentStep === Steps.TransactionSigning)(async () => {
		const network = networksByChainID[vaultConfig.chainId]

		const { address, signer } = $account

		console.log('signer', signer)

		try {
			const VaultFactory = getContract({
				signer,
				network,
				name: 'VaultFactory'
			})

			console.log('VaultFactory', VaultFactory)

			console.log("Deploying sample vault")

			console.log(
				// getContractBytecode({ network, name: 'BaseVault' }),
				// getContractBytecode({ network, name: 'YearnStrategy' }),
				vaultConfig.tokens[0].address,
				address,
				new AbiCoder().encode(
					["address", "string", "string"],
					[vaultConfig.tokens[0].address, vaultConfig.about.name, vaultConfig.about.tickerSymbol ?? 'TEST'],
				),
				{
					gasLimit: '3500000'
				}
			)

			tx = await VaultFactory.createVault(
				getContractBytecode({ network, name: 'BaseVault' }),
				getContractBytecode({ network, name: 'YearnStrategy' }),
				vaultConfig.tokens[0].address,
				address,
				new AbiCoder().encode(
					["address", "string", "string"],
					[vaultConfig.tokens[0].address, vaultConfig.about.name, vaultConfig.about.tickerSymbol ?? 'TEST'],
				),
				{
					gasLimit: '3500000'
				}
			)
		}catch(e){
			errorMessage = e.message
			currentStep = Steps.TransactionFailed
		}
	})()

	$: if(tx)(async () => {
		console.log('tx', tx)

		currentStep = Steps.TransactionPending

		try {
			await tx.wait(1)
		}catch(e){
			errorMessage = e.message
			currentStep = Steps.TransactionReverted
			// currentStep = Steps.TransactionFailed

			return
		}

		currentStep = Steps.TransactionSuccess

		// const sampleVault = await VaultFactory.vaults("0")

		// console.log("sample vault is", sampleVault)
	})()

	$: if(errorMessage)
		console.error(errorMessage)


	// Formatting
	import { formatAddress } from '$lib/formatAddress'


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
	import Portal from '../components/Portal.svelte'
	import Modal from '../components/Modal.svelte'


	// Styles/animation
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

		<div class="stack align-top">
			{#if currentStep === Steps.Idle}
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<form
					bind:this={formElement}
					class="column"
					on:submit|preventDefault={() => currentStep++}
					disabled={currentStep !== Steps.Idle}
					transition:fly={{ x: -100 }}
				>
					<section class="card vault-content column">
						<div class="row">
							<!-- <img src="/" alt=""> -->
							<h2>{$_('Vault Information')}</h2>


						</div>

						<hr>

						<label class="column">
							<h3>{$_('Vault Name')}</h3>
							<p>{$_('The project, cause, or investment you\'re fundraising for.')}</p>
							<input
								type="text"
								required
								bind:value={vaultConfig.about.name}
								placeholder={$_('Your Vault')}
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
								placeholder={$_('all-your-vault.example.com')}
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
								<Select
									bind:value={vaultConfig.chainId}
									values={availableNetworks.map(({ chainId }) => String(chainId))}
									labels={Object.fromEntries(networks.map(({ chainId, name }) => [chainId, name]))}
									icons={networkIcons}
								/>
							</label>

							<label class="card row equal">
								<h3>{$_('Vault Asset')}</h3>

								<TokenSelect availableTokens={vaultAssetsByNetwork[networksByChainID[vaultConfig.chainId]?.slug] ?? []} bind:token={vaultConfig.tokens[0]} />
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
									<Select
										bind:value={vaultConfig.yieldStrategy}
										values={Object.keys(YieldStrategy)}
										labels={Object.fromEntries(Object.entries(yieldStrategyInfo).map(([key, {label}]) => [key, label]))}
										icons={Object.fromEntries(Object.entries(yieldStrategyInfo).map(([key, {icon}]) => [key, icon]))}
									/>
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
								required
								bind:value={vaultConfig.type}
								values={Object.keys(VaultType)}
								labels={Object.fromEntries(Object.entries(vaultTypeInfo).map(([key, {label}]) => [key, label]))}
								colors={Object.fromEntries(Object.entries(vaultTypeInfo).map(([key, {color}]) => [key, color]))}
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
										<PercentInput
											required
											bind:value={vaultConfig.config.jackpot}
										/>
										<p>{$_('This portion is paid out to the last contributor when the game ends.')}</p>
									</label>

									<label class="card column">
										<h4>{$_('Dividend')}</h4>
										<PercentInput
											required
											bind:value={vaultConfig.config.dividend}
										/>
										<p>{$_('This amount is distributed to all past contributors every time a new contribution is made.')}</p>
									</label>

									<label class="card column">
										<h4>{$_('Treasury')}</h4>
										<PercentInput
											required
											bind:value={vaultConfig.config.treasury}
										/>
										<p>{$_('After the jackpot winner and the dividends are paid out, the remaining funds go to the DAO treasury.')}</p>
									</label>

									<label class="card column">
										<h4>{$_('Initial Minimum Amount')}</h4>
										<TokenAmountSelect
											required
											availableTokens={vaultConfig.tokens}
											bind:token={vaultConfig.config.initialLiquidity.token}
											bind:amount={vaultConfig.config.initialLiquidity.amount}
										/>
										<p>{$_('The initial amount of tokens to supply.')}</p>
									</label>

									<label class="card column">
										<h4>{$_('Deadline')}</h4>
										<TimeSelect
											required
											bind:value={vaultConfig.config.deadline}
										/>
										<p>{$_('The window of time starting from the time of the last contribution for another contribution to be made.')}</p>
									</label>
								</div>

							{:else if vaultConfig.type === VaultType.DAO}
								<div class="grid" in:fly={{ x: 20 }} out:fly={{ x: -20 }}>
									<div class="card column">
										<div class="column">
											<h3>{$_('Governance Type')}</h3>
											<Tabs
												required
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
														<input
															type="number"
															required
															min={1}
															bind:value={vaultConfig.config.minimumSignatures}
														/>
														<p>{$_('The number of signers needed to approve changes to the vault.')}</p>
													</label>

													<label class="card column" transition:scale>
														<h3>{$_('Signers')}</h3>
														<p>{$_('The addresses of the signers participating in the multi-signature vault.')}</p>
														<MultipleAddressInput
															bind:values={vaultConfig.config.signers}
														/>
													</label>
												</div>
											{:else if vaultConfig.config.governanceType === GovernanceType.TokenVoting}
												<label class="card column" transition:scale>
													<h3>{$_('Quorum')}</h3>
													<PercentInput
														required
														bind:value={vaultConfig.config.quorum}
													/>
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
										<AddressInput
											required
											bind:address={vaultConfig.config.recipientAddress}
										/>
										<p>{$_('The recipient to whom a specified portion of the yield will be sent.')}</p>
									</label>

									<label class="card column">
										<h3>{$_('Yield to Recipient')}</h3>
										<PercentInput
											required
											bind:value={vaultConfig.config.recipientYieldPercent}
										/>
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
						<!-- <button type="submit" class="extra-large round primary" disabled={!isValid || !$account}>{$_('Create Vault')}</button>					</div> -->
						<button
							type="submit"
							class="extra-large round primary"
						>{$_('Create Vault')}</button>
				</form>
			{:else if currentStep === Steps.Confirming}
				<form
					class="card column centered"
					on:submit|preventDefault={() => currentStep++}
					transition:fly={{ x: -100 }}
				>
					<h2>{$_('Ready to deploy')}</h2>

					<p>{$_('Your {vaultType} vault "{vaultName}" is ready to be deployed to {networkName}!', {
						values: {
							vaultType: vaultTypeInfo[vaultConfig.type].label,
							vaultName: vaultConfig.about.name,
							networkName: networksByChainID[vaultConfig.chainId].name
						}
					})}</p>

					<div class="row centered">
						<div class="stack">
							{#if !$account}
								<button class="large round primary" disabled>{$_('Connect Wallet')}</button>
							{:else}
								<button type="submit" class="large round primary">{$_('Sign Transaction')}</button>
							{/if}
						</div>
						<button type="button" class="large round" on:click={() => currentStep--}>{$_('Go Back')}</button>
					</div>
				</form>
			{:else if currentStep === Steps.TransactionSigning}
				<div
					class="card column centered"
					transition:scale
				>
					<img src={walletsByType[$account.walletConnection.walletType].icon} width="100" />

					<h2>{$_('Sign Transaction')}</h2>

					<p>{$_('Sign the transaction with {walletName} ({address}).', {
						values: {
							walletName: walletsByType[$account.walletConnection.walletType].name,
							address: formatAddress($account.address)
						}
					})}</p>

					<button type="button" class="large round" on:click={() => currentStep--}>{$_('Go Back')}</button>
				</div>
			{:else if currentStep === Steps.TransactionPending}
				<div
					class="card column centered"
					transition:scale
				>
					<h2>{$_('Waiting...')}</h2>

					<p>{$_('Deploying your {vaultType} vault "{vaultName}" to {networkName}...', {
						values: {
							vaultType: vaultTypeInfo[vaultConfig.type].label,
							vaultName: vaultConfig.about.name,
							networkName: networksByChainID[vaultConfig.chainId].name
						}
					})}</p>
				</div>
			{:else if currentStep === Steps.TransactionFailed || currentStep === Steps.TransactionReverted}
				<div
					class="card column centered"
					transition:scale
				>
					<h2>{$_('Transaction Failed')}</h2>

					<output>{errorMessage}</output>

					<div class="row centered">
						<button class="large round primary" on:click={() => currentStep = Steps.TransactionSigning}>{$_('Try Again')}</button>
						<button class="large round" on:click={() => currentStep = Steps.Idle}>{$_('Cancel')}</button>
					</div>
				</div>
			{:else if currentStep === Steps.TransactionSuccess}
				<div
					class="card column centered"
					transition:scale
				>
					<h3>{$_('Success!')}</h3>
					
					<p>{$_('Your {vaultType} vault "{vaultName}" was deployed to {networkName}!', {
						values: {
							vaultType: vaultTypeInfo[vaultConfig.type].label,
							vaultName: vaultConfig.about.name,
							networkName: networksByChainID[vaultConfig.chainId].name
						}
					})}</p>

					<div class="column centered">
						<a href="/manage"><button>{$_('Manage')}</button></a>
						<a href="/exploree"><button>{$_('Explore')}</button>
					</div>
				</div>
			{/if}
		</div>
	</section>
</main>


{#if currentStep !== Steps.Idle}
	<Portal>
		<Modal>
			{errorMessage}
		</Modal>
	</Portal>
{/if}


<style>
	main {
		--grid-gap: 2rem;
	}

	section.row {
		grid-template-columns: auto 1fr;
	}

	.vault-content input,
	.vault-content summary, 
	.vault-content textarea {
		background: var(--background-color-f3);
	}

	.vault-row summary,
	.vault-row summary button {
		background: green;
	}

	.vault-preview {
		width: 25rem;
		--grid-gap: 1rem;

		transform: rotateY(10deg);
	}
	form {
		/* grid-auto-rows: calc(100vh - var(--header-height) - 50vh); */

		scroll-snap-align: center;

		/* margin-bottom: 33vh; */
		margin-bottom: 10vh;
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

	.vault-behavior input,
	.vault-behavior input[type='placeholder'],
	.vault-behavior input[type='number'], 
	.vault-behavior :global(input),
	.vault-behavior :global(summary) {
		background: var(--background-color-f3);
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

	.vault-row :global(button),
	.vault-row :global(input) {
		background: var(--background-color-f3);
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

	main :global(details) {
		font-size: 1.2em;
	}
</style>