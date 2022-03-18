<script lang="ts">
	// External State
	export let duration: string = ''
	export let clip = false
	export let isOpen = true
	export let renderOnlyWhenOpen = false
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
		transitionHeight && `height: ${contentRect && isOpen ? `${Math.max($contentRect.height, 0)}px` : '0'};`,
		duration && `--duration: ${duration};`
	].filter(Boolean).join(' ')}
>
	<div bind:this={content} {...$$props}>
		{#if renderOnlyWhenOpen ? isOpen : true}
			<slot />
		{/if}
	</div>
</div>