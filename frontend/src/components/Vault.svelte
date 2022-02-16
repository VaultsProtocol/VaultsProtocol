<script lang="ts">
	import { _ } from 'svelte-i18n'
	
	
	import { vaultTypeInfo, type VaultConfig } from '../lib/vaults'
	
	
	export let vaultConfig: VaultConfig


	import { scale } from 'svelte/transition'
</script>


<h2>{vaultConfig.about.name || $_('My Vault')}</h2>

{#if vaultConfig.about.description}
	<p transition:scale>{vaultConfig.about.description}</p>
{/if}

<div class="">
	<p>{$_(vaultTypeInfo[vaultConfig.type].label)}</p>
</div>

{#if vaultConfig.type === ''}
	<svg viewBox="0 0 64 64" class="pie">
		<circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: 75.3 100">
		</circle>
		<circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: 19.9 100; stroke: green; stroke-dashoffset: -75.3; animation-delay: 0.25s">
		</circle>
		<circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: 2.3 100; stroke: blue; stroke-dashoffset: -95.2; animation-delay: 0.5s">
		</circle>
		<circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: 1.4 100; stroke: orange; stroke-dashoffset: -97.5; animation-delay: 0.75s">
		</circle>
		<circle r="25%" cx="50%" cy="50%" style="stroke-dasharray: 1.1 100; stroke: red; stroke-dashoffset: -98.9; animation-delay: 1s">
		</circle>
	</svg>
{/if}
