<script lang="ts">
	// External State
	export let duration: string = ''
	export let clip = false
	export let isOpen = true
	export let renderOnlyWhenOpen = false
	export let transitionWidth = false
	export let transitionHeight = true


	// Internal state
	let container: HTMLElement
	let content: HTMLElement


	// Stores

	import { readable } from 'svelte/store'

	export let contentRect: SvelteStore<DOMRectReadOnly>

	$: contentRect = content && readable<DOMRectReadOnly>(content.getBoundingClientRect(), set => {
		const resizeObserver = new ResizeObserver(([observerEntry]) => {
			set(observerEntry.contentRect)
		})
		resizeObserver.observe(content)
		return () => resizeObserver.disconnect()
	})

	let previousContentRect, currentContentRect
	$: [previousContentRect, currentContentRect] = [currentContentRect, $contentRect]
	$: if(previousContentRect)
		// content?.animate({fontSize: [`${previousContentRect.width / currentContentRect.width}em`, '1em']}, {duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)'})
		content?.animate({transform: [`scaleX(${previousContentRect.width / currentContentRect.width})`, 'none']}, {duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)'})
</script>


<style>
	.container {
		will-change: height;
		transition: var(--duration, 0.6s) cubic-bezier(0.16, 1, 0.3, 1);
	}

	.container.clip {
		clip-path: inset(0);
	}
</style>


<div
	bind:this={container}
	class="container"
	class:clip={clip}
	style={[
		!isOpen && `margin-top: 0;`,
		transitionWidth && contentRect && `width: ${isOpen ? `${Math.max($contentRect.width, 0)}px` : '0'};`,
		transitionHeight && contentRect && `height: ${isOpen ? `${Math.max($contentRect.height, 0)}px` : '0'};`,
		duration && `--duration: ${duration};`
	].filter(Boolean).join(' ')}
>
	<div
		bind:this={content}
		{...$$props}
		style={transitionWidth ? `display: inline-block` : ''}
	>
		{#if renderOnlyWhenOpen ? isOpen : true}
			<slot />
		{/if}
	</div>
</div>