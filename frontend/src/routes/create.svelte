<script lang="ts">
	import { _ } from 'svelte-i18n'


	enum YieldStrategy = {
		
	}


	let daoConfig: {
		name: string
		twitter: string
		discord: string
		name: string
	} = {
		name: '',
		twitter: '',
		discord: '',
		name: '',
	}
</script>


<main class="column">
	<section>
		<h1>{$_('Create a DAO')}</h1>
	</section>

	<section>
		<form class="">
			<label>
				<span>{$_('DAO Name')}</span>
				<input type="text" bind:value={daoConfig.name} />
			</label>

			<label>
				<span>{$_('Twitter')}</span>
				<input type="text" bind:value={daoConfig.twitter} />
			</label>

			<label>
				<span>{$_('Twitter')}</span>
				<input type="text" bind:value={daoConfig.discord} />
			</label>

			<label>
				<span>{$_('DAO Name')}</span>
				<input type="text" />
			</label>
			Input DAO Name
			- Input DAO socials etc.
			- Input ratios of Jackpot %, Dividend %, Treasury %.
		</form>
	</section>
</main>