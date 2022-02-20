<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'

	import { BigNumber, Contract } from 'ethers'

	import { networks, type ChainID } from '$lib/networks'

	enum FundingStrategy {
		ApeChicken = 'ApeChicken',
		OrangutanChicken = 'OrangutanChicken',
		ManateeChicken = 'ManateeChicken',
		Degen = 'Degen',
	}
	const fundingStrategyInfo = {
		[FundingStrategy.ApeChicken]: {
			label: '🦍 Ape Chicken', // 🦍🦧
			description: 'The game ends if a contribution is not made after a set interval of time. The last person to contribute wins the Jackpot allocation.'
		},
		[FundingStrategy.OrangutanChicken]: {
			label: '🦧 Orangutan Chicken',
			description: 'The crowdfund ends if a contribution is not made after a set interval of time. The last person to contribute wins the Jackpot allocation.'
		},
		[FundingStrategy.ManateeChicken]: {
			label: '🦈 Manatee Chicken',
			description: 'Stream Superfluid Super tokens into the vault at a specified rate. Dividends are streamed to all past contributors'
		},
		[FundingStrategy.Degen]: {
			label: '🐸 Degen',
			description: ''
		}
	}

	enum YieldStrategy {
		Aave = 'Aave',
		Yearn = 'Yearn',
	}
	const yieldStrategyInfo = {
		[YieldStrategy.Aave]: {
			label: '👻 Aave',
			description: 'The DAO treasury will be lent to borrowers on Aave. Interest will be paid out to holders.'
		},
		[YieldStrategy.Yearn]: {
			label: '🏦 Yearn',
			description: 'The DAO treasury will be deposited into a Yearn vault. Yield will be paid out to holders.'
		},
	}

	enum GovernanceStrategy {
		None = 'None',
		Vote = 'Vote',
	}
	const governanceStrategyInfo = {
		[GovernanceStrategy.None]: {
			label: '🚫 None',
			description: 'Stakeholders can withdraw their share from the vault at any time.'
		},
		[GovernanceStrategy.Vote]: {
			label: '🗳 Vote',
			description: 'Stakeholders must vote to approve changes to yield strategies or send funds out of the vault.'
		},
	}

	type ERC20TokenAndAmount = {
		contractAddress: string
		amount: BigNumber
	}

	type VaultConfig = {
		about: {
			name: string
			description: string
			website: string
			twitter: string
			discord: string
		},
		chainId: ChainID,
		fundingStrategy: FundingStrategy
		fundingAllocation: {
			jackpot: number
			dividend: number
			treasury: number
		}
		yieldStrategy: YieldStrategy
		governanceStrategy: GovernanceStrategy
		initialLiquidity: ERC20TokenAndAmount
	}

	const getDefaultVaultConfig = () => ({
		about: {
			name: '',
			description: '',
			website: '',
			twitter: '',
			discord: '',
		},
		chainId: 1,
		fundingStrategy: FundingStrategy.ApeChicken,
		fundingAllocation: {
			jackpot: 20,
			dividend: 30,
			treasury: 50
		},
		yieldStrategy: YieldStrategy.Aave,
		governanceStrategy: GovernanceStrategy.None,
		initialLiquidity: {
			contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			amount: BigNumber.from(0)
		}
	} as VaultConfig)

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
	import Select from '../components/Select.svelte'
</script>


<main>
	<section>
		<h1>{$_('Create a Vault')}</h1>
	</section>

	<section>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<form
			class="column"
			on:submit|preventDefault={() => currentStep = Steps.TransactionSigning}
			disabled={currentStep !== Steps.Idle}
		>
			<section class="card column">
				<h2>{$_('Network')}</h2>

				<hr>

				<label class="column">
					<h3>{$_('Chain')}</h3>
					<div>
						<Select
							bind:value={vaultConfig.chainId}
							values={networks.map(({ chainId }) => String(chainId))}
							labels={Object.fromEntries(networks.map(({ chainId, name }) => [chainId, name]))}
						/>
					</div>
			</section>

			<section class="card column">
				<h2>{$_('Funding')}</h2>

				<hr>

				<label class="column">
					<h3>{$_('Fundraising Type')}</h3>
					<div>
						<Select
							bind:value={vaultConfig.fundingStrategy}
							values={Object.keys(FundingStrategy)}
							labels={Object.fromEntries(Object.entries(fundingStrategyInfo).map(([key, {label}]) => [key, label]))}
						/>
					</div>
					<p>{$_(fundingStrategyInfo[vaultConfig.fundingStrategy].description)}</p>
				</label>

				<h3>{$_('Allocation')}</h3>

				{#if vaultConfig.fundingStrategy === FundingStrategy.ApeChicken}
					<div class="card column">
						<label class="column">
							<h4>{$_('Jackpot')}</h4>
							<p>{$_('This portion is paid out to the last contributor when the crowdfund ends.')}</p>
							<div class="row">
								<span>
									<input
										type="number"
										min="0"
										max="100"
										bind:value={vaultConfig.fundingAllocation.jackpot}
									/>
									%
								</span>
								<button
									type="button"
									class="small"
								>
									{$_('Remaining')}
								</button>
							</div>
						</label>

						<label class="column">
							<h4>{$_('Dividend')}</h4>
							<p>{$_('This amount is distributed to all past contributors every time a new contribution is made.')}</p>
							<span>
								<input
									type="number"
									min="0"
									max="100"
									bind:value={vaultConfig.fundingAllocation.dividend}
								/>
								%
							</span>
						</label>

						<label class="column">
							<h4>{$_('Treasury')}</h4>
							<p>{$_('After the jackpot winner and the dividends are paid out, the remaining funds go to the DAO treasury.')}</p>
							<span>
								<input
									type="number"
									min="0"
									max="100"
									bind:value={vaultConfig.fundingAllocation.treasury}
								/>
								%
							</span>
						</label>
					</div>
				{/if}
			</section>

			<section class="card column">
				<h2>{$_('Treasury')}</h2>

				<hr>

				<label class="column">
					<div class="row">
						<h3>{$_('Yield Strategy')}</h3>
						<div>
							<Select
								bind:value={vaultConfig.yieldStrategy}
								values={Object.keys(YieldStrategy)}
								labels={Object.fromEntries(Object.entries(yieldStrategyInfo).map(([key, {label}]) => [key, label]))}
							/>
						</div>
					</div>
				</label>

				<!-- <div class="row">
					<p>{$_(yieldStrategyInfo[vaultConfig.yieldStrategy].description)}</p>
				</div> -->
			</section>

			<section class="card column">
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
			</section>

			<section class="card column">
				<h2>{$_('About')}</h2>

				<hr>

				<label class="column">
					<h3>{$_('DAO Name')}</h3>
					<p>{$_('The project or cause you\'re fundraising for.')}</p>
					<input
						type="text"
						bind:value={vaultConfig.about.name}
						placeholder={$_('DAO Name')}
						required
					/>
				</label>

				<label class="column">
					<h3>{$_('Description')}</h3>
					<p>{$_('Tell your community what your goals are.')}</p>
					<textarea
						bind:value={vaultConfig.about.description}
						placeholder={$_('Describe {name}...', { values: { name: vaultConfig.about.name || 'your Vault' }})}
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
			</section>

			<button type="submit" class="large" disabled={!isValid}>{$_('Create DAO')}</button>
		</form>
	</section>
</main>


<style>
	form, .card {
		place-content: start;
    	place-items: start;
	}

	input {
		font-size: 1.2em;
	}

	label p {
		font-size: 0.9em;
		/* opacity: 0.8; */
	}

	input[type="number"][max="100"] {
		max-width: 5em;
	}

</style>