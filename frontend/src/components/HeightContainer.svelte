<script lang="ts">
	// External State
	export let duration: string = ''
	export let clip = false
	export let isOpen = true


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


	// Methods/hooks/lifecycle

	$: if(container && contentRect)
		container.style.height = isOpen ? `${Math.max($contentRect.height, 0)}px` : '0'
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


<div class="container" bind:this={container} style={duration ? `--duration: ${duration}` : ''} class:clip>
	<div bind:this={content} {...$$props}>
		<slot />
	</div>
</div>