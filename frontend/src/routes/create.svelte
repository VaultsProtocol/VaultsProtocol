<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'

	import { BigNumber, Contract } from 'ethers'

	enum Steps {
		Idle,
		TransactionSigning,
		TransactionPending,
		TransactionFailed,
		TransactionSuccess
	}

	enum YieldStrategy {
		GG = '🎰 GG', // 🦍🦧
		Degen = '🐸 Degen',
		Aave = '👻 Aave',
		Yearn = '🏦 Yearn',
	}

	type ERC20TokenAndAmount = {
		contractAddress: string
		amount: BigNumber
	}


	// Stores
	import { provider } from '../stores/provider'


	// Internal state

	let currentStep = Steps.Idle

	let daoConfig: {
		name: string
		description: string
		website: string
		twitter: string
		discord: string
		strategy: YieldStrategy
		allocation: {
			jackpot: number
			dividend: number
			treasury: number
		}
		initialLiquidity: ERC20TokenAndAmount
	} = {
		name: '',
		description: '',
		website: '',
		twitter: '',
		discord: '',
		strategy: YieldStrategy.GG,
		allocation: {
			jackpot: 20,
			dividend: 30,
			treasury: 50
		},
		initialLiquidity: {
			contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			amount: BigNumber.from(0)
		}
	}

	$: isValid =
		!!daoConfig.name &&
		!!daoConfig.name && daoConfig.name && daoConfig.name


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
		<h1>{$_('Create a DAO')}</h1>
	</section>

	<div class="column row-desktop">
		<section>
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
						<h3>{$_('DAO Name')}</h3>
						<p>{$_('The project or cause you\'re fundraising for.')}</p>
						<input
							type="text"
							bind:value={daoConfig.name}
							placeholder={$_('DAO Name')}
							required
						/>
					</label>

					<label class="column">
						<h3>{$_('Description')}</h3>
						<p>{$_('Tell your community what your goals are.')}</p>
						<textarea
							bind:value={daoConfig.description}
							placeholder={$_('Describe {name}...', { values: { name: daoConfig.name || 'your DAO' }})}
						/>
					</label>

					<label class="column">
						<h3>{$_('Website')}</h3>
						<input
							type="text"
							bind:value={daoConfig.website}
							placeholder={$_('mydao.example.com')}
						/>
					</label>

					<label class="column">
						<h3>{$_('Twitter')}</h3>
						<input
							type="text"
							bind:value={daoConfig.twitter}
							placeholder={$_('twitter.com/ETHDenver')}
						/>
					</label>

					<label class="column">
						<h3>{$_('Discord')}</h3>
						<input
							type="text"
							bind:value={daoConfig.discord}
							placeholder={$_('discord.gg/xyz')}
						/>
					</label>
				</section>

				<section class="card column">
					<h2>{$_('Treasury')}</h2>

					<hr>

					<label class="column">
						<h3>{$_('Yield Strategy')}</h3>
						<div>
							<Select
								bind:value={daoConfig.strategy}
								values={Object.keys(YieldStrategy)}
								labels={YieldStrategy}
							/>
						</div>
						<p>
							{$_({
								[YieldStrategy.GG]: 'The crowdfund ends if a contribution is not made after a set interval of time. The last person to contibute wins the Jackpot allocation.',
								[YieldStrategy.Degen]: '',
								[YieldStrategy.Aave]: '',
								[YieldStrategy.Yearn]: '',
							}[daoConfig.strategy])}
						</p>
					</label>

					<h3>{$_('Allocation')}</h3>
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
										bind:value={daoConfig.allocation.jackpot}
									/>
									%
								</span>
								<button
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
									bind:value={daoConfig.allocation.dividend}
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
									bind:value={daoConfig.allocation.treasury}
								/>
								%
							</span>
						</label>
					</div>
				</section>

				<button type="submit" class="large" disabled={!isValid}>{$_('Create DAO')}</button>
			</form>
		</section>
	</div>
</main>


<style>
	form, .card {
		justify-items: start;
	}

	input {
		font-size: 1.2em;
	}

	label p {
		font-size: 0.9em;
		opacity: 0.8;
	}

	input[type="number"][max="100"] {
		max-width: 5em;
	}
</style>