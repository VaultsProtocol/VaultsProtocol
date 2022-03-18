<script lang="ts">
	// Constants/types
	import type { Network } from '@ethersproject/providers'
	import type { ConnectedAccount } from '../stores/account'
	import type { Transaction } from 'ethers'

	import { _ } from 'svelte-i18n'

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


	// External state
	export let network: Network
	export let account: ConnectedAccount

	export let createTransaction: ({
		network: Network,
		address: string,
		signer: Signer
	}) => Promise<Transaction>

	// export let confirmationMessage
	export let onTransactionSuccess


	// Internal state

	let currentStep = Steps.Idle

	let formElement: HTMLFormElement

	$: isValid =
		// !!vaultConfig.about.name &&
		// !!vaultConfig.type &&
		formElement?.valid
		// formElement && [...formElement.elements].every(fieldElement => !fieldElement.required || !fieldElement.isEmpty)

	let tx: Transaction
	let errorMessage: string

	
	// Methods/hooks/lifecycle

	const actions = {
		back: () => currentStep--,
		next: () => currentStep++,
		restart: () => currentStep = Steps.Confirming,
		cancel: () => currentStep = Steps.Idle
	}

	$: if(account && currentStep === Steps.TransactionSigning)(async () => {
		const { address, signer } = account

		console.log('signer', signer)

		try {
			tx = await createTransaction({
				network,
				address,
				signer
			})
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
			return
		}

		currentStep = Steps.TransactionSuccess

		onTransactionSuccess?.(tx)
		// if(onTransactionSuccess)
		// 	try {
		// 		await onTransactionSuccess(tx)
		// 	}catch(e){
		// 		errorMessage = e.message
		// 		currentStep = Steps.TransactionFailed
		// 		return
		// 	}
	})()

	$: if(errorMessage)
		console.error(errorMessage)


	// Formatting
	import { formatAddress } from '$lib/formatAddress'


	// Styles/animation
	import { fly, scale } from 'svelte/transition'
</script>


<div class="stack align-top">
	{#if currentStep === Steps.Idle}
		<form
			bind:this={formElement}
			class="column"
			on:submit|preventDefault={actions.next}
			disabled={currentStep !== Steps.Idle}
			transition:fly={{ x: -100 }}
		>
			<slot
				name="idle"
				{actions}
			/>
		</form>
	{:else if currentStep === Steps.Confirming}
		<form
			class="card column centered"
			on:submit|preventDefault={actions.next}
			transition:fly={{ x: -100 }}
		>
			<slot
				name="confirming"
				{actions}
			>
				<h2>{$_('Ready to deploy')}</h2>

				<!-- <p><slot name="confirming-message" {network}>{confirmationMessage({ network })}</slot></p> -->
				<p><slot name="confirming-message" {network} /></p>

				<div class="row centered">
					<div class="stack">
						{#if !account}
							<button class="large round primary" disabled>{$_('Connect Wallet')}</button>
						{:else}
							<button type="submit" class="large round primary">{$_('Sign Transaction')}</button>
						{/if}
					</div>
					<button type="button" class="large round" on:click={actions.back}>{$_('Go Back')}</button>
				</div>
			</slot>
		</form>
	{:else if currentStep === Steps.TransactionSigning}
		<div
			class="card column centered"
			transition:scale
		>
			<img src={walletsByType[account.walletConnection.walletType].icon} width="100" />

			<slot
				name="signing"
				{actions}
			>
				<h2>{$_('Sign Transaction')}</h2>

				<p>{$_('Sign the transaction with {walletName} ({address}).', {
					values: {
						walletName: walletsByType[account.walletConnection.walletType].name,
						address: formatAddress(account.address)
					}
				})}</p>
			</slot>

			<button type="button" class="large round" on:click={actions.back}>{$_('Go Back')}</button>
		</div>
	{:else if currentStep === Steps.TransactionPending}
		<div
			class="card column centered"
			transition:scale
		>
			<slot
				name="pending"
				{actions}
			>
				<h2>{$_('Waiting...')}</h2>

				<p><slot name="pending-message" {network} /></p>
			</slot>
		</div>
	{:else if currentStep === Steps.TransactionFailed || currentStep === Steps.TransactionReverted}
		<div
			class="card column centered"
			transition:scale
		>
			<h2>{$_('Transaction Failed')}</h2>

			<output>{errorMessage}</output>

			<div class="row centered">
				<button class="large round primary" on:click={actions.restart}>{$_('Try Again')}</button>
				<button class="large round" on:click={actions.cancel}>{$_('Cancel')}</button>
			</div>
		</div>
	{:else if currentStep === Steps.TransactionSuccess}
		<div
			class="card column centered"
			transition:scale
			>
			<slot
				name="success"
				{actions}
			>
				<h2>{$_('Success!')}</h2>

				<p><slot name="success-message" {network} /></p>
			</slot>
		</div>
	{/if}
</div>


<!-- {#if currentStep !== Steps.Idle}
	<Portal>
		<Modal>
			{errorMessage}
		</Modal>
	</Portal>
{/if} -->


<style>
	form {
		/* grid-auto-rows: calc(100vh - var(--header-height) - 50vh); */

		scroll-snap-align: center;

		/* margin-bottom: 33vh; */
		margin-bottom: 10vh;
	}
	form > :global(section) {
		margin: auto;
		/* min-width: min(30rem, 90vw); */
		width: 100%;
		/* max-height: calc(100vh - var(--header-height) - 2rem); */

		--grid-gap: 1rem;
	}

	
	/* .card {
		place-content: start;
		place-items: start;
	} */
</style>
