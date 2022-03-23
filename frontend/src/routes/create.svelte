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
	} from '$lib/vaultConfig'

	import { availableNetworks, networkIcons, mainnetForTestnet, networks, networksByChainID, networksBySlug, vaultAssetsByNetwork } from '$lib/networks'


	// Stores
	import { account } from '../stores/account'
	import { deployedVaults } from '../stores/deployedVaults'


	// Internal state
	let vaultConfig: VaultConfig<any> = getDefaultVaultConfig()

	
	// Methods/hooks/lifecycle
	import { createVault } from '$lib/vaultsProtocol'

	// import { getVaultsTable } from '$lib/tableland'


	// Components
	import Vault from '../components/Vault.svelte'
	import Container from '../components/Container.svelte'
	import AddressInput from '../components/AddressInput.svelte'
	import Select from '../components/Select.svelte'
	import Tabs from '../components/Tabs.svelte'
	import TokenSelect from '../components/TokenSelect.svelte'
	import TokenAmountSelect from '../components/TokenAmountSelect.svelte'
	import MultipleAddressInput from '../components/MultipleAddressInput.svelte'
	import PercentInput from '../components/PercentInput.svelte'
	import TimeSelect from '../components/TimeSelect.svelte'
	import TransactionFlow from '../components/TransactionFlow.svelte'


	// Images
	import createIcon from '../assets/icons/create-icon.svg'


	// Styles/animation
	import { fly, scale } from 'svelte/transition'
</script>


<section class="column centered">
	<h1 class="row-inline">
		<img src={createIcon} width="50" />
		{$_('Create a Vault')}
	</h1>
</section>

<section class="row">
	<div class="vault-preview sticky">
		<Vault {vaultConfig} />
	</div>

	<!-- svelte-ignore a11y-label-has-associated-control -->
	<TransactionFlow
		account={$account}
		network={networksByChainID[vaultConfig.chainId]}

		createTransaction={async ({ network, address, signer }) =>
			await createVault({
				vaultConfig,
				network,
				address,
				signer
			})
		}

		onTransactionSuccess={async tx => {
			const deployedVault = {
				vaultConfig,
				contractAddress: '',
				transactionHash: tx.hash,
			}

			console.log('deployedVault', deployedVault, tx)

			$deployedVaults = [
				...$deployedVaults,
				deployedVault
			]

			// console.log('getVaultsTable')

			// const result = await (await getVaultsTable({
			// 	// signer: $account.signer
			// })).create({
			// 	vaultConfig,
			// 	contractAddress: 'test',
			// 	transactionHash: tx.hash,
			// })
			// console.log('getVaultsTable', result)

			// (await getVaultsTable({
			// 	// signer: $account.signer
			// })).create({
			// 	vaultConfig,
			// 	contractAddress: '',
			// 	transactionHash: tx.hash,
			// })
		}}
	>
		<svelte:fragment slot="idle" let:actions={{ next }}>
			<section class="card vault-content column">
				<div class="row">
					<!-- <img src="/" alt=""> -->
					<h2>{$_('Vault Information')}</h2>


				</div>

				<hr>

				<label class="column">
					<h3>{$_('Vault Name')}</h3>
					<!-- <p>{$_('The project, cause, or investment you\'re fundraising for.')}</p> -->
					<input
						type="text"
						required
						bind:value={vaultConfig.about.name}
						placeholder={$_('My Yield-Bearing Token Vault')}
					/>
					<!-- placeholder={$_('Your Vault')} -->
				</label>

				<label class="column">
					<h3>{$_('Description')}</h3>
					<!-- <p>{$_('Tell your community what your goals are or what to expect.')}</p> -->
					<textarea
						bind:value={vaultConfig.about.description}
						placeholder={$_('Describe {name} to your community of token depositors/NFT holders...', {
							values: { name: vaultConfig.about.name ? `"${vaultConfig.about.name}"` : 'your Vault' }
						})}
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
					<label class="card row">
						<h3>{$_('Network / Chain')}</h3>
						<Select
							bind:value={vaultConfig.chainId}
							values={availableNetworks.map(({ chainId }) => String(chainId))}
							getLabel={chainId => networksByChainID[chainId].name}
							icons={networkIcons}
						/>
					</label>
					<!-- <label class="card column">
						<h3>{$_('Network / Chain')}</h3>
						<Tabs
							bind:value={vaultConfig.chainId}
							values={availableNetworks.map(({ chainId }) => String(chainId))}
							getLabel={chainId => networksByChainID[chainId].name}
							icons={networkIcons}
						/>
					</label> -->

					<label class="card row">
						<h3>{$_('Vault Asset')}</h3>

						<TokenSelect
							availableTokens={vaultAssetsByNetwork[networksByChainID[vaultConfig.chainId]?.slug] ?? []}
							bind:token={vaultConfig.tokens[0]}
							autoFallback
							required
						/>
						<!-- {#each vaultConfig.config.tokens as token, i}}
							<TokenAmountSelect
								bind:token={vaultConfig.config.initialLiquidity.tokens[i]}
								bind:amount={vaultConfig.config.initialLiquidity.amount}
							/>
						{/each} -->
					</label>

					<label class="card column">
						<div class="row">
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

			<section class="card column vault-behavior" style="--accent-color: {vaultTypeInfo[vaultConfig.type]?.color}">
				<h2>{$_('Vault Behavior')}</h2>

				<hr>

				<div class="column">
					<Tabs
						required
						bind:value={vaultConfig.type}
						values={Object.keys(VaultType)}
						getLabel={vaultType => vaultTypeInfo[vaultType]?.label}
						getColor={vaultType => vaultTypeInfo[vaultType]?.color}
					/>

					<div class="stack">
						{#key vaultTypeInfo[vaultConfig.type]}
							<p class="card" transition:scale={{ start: 0.9 }}>
								{$_(vaultTypeInfo[vaultConfig.type]?.description ?? 'Choose a vault behavior.')}
							</p>
						{/key}
					</div>
				</div>

				<Container class="stack align-top">
					{#if vaultConfig.type === VaultType.Standard}
						<div class="grid" in:fly={{ x: 20 }} out:fly={{ x: -20 }}>
						</div>
					{:else if vaultConfig.type === VaultType.Degen}
						<div class="grid" in:fly={{ x: 20 }} out:fly={{ x: -20 }}>
							<label class="card column">
								<h4>{$_('Dividend')}</h4>
								<PercentInput
									required
									bind:value={vaultConfig.config.dividend}
								/>
								<p>{$_('This amount is distributed to all past contributors every time a new contribution is made.')}</p>
							</label>

							<label class="card column">
								<h4>{$_('Jackpot')}</h4>
								<PercentInput
									required
									bind:value={vaultConfig.config.jackpot}
								/>
								<p>{$_('This portion is paid out to the last contributor when the game ends.')}</p>
							</label>

							<label class="card column">
								<h4>{$_('Treasury')}</h4>
								<PercentInput
									required
									bind:value={vaultConfig.config.treasury}
								/>
								<p>{$_('After the dividends and the jackpot winner are paid out, the remaining funds go to the DAO treasury.')}</p>
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
				</Container>
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
			</div>
		</svelte:fragment>

		<!-- <svelte:fragment slot="confirming" let:actions={{ back }}> -->
		<svelte:fragment slot="confirming-message" let:network>
			<h2>{$_('Ready to deploy')}</h2>

			<p>{$_('Your {vaultType} vault "{vaultName}" is ready to be deployed to {networkName}!', {
				values: {
					vaultType: vaultTypeInfo[vaultConfig.type].label,
					vaultName: vaultConfig.about.name,
					networkName: network.name
				}
			})}</p>
		</svelte:fragment>

		<!-- <svelte:fragment slot="pending"> -->
		<svelte:fragment slot="pending-message" let:network>
			{$_('Deploying your {vaultType} vault "{vaultName}" to {networkName}...', {
				values: {
					vaultType: vaultTypeInfo[vaultConfig.type].label,
					vaultName: vaultConfig.about.name,
					networkName: network.name
				}
			})}
		</svelte:fragment>

		<!-- <svelte:fragment slot="failed"> -->

		<!-- <svelte:fragment slot="success"> -->
		<svelte:fragment slot="success-message" let:network>
			{$_('Your {vaultType} vault "{vaultName}" was deployed to {networkName}!', {
				values: {
					vaultType: vaultTypeInfo[vaultConfig.type].label,
					vaultName: vaultConfig.about.name,
					networkName: network.name
				}
			})}
		</svelte:fragment>
	</TransactionFlow>
</section>


<style>
	section.row {
		grid-template-columns: auto 1fr;
		margin-bottom: 10vh;
	}

	.vault-preview {
		width: 25rem;
		--grid-gap: 1rem;

		transform: rotateY(10deg);
	}

	.vault-row .card,
	.vault-behavior .card {
		background: white;
	}

	.vault-behavior .card,
	.vault-behavior p {
		border-color: #f3f3f3;
	}
	

	label {
		transition: 0.2s;
	}
	label.card:focus-within {
		/* box-shadow: 0 1px 0.25rem var(--background-color-0); */
		box-shadow: var(--background-color-3) 0 0 1.2px 2.5px inset;
		/* transition: 0.5s; */
	}

	label p {
		font-size: 0.9em;
		/* opacity: 0.8; */
	}

	main :global(details) {
		font-size: 1.2em;
	}
</style>
