<script context="module">
	export const ssr = false
</script>


<script lang="ts">
	// Constants/types
	import { wallets, walletsByType } from '../lib/wallets'

	import { _ } from 'svelte-i18n'

	enum State {
		Disconnected = 'Disconnected',
		Connecting = 'Connecting',
		Connected = 'Connected'
	}


	// Stores
	import { account } from '../stores/account'

	import type { WalletType } from '../lib/wallets'
	import { localStorageWritable } from '../stores/localStorage'

	const connectedWalletType = localStorageWritable<WalletType | undefined>('connectedWalletType', undefined)


	// External state
	export let state = State.Disconnected


	// Internal state
	let modalIsOpen = false

	let connectingWalletType: WalletType


	// Methods/hooks/lifecycle
	import { connectWallet, disconnectWallet } from '../lib/wallets'

	const onConnectWallet = async (type: WalletType) => {
		connectingWalletType = type
		modalIsOpen = false

		try {
			const {
				signer,
				chainId,
				accounts,
				onAccountChanged,
				onChainIdChanged
			} = await connectWallet({
				walletType: connectingWalletType
			})

			console.log('accounts', accounts)

			const address = accounts[0]

			$account = { signer, address }

			// $provider.resolveEnsName(address).then(async ensName => {
			// 	$account = { ...$account, ensName }

			// 	const ensAvatarUri = await contractClient.resolveEnsAvatar(ensName)
			// 	$account = { ...$account, ensAvatarUri }
			// })

			onAccountChanged(accounts => {
				const address = accounts[0]
				$account = { ...$account, address }
			})

			$connectedWalletType = type
			modalIsOpen = false
		}catch(e){
			console.error(e)

			$connectedWalletType = undefined
			await onDisconnectWallet()

			modalIsOpen = true
		}

		connectingWalletType = undefined
	}

	const onDisconnectWallet = async () => {
		$connectedWalletType = undefined
		$account = undefined
		disconnectWallet({walletType: connectedWalletType})
	}

	if($connectedWalletType)
		onConnectWallet($connectedWalletType)


	// Formatting
	import { formatAddress } from '$lib/formatAddress'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'


	// Components
	import Portal from './Portal.svelte'
	import Modal from './Modal.svelte'
	import Tooltip from './Tooltip.svelte'
	

	// Styles/animation
	import { scale } from 'svelte/transition'
</script>


<div class="stack">
	{#key $account}
		{#if !$account}
			<button class="primary" on:click={() => modalIsOpen = !modalIsOpen} transition:scale={{opacity: 0}}>{$_('Connect')}</button>
		{:else}
			<Tooltip let:isOpen placement="bottom-end">
				<button class="connnected-account dropdown" class:active={isOpen} tabindex="-1" transition:scale={{opacity: 0}}>
					<picture class="avatar">
						{#if $account.ensAvatarUri}
							<img src={$account.ensAvatarUri} />
						{:else}
							<img class="wallet-icon" src={walletsByType[$connectedWalletType].icon} />
						{/if}
					</picture>

					<span class="column">
						<!-- {#if $account.ensName}
							<span class="ens">{$account.ensName}</span>
						{:else}
							<span>{formatAddress($account.address)}</span>
						{/if}
						<span>{walletsByType[$connectedWalletType].name($_)}</span> -->

						{#if $account.ensName}
							<span class="ens">{$account.ensName}</span>
						{/if}
						{#if $account.address}
							<span>{formatAddress($account.address)}</span>
						{:else}
							<span class="locked">{$_('[Locked]')}</span>
						{/if}
						{#if !$account.ensName}
							<span>{walletsByType[$connectedWalletType].name($_)}</span>
						{/if}
					</span>
				</button>

				<!-- <div class="menu card column" slot="tooltip"> -->
				<div class="menu card column" slot="tooltip" transition:scale={{ start: 0.8, opacity: 0, duration: 150 }}>
					{#if $account.address}
						<button class="transparent" on:click={() => navigator.clipboard.writeText($account.address)}>{$_('Copy address')}</button>
					{/if}
					<button class="transparent" on:click={() => modalIsOpen = !modalIsOpen}>{$_('Switch wallet')}</button>
					<button class="transparent destructive" on:click={() => onDisconnectWallet()}>{$_('Disconnect')}</button>
				</div>
			</Tooltip>
		{/if}
	{/key}
</div>


<Portal>
	<Modal
		bind:isOpen={modalIsOpen}
		closeButton
		width="26rem"
		title={$_('Sign in with Web3')}
	>
		<!-- <div class="card"> -->
			<div class="wallets">
				{#each wallets as {type, name, icon}}
					<button class="wallet large" on:click={() => onConnectWallet(type)}>
					<!-- <button class="wallet column centered" on:click={() => onConnectWallet(type)}> -->
						<img src={icon} alt={name($_)} />
						{name($_)}
					</button>
				{/each}
			</div>
		<!-- </div> -->
	</Modal>
</Portal>


<style>
	.stack {
		place-items: center end;
		--button-transform-origin: right;
	}


	.avatar {
		width: 2.5rem;
		height: 2.5rem;
		aspect-ratio: 1;

		border-radius: calc(var(--radius) * 0.85);
		border-radius: 120px;
		border: 1px solid #ccc;
		overflow: hidden;

		background-color: var(--background-color-4);
	}
	.avatar .wallet-icon {
		margin: 0.55rem;
	}

	.connnected-account {
		--button-color: var(--background-color-3);
		--button-color: white;
		border: 1px solid #ccc;
		padding: 0.5em;
		padding: 5px 20px;
		padding-left: 5px;
		text-align: left;
		border-radius: 120px;

		max-width: calc(100vw - 19.5rem);
	}
	.connnected-account > .column {
		gap: 0.33em;
	}
	.connnected-account > .column > * {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.connnected-account > .column > :first-child {
		color: var(--color-text-light);
		color: #343434;
		font-weight: 600;
	}
	.connnected-account > .column > :nth-child(2) {
		color: var(--font-color-bl34);
		font-weight: 200;
		font-size: 0.75em;
		letter-spacing: 0.5px;
	}
	.connnected-account.dropdown:after {
		width: 2ch;
	}

	.connnected-account.active {
		background: #f3f3f3;
	}


	.wallets {
		--grid-gap: 0.66rem;

		display: flex;
		flex-wrap: wrap;
		margin: calc(-0.5 * var(--grid-gap));
	}
	.wallet {
		flex: 1 0 auto;
		flex: 1 8rem;
		margin: calc(0.5 * var(--grid-gap));
	}
	.wallet img {
		border-radius: 0.1rem;
		width: 1rem;
		height: 1rem;
	}
</style>
