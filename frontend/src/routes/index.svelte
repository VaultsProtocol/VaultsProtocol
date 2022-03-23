<script>
	import { _ } from 'svelte-i18n'


	// Images
	import logo from '../assets/Vaults-Protocol.svg'
</script>


<svelte:head>
	<title>{$_('PROJECT_NAME')}</title>
</svelte:head>


<section id="top" class="column centered">
	<img src={logo} alt={$_('Vaults Protocol')} />

	<h1>{$_('Vaults Protocol')}</h1>
	<h2>Launch a vault. Earn yield.<br>Manage your positions with NFTs.</h2>

	<div class="row">
		<a href="/create"><button class="primary large round">{$_('Create a Vault')}</button></a>
		<a href="/browse"><button class="large round">{$_('Browse Vaults')}</button></a>
	</div>
</section>

<section>
	<div class="card column">
		<h2>About</h2>
		<hr>
		<p>
			<strong>Vaults</strong> is a DeFi/NFT-based smart contract protocol for launching
			<strong>customizable, yield-bearing token vaults</strong>.
		</p>
		<p>
			Configure a vault with an <strong>ERC-20 token</strong>, <strong>yield strategy</strong> and <strong>customized rules</strong>. Once it's deployed to the EVM blockchain of your choice, anyone can contribute ERC-20 tokens to <strong>mint an ERC-721 NFT</strong> representing their yield-bearing position.
		</p>
		<p>
			Vaults Protocol is infinitely customizable. Use it to <strong>raise funds for charity</strong>, <strong>govern funds as a DAO or multisig</strong>, gamble in the <strong>ultimate FOMO-inducing ponzi game</strong>, and much more!
		</p>
	</div>
</section>

<footer class="column centered">
	<p>
		Created by
		<strong><a href="https://twitter.com/nuhhtyy" target="_blank">@nuhhtyy</a></strong>,
		<strong><a href="https://twitter.com/darryl__yeo" target="_blank">@darryl__yeo</a></strong> &
		<strong><a href="https://twitter.com/Mondo989" target="_blank">@Mondo989</a></strong>
		at <strong><a href="https://dorahacks.io/buidl/2498" target="_blank">ETHDenver 2022</a></strong>
	</p>
</footer>


<style>
	section {
		margin: auto;
		width: min(35rem, 100vw);
		/* min-height: 80vh; */
	}

	#top {
		--grid-gap: 1.25rem;
	}

	footer {
		margin: auto;
		padding: var(--section-padding);
		margin-bottom: 2rem;
	}

	strong {
		font-weight: 600;
	}
</style>
