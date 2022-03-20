<script lang="ts">
	// Constants/types
	import { _ } from 'svelte-i18n'
	import { type VaultType, type VaultConfig, type VaultStatus, type VaultPosition, vaultTypeInfo } from '../lib/vaults'
	import { BigNumber } from 'ethers'
	import { networksByChainID, vaultAssetsByNetwork } from '$lib/networks'

	enum ManagePositionMode {
		Add = 'Add',
		Remove = 'Remove'
	}


	// Stores
	import { account } from '../stores/account'


	// External state
	type T = $$Generic<VaultType>

	export let vaultConfig: VaultConfig<T>

	export let vaultStatus: VaultStatus

	export let vaultPosition: VaultPosition


	// Internal state
	const params = {
		managePositionMode: ManagePositionMode.Add,
		balanceDelta: BigNumber.from(0)
	}

	$: action =
		params.managePositionMode === ManagePositionMode.Add ?
			vaultPosition.balance.eq(0) ?
				'Deposit and Mint'
			:
				'Deposit'
		:
			vaultPosition.balance.sub(params.balanceDelta).eq(0) ?
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
	import TransactionFlow from './TransactionFlow.svelte'

	
	// Styles/animations
	import { scale } from 'svelte/transition'
</script>


<section class="card column manage-positions" on:submit={onSubmit}>
	<TransactionFlow
		account={$account}
		network={networksByChainID[vaultConfig.chainId]}

		createTransaction={async ({network, address, signer}) => {
			
		}}

		onTransactionSuccess={async tx => {
		
		}}
	>
		<svelte:fragment slot="idle" let:actions={{ next }}>
			<h2>Manage Position</h2>

			<hr>

			<Tabs
				bind:value={params.managePositionMode}
				values={Object.values(ManagePositionMode)}
				labels={{
					[ManagePositionMode.Add]: 'Add Position',
					[ManagePositionMode.Remove]: 'Remove Position',
				}}
			/>

			<div class="card column">
				<div class="token-amount">
					<TokenAmountSelect
						availableTokens={vaultConfig.tokens.length ? vaultConfig.tokens : vaultAssetsByNetwork[networksByChainID[vaultConfig.chainId]?.slug][0] ?? []}
						bind:token={vaultConfig.tokens[0]}
						bind:amount={params.balanceDelta}
						max={params.managePositionMode === ManagePositionMode.Remove ? vaultPosition.balance : undefined}
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
									params.managePositionMode === ManagePositionMode.Add ?
										vaultPosition.balance.add(params.balanceDelta)
									:
										vaultPosition.balance.sub(params.balanceDelta)
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
		</svelte:fragment>

		<!-- <svelte:fragment slot="confirming" let:actions={{ back }}> -->
		<svelte:fragment slot="confirming-message" let:network>
			{action}

			<TokenBalance
				erc20Token={vaultConfig.tokens[0]}
				balance={params.balanceDelta}
			/>

			{$_('to/from {vaultType} vault "{vaultName}" on {networkName}}!', {
				values: {
					vaultType: vaultTypeInfo[vaultConfig.type].label,
					vaultName: vaultConfig.about.name,
					networkName: network.name
				}
			})}
		</svelte:fragment>

		<svelte:fragment slot="pending-message" let:network>
			<div>
				{action}

				<TokenBalance
					erc20Token={vaultConfig.tokens[0]}
					balance={params.balanceDelta}
				/>

				{$_('to/from {vaultType} vault "{vaultName}" on {networkName}}!', {
					values: {
						vaultType: vaultTypeInfo[vaultConfig.type].label,
						vaultName: vaultConfig.about.name,
						networkName: network.name
					}
				})}
			</div>
		</svelte:fragment>

		<svelte:fragment slot="success-message" let:network>
			<div>
				{action}

				<TokenBalance
					erc20Token={vaultConfig.tokens[0]}
					balance={params.balanceDelta}
				/>

				{$_('to/from {vaultType} vault "{vaultName}" on {networkName}}!', {
					values: {
						vaultType: vaultTypeInfo[vaultConfig.type].label,
						vaultName: vaultConfig.about.name,
						networkName: network.name
					}
				})}
			</div>
		</svelte:fragment>
	</TransactionFlow>
</section>


<style>
	.manage-positions {
		max-width: 35rem;
		/* margin: 0 auto;
		padding: 30px;
		border: 20px solid #f3f3f3;
		box-shadow: 0px 5px 10px #ccc; */
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
		font-size: 1.5em;
	}
</style>
