<script lang="ts">
	// Constants/types
	type Value = $$Generic<string | any>

	import type { Placement } from '@floating-ui/core'


	// External state
	export let value: Value
	export let values: Value[]
	export let labels: Record<Value, string>

	export let placeholderLabel: string = 'Choose...'

	export let placement: Placement

	export let id = `select-${Math.random() * 1e18}`


	// Internal state
	export let isOpen: boolean


	// Components
	import Tooltip from './Tooltip.svelte'
	

	// Styles/animation
	import { scale } from 'svelte/transition'
</script>


<Tooltip bind:isOpen {placement}>
	<button
	type="button"
	class="localization-picker dropdown"
	class:active={isOpen}
	{id}
	aria-haspopup="menu"
	aria-expanded={isOpen}
	tabindex="-1"
>
	<slot {value}>
		{value
			? labels[value] ?? value
			: placeholderLabel}
	</slot>
</button>

	<div class="menu card column" slot="tooltip" role="menu" aria-labelledby={id} transition:scale={{ start: 0.8, opacity: 0, duration: 150 }}>
		{#each values as optionValue (optionValue)}
			<button
				type="button"
				class="transparent"
				class:active={value === optionValue}
				on:click={() => {
					value = optionValue
					console.log(isOpen)
					isOpen = false
				}}
			>
				<slot value={optionValue}>
					{labels[optionValue]}
				</slot>
			</button>
		{/each}
	</div>
</Tooltip>


<style>
	button {
		width: 100%;
	}

	.menu {
		transform-origin: top center;
		min-width: 5rem;
		overflow: auto;
		max-height: inherit;

		box-shadow: 0 1px 0.25rem var(--background-color-1);
	}

	.card.menu {
		/* background: pink; */
	}

	.menu button {
		--button-active-background-color: var(--color-layer-base);

		--button-active-background-color: var(--background-color-white);
		text-align: left;
		justify-content: start;
	}
</style>