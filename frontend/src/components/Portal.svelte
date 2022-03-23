<script lang="ts">
	// External state
	export let target: HTMLElement = globalThis.document?.documentElement


	// Methods/hooks/lifecycle
	const portal = (el, target: HTMLElement) => {
		target?.appendChild(el)
		el.hidden = false

		return {
			update: (newTarget: HTMLElement) => {
				newTarget?.appendChild(el)
				el.hidden = false
			},
			destroy: () => {
				el.parentNode?.removeChild(el)
			}
		}
	}
</script>


<div class="portal" use:portal={target} hidden>
	<slot />
</div>


<style>
	.portal {
		display: contents;
	}
</style>