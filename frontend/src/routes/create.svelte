<script lang="ts">
  import TimeSelect from '../components/TimeSelect.svelte';

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
	import { networks } from '$lib/networks'



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
	import Select from '../components/Select.svelte'
	import Tabs from '../components/Tabs.svelte'
	import TokenSelect from '../components/TokenSelect.svelte'
	import TokenAmountSelect from '../components/TokenAmountSelect.svelte'


	import { fly } from 'svelte/transition'
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
			<section class="card column">
				<h2>{$_('About')}</h2>

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
						placeholder={$_('Describe {name}...', { values: { name: vaultConfig.about.name || 'your DAO' }})}
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

				<div class="grid">
					<label class="card column">
						<h3>{$_('Chain')}</h3>
						<div>
							<Select
								bind:value={vaultConfig.chainId}
								values={networks.map(({ chainId }) => String(chainId))}
								labels={Object.fromEntries(networks.map(({ chainId, name }) => [chainId, name]))}
							/>
						</div>
					</label>

					<label class="card column">
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

					<label class="card column">
						<h3>{$_('Available Tokens')}</h3>

						<TokenSelect bind:token={vaultConfig.tokens[0]} />
						<!-- {#each vaultConfig.config.tokens as token, i}}
							<TokenAmountSelect
								bind:token={vaultConfig.config.initialLiquidity.tokens[i]}
								bind:amount={vaultConfig.config.initialLiquidity.amount}
							/>
						{/each} -->
					</label>
				</div>
			</section>

			<section class="card column">
				<h2>{$_('Vault Behavior')}</h2>

				<hr>

				<label class="column">
					<h3>{$_('Type')}</h3>
					<div class="">
						<Tabs
							bind:value={vaultConfig.type}
							values={Object.keys(VaultType)}
							labels={Object.fromEntries(Object.entries(vaultTypeInfo).map(([key, {label}]) => [key, label]))}
						/>
					</div>
					{#if vaultTypeInfo[vaultConfig.type]}
						<p>{$_(vaultTypeInfo[vaultConfig.type].description)}</p>
					{/if}
				</label>

				<div class="stack">
					{#if vaultConfig.type === VaultType.Standard}
						<div class="grid" in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
						</div>
					{:else if vaultConfig.type === VaultType.Degen}
						<div class="grid" in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
							<label class="card column">
								<h4>{$_('Jackpot')}</h4>
								<p>{$_('This portion is paid out to the last contributor when the crowdfund ends.')}</p>
								<div class="row">
									<span>
										<input
											type="number"
											min="0"
											max="100"
											bind:value={vaultConfig.config.jackpot}
										/>
										%
									</span>
									<!-- <button
										type="button"
										class="small"
									>
										{$_('Remaining')}
									</button> -->
								</div>
							</label>

							<label class="card column">
								<h4>{$_('Dividend')}</h4>
								<p>{$_('This amount is distributed to all past contributors every time a new contribution is made.')}</p>
								<span>
									<input
										type="number"
										min="0"
										max="100"
										bind:value={vaultConfig.config.dividend}
									/>
									%
								</span>
							</label>

							<label class="card column">
								<h4>{$_('Treasury')}</h4>
								<p>{$_('After the jackpot winner and the dividends are paid out, the remaining funds go to the DAO treasury.')}</p>
								<span>
									<input
										type="number"
										min="0"
										max="100"
										bind:value={vaultConfig.config.treasury}
									/>
									%
								</span>
							</label>

							<label class="card column">
								<h4>{$_('Initial Minimum Amount')}</h4>
								<p>{$_('After the jackpot winner and the dividends are paid out, the remaining funds go to the DAO treasury.')}</p>
								<span>
									<TokenAmountSelect
										bind:token={vaultConfig.config.initialLiquidity.token}
										bind:amount={vaultConfig.config.initialLiquidity.amount}
									/>
								</span>
							</label>

							<label class="card column">
								<h4>{$_('Deadline')}</h4>
								<p>{$_('The deadline.')}</p>
								<span>
									<TimeSelect bind:value={vaultConfig.config.deadline} />
								</span>
							</label>
						</div>

					{:else if vaultConfig.type === VaultType.DAO}
						<div class="grid" in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
							<label class="card column">
								<h3>{$_('Governance Type')}</h3>
								<div>
									<Select
										bind:value={vaultConfig.config.governanceType}
										values={Object.keys(GovernanceType)}
										labels={Object.fromEntries(Object.entries(governanceTypeInfo).map(([key, {label}]) => [key, label]))}
									/>
								</div>
								{#if vaultConfig.config.governanceType}
									<p>{$_(governanceTypeInfo[vaultConfig.config.governanceType].description)}</p>
								{/if}
							</label>

							<!-- Quadratic
							Proportional -->
						</div>

					{:else if vaultConfig.type === VaultType.Charity}
						<div class="grid" in:fly={{ x: 50 }} out:fly={{ x: -50 }}>
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
				</div>
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

			<button type="submit" class="large" disabled={!isValid}>{$_('Create DAO')}</button>
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
	}
	form > section {
		margin: auto;
		/* min-width: min(30rem, 90vw); */
		width: 100%;
		/* max-height: calc(100vh - var(--header-height) - 2rem); */

		--grid-gap: 1rem;
	}

	.row {
		align-items: start;
	}

	.grid {
		display: grid;
		gap: var(--grid-gap);
		grid-template-columns: repeat(auto-fit, minmax(min(12rem, 50vw), 1fr));
	}

	form > section > .card {
		--grid-gap: 3rem;
	}

	/* .card {
		place-content: start;
		place-items: start;
	} */

	label p {
		font-size: 0.9em;
		/* opacity: 0.8; */
	}

	input[type="number"][max="100"] {
		max-width: 5em;
	}
</style>