<script lang="ts">
	// External state
	export let isOpen = false
	export let closeButton: boolean = true
	export let title: string
	export let cancelable: boolean = true
	export let width: string


	// Internal state
	let modal: HTMLElement


	// Methods/hooks/lifecycle
	import { createEventDispatcher, onDestroy } from 'svelte'

	const onKeydown = (event: KeyboardEvent | undefined) => {
		if(!isOpen) return

		event = event || (window.event as KeyboardEvent)

		if(event.key === 'Escape' || event.key === 'Esc' || (event as KeyboardEvent).keyCode === 27){
			close()
		}
		
		else if (event.key === 'Tab') {
			// Trap focus
			const tabbableElements = (Array.from(modal.querySelectorAll('*')) as HTMLElement[])
				.filter(element => element.tabIndex >= 0)

			let index = tabbableElements.indexOf(globalThis.document.activeElement as HTMLElement)
			if(index === -1 && event.shiftKey) index = 0

			const newIndex = (index + (event.shiftKey ? -1 : 1) + tabbableElements.length) % tabbableElements.length
			tabbableElements[newIndex].focus?.()

			event.preventDefault()
		}
	}

	const dispatch = createEventDispatcher()

	const close = () => {
		if(cancelable)
			dispatch('close')

		isOpen = false
	}

	onDestroy(() => {
		(globalThis.document?.activeElement as HTMLElement).focus?.()
	})


	// Styles/animation
	import { fade, scale } from 'svelte/transition';
</script>


<svelte:window on:keydown={onKeydown} />


{#if isOpen}
	<div class="modal-container" style="--modal-width: {width}">
		<div on:click={close} class="modal-overlay" transition:fade={{duration: 200}} />

		<div class="modal card column" bind:this={modal} transition:scale={{duration: 200}}>
			{#if title || closeButton}
				<div class="row modal-title">
					{#if title}
						<h3>{title}</h3>
					{/if}
					{#if closeButton}
						<div on:click={close} class="modal-close" role="button" tabIndex={0}>
							<svg width="18" height="18" viewBox="0 0 18 18">
								<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
							</svg>
						</div>
					{/if}
				</div>
			{/if}

			<div class="modal-content column">
				<slot {close} />
			</div>

			<!-- {#if $$slots.footer}
				<div class="footer">
					<slot name="footer" />
				</div>
			{/if} -->
		</div>
	</div>
{/if}


<style>
	.modal-container {
		display: flex;
		position: fixed;
		inset: 1rem;
		z-index: 1;
	}
	.modal-overlay {
		position: fixed;
		inset: 0;
		-webkit-backdrop-filter: blur(6px);
		backdrop-filter: blur(6px);
		z-index: -1;
	}
	.modal-overlay:before {
		position: fixed;
		inset: 0;
		content: '';
		background-color: var(--background-color-0);
		opacity: 0.75;
	}

	.modal {
		margin: auto;
		width: var(--modal-width);

		-webkit-backdrop-filter: var(--overlay-backdrop-filter);
		backdrop-filter: var(--overlay-backdrop-filter);
	}

	.modal-close {
		cursor: pointer;
		fill: currentColor;
	}

	.modal {
		background: var(--background-color-white)
	}

	.modal h3 {
		color: var(--font-color-black);
	}


	@media (max-width: 32rem) {
		.modal {
			margin-bottom: 0;
		}
	}
</style>