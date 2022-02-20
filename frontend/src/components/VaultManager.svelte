<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'
	import { VaultType, type VaultConfig, type VaultStatus, type VaultPosition } from '../lib/vaults'
	import { BigNumber } from 'ethers'

	enum ManagePositionMode {
		Add = 'Add',
		Remove = 'Remove'
	}


	// External state
	type T = $$Generic<VaultType>

	export let vaultConfig: VaultConfig<T>

	export let vaultStatus: VaultStatus

	export let vaultPosition: VaultPosition


	// Internal state
	let managePositionMode = ManagePositionMode.Add

	let balanceDelta = BigNumber.from(0)

	$: action =
		managePositionMode === ManagePositionMode.Add ?
			vaultPosition.balance.eq(0) ?
				'Deposit and Mint'
			:
				'Deposit'
		:
			vaultPosition.balance.sub(balanceDelta).eq(0) ?
				'Withdraw and Burn'
			:
				'Withdraw'


	// Methods/hooks/lifecycle
	const onSubmit = () => {
		
	}


	// Components
	import Tabs from '../components/Tabs.svelte'
	import TokenAmountSelect from './TokenAmountSelect.svelte'
	import TokenBalance from './TokenBalance.svelte'
	
	
	// Styles/animations
	import { scale } from 'svelte/transition'
</script>


<form class="card column manage-positions" on:submit={onSubmit}>
	<h2>Manage Position</h2>

	<hr>

	<Tabs
		bind:value={managePositionMode}
		values={Object.values(ManagePositionMode)}
		labels={{
			[ManagePositionMode.Add]: 'Add Position',
			[ManagePositionMode.Remove]: 'Remove Position',
		}}
	/>

	<div class="card column">
		<div class="token-amount">
			<TokenAmountSelect
				availableTokens={vaultConfig.tokens}
				bind:token={vaultConfig.tokens[0]}
				bind:amount={balanceDelta}
				min={0}
				max={managePositionMode === ManagePositionMode.Remove ? vaultPosition.balance : undefined}
			/>
		</div>

		<div class="balance-row row">
			<strong>Your Balance</strong>

			<div class="row">
				<output>
					<TokenBalance
						erc20Token={vaultConfig.tokens[0]}
						balance={vaultPosition.balance}
					/>
				</output>
				➔
				<output>
					<TokenBalance
						erc20Token={vaultConfig.tokens[0]}
						balance={
							managePositionMode === ManagePositionMode.Add ?
								vaultPosition.balance.add(balanceDelta)
							:
								vaultPosition.balance.sub(balanceDelta)
						}
					/>
				</output>
			</div>
		</div>
	</div>

	<div class="row centered">
		<div class="stack">
			{#key action}
				<button class="primary large" transition:scale>{$_(action)}</button>
			{/key}
		</div>
	</div>
</form>


<style>
	.manage-positions {
		max-width: 35rem;
		margin: 0 auto;
		padding: 30px;
		border: 20px solid #f3f3f3;
		box-shadow: 0px 5px 10px #ccc;
	}
	

	/* .balance-row {
		padding-bottom: 20px;
		width: 90%;
		margin: 0 auto;
	} */

	.token-amount {
		margin: calc(-1 * var(--card-scale-factor) * var(--card-padding));
		margin-right: 0;
		margin-bottom: 0;
	}

	.token-amount :global(input) {
		border-top-left-radius: calc(var(--card-scale-factor) * var(--card-radius));
		border-top-right-radius: calc(var(--card-scale-factor) * var(--card-radius));
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
		text-align: center;
		font-size: 2em;
		background: var(--background-color-f3)
	}
</style>
