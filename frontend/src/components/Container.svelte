<script lang="ts">
	// External State
	export let isOpen = true
	export let renderOnlyWhenOpen = false

	export let transitionWidth = false
	export let transitionHeight = true

	export let duration = 600
	export let easing = 'cubic-bezier(0.16, 1, 0.3, 1)'

	export let clip = false


	// Internal state
	let container: HTMLElement
	let content: HTMLElement

	let contentRect: DOMRectReadOnly
	let previousRect: { width: number, height: number }
	let currentRect: { width: number, height: number }


	// Methods/hooks/lifecycle

	import { onMount } from 'svelte'

	onMount(() => {
		contentRect = content.getBoundingClientRect()

		const resizeObserver = new ResizeObserver(([observerEntry]) =>
			contentRect = observerEntry.contentRect
		)
		resizeObserver.observe(content)

		return () => resizeObserver.disconnect()
	})

	$: [previousRect, currentRect] = [currentRect, isOpen && contentRect || { width: 0, height: 0 }]

	$: if(transitionWidth)
		container?.animate(
			{
				transform: [
					`scaleX(${previousRect.width / currentRect.width}) perspective(50px) rotateX(180deg)`,
					'none'
				]
			},
			{
				duration,
				easing
			}
		)
</script>


<style>
	.container {
		will-change: width, height;
		transition: var(--duration, 600ms) var(--easing, cubic-bezier(0.16, 1, 0.3, 1));
	}
	.container.clip {
		clip-path: inset(0);
	}
	:global(.column) > .container:not(.isOpen) {
		margin-top: 0;
	}

	.container.transitionWidth .content {
		display: inline-block;
	}
</style>


<div
	bind:this={container}
	class="container"
	class:isOpen
	class:transitionWidth
	class:transitionHeight
	class:clip
	style={[
		duration && `--duration: ${duration}ms;`,
		easing && `--easing: ${easing};`,
		transitionWidth && currentRect && `width: ${currentRect.width}px;`,
		transitionHeight && currentRect && `height: ${currentRect.height}px;`,
	].filter(Boolean).join(' ')}
>
	<div
		bind:this={content}
		class="content"
		{...$$props}
	>
		{#if renderOnlyWhenOpen ? isOpen : true}
			<slot />
		{/if}
	</div>
</div>