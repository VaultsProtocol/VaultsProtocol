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


	// Components
	import Tabs from '../components/Tabs.svelte'
	import TokenAmountSelect from './TokenAmountSelect.svelte'
	import TokenBalance from './TokenBalance.svelte'
	
	
	// Styles/animations
	import { scale } from 'svelte/transition'
</script>


<div class="card column manage-positions">
<h2>Manage Position</h2>
	<Tabs
		bind:value={managePositionMode}
		values={Object.values(ManagePositionMode)}
		labels={{
			[ManagePositionMode.Add]: 'Add Position',
			[ManagePositionMode.Remove]: 'Remove Position',
		}}
	/>

	<div class="card column token-amount">
		<TokenAmountSelect
			availableTokens={vaultConfig.token}
			bind:token={vaultConfig.tokens[0]}
			bind:amount={balanceDelta}
			min={0}
			max={managePositionMode === ManagePositionMode.Remove ? vaultPosition.balance : undefined}
		/>

		<div class="row balance-row">
			<h3>Your Balance</h3>

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
		<div class="stack align-end">
			{#key action}
				<button class="primary large" transition:scale>{$_(action)}</button>
			{/key}
		</div>
	</div>
</div>

<style>
	.manage-positions {
		/* background: red; */
		max-width: 500px;
		margin: 0 auto;
		padding: 30px;
		border: 20px solid #f3f3f3;
		box-shadow: 0px 5px 10px  #ccc;
	}
	

	.balance-row {
		padding-bottom: 20px;
		width: 90%;
		margin: 0 auto;
	}

	.token-amount h3 {
		font-size: 12px;
	}
</style>