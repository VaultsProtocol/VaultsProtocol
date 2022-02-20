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
	import { networks } from '$lib/networks'



	enum Steps {
		Idle,
		TransactionSigning,
		TransactionPending,
		TransactionFailed,
		TransactionSuccess
	}


	// Stores
	import { provider } from '../../../stores/provider'

	let vaultId
	$: ({ vaultId } = $page.params)


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
	import Vault from '../../components/Vault.svelte'
	import HeightContainer from '../../components/HeightContainer.svelte'
	import AddressInput from '../../components/AddressInput.svelte'
	import Select from '../../components/Select.svelte'
	import Tabs from '../../components/Tabs.svelte'
	import TokenSelect from '../../components/TokenSelect.svelte'
	import TokenAmountSelect from '../../components/TokenAmountSelect.svelte'
	import MultipleAddressInput from '../../components/MultipleAddressInput.svelte'
	import PercentInput from '../../components/PercentInput.svelte'
	import TimeSelect from '../../components/TimeSelect.svelte'


	import { fade, fly, scale } from 'svelte/transition'
import { page } from '$app/stores';
</script>


<main>
	<section>
		<h1>{$_('Manage Vault')}</h1>
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

			<div class="row centered">
				<button type="submit" class="extra-large round" disabled={!isValid}>{$_('Create DAO')}</button>
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

	.row {
		align-items: start;
	}

	.grid {
		display: grid;
		gap: var(--grid-gap);
		/* grid-template-columns: repeat(auto-fit, minmax(min(12rem, 50vw), 1fr)); */
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


button.dropdown {
		background: red;
	}

	label {
		transition: 0.2s;
	}
	label.card:focus-within {
		box-shadow: 0 1px 0.25rem var(--background-color-0);
		transform: translateY(-1px);
		transition: 0.5s;
	}

	label p {
		font-size: 0.9em;
		/* opacity: 0.8; */
	}

	input[type="number"][max="100"] {
		max-width: 5em;
	}
</style>