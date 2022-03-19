<script context="module">
	let x = 0
</script>


<script lang="ts">
	// Constants/types
	type Value = $$Generic<string | any>

	import type { Placement } from '@floating-ui/core'


	// External state
	export let value: Value
	export let values: Value[]

	export let labels: Record<Value, string>
	export let getLabel: (Value) => string = value => labels?.[value] ?? value
	export let icons: Record<Value, string>
	export let getIcon: (Value) => string = value => icons?.[value]
	export let colors: Record<Value, string>
	export let getColor: (Value) => string = value => colors?.[value]

	export let placeholderLabel: string = 'Choose...'

	export let placement: Placement

	export let autoFallback = false
	export let required = false


	// Internal state
	export let isOpen: boolean

	const id = `select-${x++}`


	// Methods/hooks/lifecycle
	$: if(autoFallback && values && !values?.includes(value))
		value = values[0]
	// $: if(values && !values?.includes(value))
	// 	value = values[0]
		// value = undefined


	// Components
	import Container from './Container.svelte'
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
		<slot {value} label={getLabel(value) ?? value}>
			{#if value && getIcon(value)}
				<img src={getIcon(value)} />
			{/if}

			<Container transitionWidth>
				{value
					? getLabel(value)
					: placeholderLabel}
			</Container>
		</slot>
	</button>

	<div class="menu card column" slot="tooltip" role="menu" aria-labelledby={id} transition:scale={{ start: 0.8, opacity: 0, duration: 150 }}>
		{#each values as optionValue (optionValue)}
			<button
				type="button"
				class="transparent"
				class:active={value === optionValue}
				autofocus={value === optionValue}
				on:click={() => {
					value = optionValue
					console.log(isOpen)
					isOpen = false
				}}
			>
				<slot value={optionValue} label={getLabel?.(optionValue) ?? labels?.[optionValue] ?? optionValue}>
					{#if getIcon?.(optionValue) ?? icons?.[optionValue]}
						<img src={getIcon?.(optionValue) ?? icons?.[optionValue]} />
					{/if}
					{getLabel?.(optionValue) ?? labels?.[optionValue] ?? optionValue}
				</slot>
			</button>
		{/each}
	</div>
</Tooltip>


<style>
	button {
		--button-active-background-color: var(--background-color-2);
		width: 100%;
	}

	.menu {
		transform-origin: top center;
		min-width: 5rem;
		overflow: auto;
		width: max-content;
		max-height: inherit;

		box-shadow: 0 1px 0.25rem var(--background-color-1);
	}

	.menu button {
		text-align: left;
		justify-content: start;
	}
</style>