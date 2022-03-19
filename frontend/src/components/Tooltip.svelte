<script lang="ts">
	import type { Placement } from '@floating-ui/core'


	// External state
	export let placement: Placement = 'bottom-end'
	export let allowedPlacements: Placement[] | undefined
	export let offset = 8


	// Internal state

	let containerElement
	let referenceElement
	let tooltipElement

	export let isOpen


	// Methods/hooks/lifecycle

	import { computePosition, flip, autoPlacement, offset as offset_, shift, size, getScrollParents } from '@floating-ui/dom'

	$: if(referenceElement && tooltipElement){
		for(const eventTarget of [globalThis.window, ...getScrollParents(referenceElement), ...getScrollParents(referenceElement)] as EventTarget[]){
			eventTarget.addEventListener('scroll', () => requestAnimationFrame(update));
			eventTarget.addEventListener('resize', () => requestAnimationFrame(update));
		}
	}

	$: if(isOpen && referenceElement && tooltipElement)
		update()
	
	const update = () => {
		if(isOpen && referenceElement && tooltipElement)
			globalThis.requestAnimationFrame(() =>
				computePosition(referenceElement, tooltipElement, {
					placement,
					middleware: [
						allowedPlacements
							? autoPlacement({
								allowedPlacements
							})
							: flip(),
						offset_(offset),
						shift({
							padding: 16
						}),
						size({
							boundary: globalThis.document.body,
							padding: 8,
							apply(a){
								const { width, height } = a
								Object.assign(tooltipElement.style, {
									maxWidth: `${width}px`,
									maxHeight: `${height}px`,
								})
							}
						})
					],
				}).then(({ x, y }) => {
					Object.assign(tooltipElement.style, {
						left: `${x}px`,
						top: `${y}px`,
					})
				})
			)
	}
	$: if(!isOpen && containerElement?.matches(':focus-within'))
		referenceElement?.focus()
</script>


<svelte:body on:click={e => {
	if(!containerElement.contains(e.target))
		isOpen = false
}} />


<details bind:open={isOpen} bind:this={containerElement} on:blur={() => isOpen = false}>
	<summary bind:this={referenceElement}>
		<slot {isOpen} />
	</summary>

	<div class="tooltip" bind:this={tooltipElement}>
		{#if isOpen}
			<slot name="tooltip" />
		{/if}
	</div>
</details>


<style>
	details {
		width: 100%;
	}

	details[open] {
		position: relative;
		z-index: 1;
		transform: translateZ(1px);
		will-change: transform;
	}

	.tooltip {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		transform: translateZ(1px);
		width: max-content;
	}

	.tooltip  {
		font-size: 18px;
	}
	summary {
		cursor: pointer;
	}

	summary :global(button:active) {
		pointer-events: none;
	}
</style>