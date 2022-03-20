<script lang="ts">
	// Global styles
	import '../styles/app.css'


	// Globals/polyfills
	// import { Buffer } from 'buffer'
	// console.log('Buffer', Buffer)
	// globalThis.Buffer = Buffer
	// console.log('buffer', Buffer)


	// App initialization
	import '../lib/i18n'


	// Stores
	import { page } from '$app/stores'
	import { isLoading, _ } from 'svelte-i18n'


	// Images
	import projectLogo from '../assets/project-logo.png'
	import previewImage from '../assets/project-preview.png'
	import { networkIcons } from '$lib/networks'


	// Components
	import Header from '../components/Header.svelte'
	import { scale, fly } from 'svelte/transition'
</script>


<svelte:head>
	{#if !$isLoading}
		<title>{$_('PROJECT_NAME')}</title>
		<meta property="og:title" content={$_('PROJECT_NAME')} />

		<meta name="description" content={$_('PROJECT_DESCRIPTION')} />
		<meta property="og:description" content={$_('PROJECT_DESCRIPTION')} />
	{/if}

	<meta property="og:image" content={previewImage} />
</svelte:head>


<div class="top">
	{#if $isLoading}
		<div class="loading column centered" transition:scale>
			<img src={networkIcons[1]} width="200" />
			<h3>Loading...</h3>
		</div>
	{:else}
		<Header />

		<div class="page stack">
			<!-- {#key $page} -->
				<main in:fly={{ x: 100 }} out:fly={{ x: -100 }}>
					<slot />
				</main>
			<!-- {/key} -->
		</div>
	{/if}
</div>


<style>
	.top {
		display: grid;
		min-height: 100vh;
		grid-template:
			'Header' var(--header-height)
			'Main' 1fr
			/ 100%;
	}

	.stack {
		transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.top > :global(header) {
		grid-area: Header;
		background: var(--background-color-white);
		
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.page {
		grid-area: 1 / 1 / -1 / span 1;

		display: grid;
		width: 100%;
		max-width: var(--content-max-width);
		margin: 0 auto;

		padding-top: var(--header-height);
		scroll-margin-top: var(--header-height);

		align-content: start;
		gap: 1em;
	}

	:global(main > section) {
		padding: var(--section-padding);
		gap: 1em;
		max-width: 100vw;
	}


	.loading {
		height: calc(100vh - var(--header-height));
		animation: Loading 1s infinite ease-in-out;
		gap: 3rem;
	}
	@keyframes Loading {
		from, to {
			transform: rotate(-1deg);
		}
		50% {
			transform: rotate(1deg);
		}
	}

</style>
