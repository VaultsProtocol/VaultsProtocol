<script lang="ts">
	// Constants/types
	type Value = $$Generic<string>

	import type { Placement } from '@floating-ui/core'


	// External state
	export let value: Value
	export let values: Value[]
	export let labels: Record<Value, string>

	export let placement: Placement

	export let id = `select-${Math.random() * 1e18}`


	// Components
	import Tooltip from './Tooltip.svelte'
	

	// Styles/animation
	import { scale } from 'svelte/transition'
</script>


<Tooltip let:isOpen {placement}>
	<button
		class="localization-picker dropdown"
		class:active={isOpen}
		{id}
		aria-haspopup="menu"
		aria-expanded={isOpen}
		tabindex="-1"
	>
		{labels[value] ?? value}
	</button>

	<div class="menu card column" slot="tooltip" role="menu" aria-labelledby={id} transition:scale={{ start: 0.8, opacity: 0, duration: 150 }}>
		{#each values as optionValue (optionValue)}
			<button class="transparent" class:active={value === optionValue} on:click={() => value = optionValue}>{labels[optionValue]}</button>
		{/each}
	</div>
</Tooltip>


<style>
	.menu {
		transform-origin: top center;
		min-width: 5rem;
	}

	.menu button {
		--button-active-background-color: var(--color-layer-base);
		text-align: left;
		justify-content: start;
	}
</style>