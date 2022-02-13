export enum WalletType {
	CoinbaseWallet = 'Coinbase Wallet',
	MetaMask = 'MetaMask',
	OtherWallet = 'Other',
	Tally = 'Tally',
	WalletConnect = 'WalletConnect',
}


import type { MessageFormatter } from 'svelte-i18n/types/runtime/types'

type WalletConfig = {
	type: WalletType,
	name: ((_: MessageFormatter) => string),
	icon: string,
}

import iconCoinbaseWallet from '../assets/wallets/coinbase-wallet.png'
import iconMetaMask from '../assets/wallets/metamask.svg'
import iconTally from '../assets/wallets/tally.svg'
import iconWalletConnect from '../assets/wallets/walletconnect.svg'


export const wallets: WalletConfig[] = [
	{
		type: WalletType.MetaMask,
		name: _ => _('Wallets.MetaMask'),
		icon: iconMetaMask,
	},
	{
		type: WalletType.WalletConnect,
		name: _ => _('Wallets.WalletConnect'),
		icon: iconWalletConnect,
	},
	{
		type: WalletType.Tally,
		name: _ => _('Wallets.Tally'),
		icon: iconTally,
	},
	{
		type: WalletType.CoinbaseWallet,
		name: _ => _('Wallets.Coinbase Wallet'),
		icon: iconCoinbaseWallet,
	},
]

export const walletsByType = Object.fromEntries(wallets.map(wallet => [wallet.type, wallet]))


import { env } from './env'

const chainId = Number(env.NETWORK_ID)

const walletConnectBaseOptions: IWalletConnectProviderOptions = {
	rpc: {
		[chainId]: env.ETHEREUM_NODE_URI || '',
	},
	bridge: env.WALLET_CONNECT_BRIDGE_URI,
}

let walletConnectProvider


import { importExternalPackage } from './loadExternalPackages'
import { _ } from 'svelte-i18n'

import './walletlink'
const WalletLink = globalThis.WalletLink


const getProvider = async ({
	walletType,
	options = {},
}: {
	walletType: WalletType
	options?: {
		derivationPath?: string
		walletAddress?: string
	}
}): Promise<{
	provider: any
	isWalletConnect?: boolean
	isWalletLink?: boolean
}> => {
	switch (walletType) {
		case WalletType.CoinbaseWallet: {
			let provider
			if(globalThis.ethereum){
				globalThis.ethereum.autoRefreshOnNetworkChange = false
				provider = globalThis.ethereum
			} else if (globalThis.web3?.currentProvider) {
				provider = globalThis.web3.currentProvider
			}

			// If the user is in the Coinbase Wallet app
			if(provider?.isCoinbaseWallet)
				return { provider }
		
			provider = new WalletLink({
				appName: 'DAO Creator',
				appLogoUrl: ''
			}).makeWeb3Provider(
				env.ETHEREUM_NODE_URI,
				chainId
			)

			return { provider: provider, isWalletLink: true }
		}
		case WalletType.ImToken: {
			if(globalThis.ethereum?.isImToken)
				return { provider: globalThis.ethereum }

			if(globalThis.web3?.currentProvider?.isImToken)
				return { provider: globalThis.web3.currentProvider }

			const WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')

			walletConnectProvider = new WalletConnectProvider({
				...walletConnectBaseOptions,
				qrcodeModalOptions: {
					mobileLinks: ['imtoken'],
				},
			})

			return { provider: walletConnectProvider, isWalletConnect: true }
		}
		case WalletType.MetaMask: {
			if(globalThis.ethereum?.isMetaMask){
				globalThis.ethereum.autoRefreshOnNetworkChange = false
				return { provider: globalThis.ethereum }
			}

			if(globalThis.web3?.currentProvider?.isMetaMask)
				return { provider: globalThis.web3.currentProvider }

			// Restrict WalletConnect options to MetaMask
			const WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')

			walletConnectProvider = new WalletConnectProvider({
				...walletConnectBaseOptions,
				qrcodeModalOptions: {
					mobileLinks: ['metamask'],
				},
			})

			return { provider: walletConnectProvider, isWalletConnect: true }
		}
		case WalletType.OtherWallet: {
			if(globalThis.ethereum){
				globalThis.ethereum.autoRefreshOnNetworkChange = false
				return { provider: globalThis.ethereum }
			}

			if(globalThis.web3?.currentProvider){
				return { provider: globalThis.web3.currentProvider }
			}

			const WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')
			walletConnectProvider = new WalletConnectProvider(walletConnectBaseOptions)

			return { provider: walletConnectProvider, isWalletConnect: true }
		}
		case WalletType.Rainbow: {
			const WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')
			walletConnectProvider = new WalletConnectProvider({
				...walletConnectBaseOptions,
				qrcodeModalOptions: {
					mobileLinks: ['rainbow'],
				},
			})

			return { provider: walletConnectProvider, isWalletConnect: true }
		}
		case WalletType.TokenPocket: {
			if(globalThis.ethereum?.isTokenPocket)
				return { provider: globalThis.ethereum }

			if(globalThis.web3?.currentProvider?.isTokenPocket)
				return { provider: globalThis.web3.currentProvider }

			const WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')
			walletConnectProvider = new WalletConnectProvider({
				...walletConnectBaseOptions,
				qrcodeModalOptions: {
					mobileLinks: ['tokenpocket'],
				},
			})

			return { provider: walletConnectProvider, isWalletConnect: true }
		}
		case WalletType.TrustWallet: {
			if(globalThis.ethereum?.isTrustWallet)
				return { provider: globalThis.ethereum }

			if(globalThis.web3?.currentProvider?.isTrustWallet)
				return { provider: globalThis.web3.currentProvider }

			const WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')
			walletConnectProvider = new WalletConnectProvider({
				...walletConnectBaseOptions,
				qrcodeModalOptions: {
					mobileLinks: ['trust'],
				},
			})

			return { provider: walletConnectProvider, isWalletConnect: true }
		}
		case WalletType.WalletConnect: {
			const WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')
			walletConnectProvider = new WalletConnectProvider(walletConnectBaseOptions)

			return { provider: walletConnectProvider, isWalletConnect: true }
		}
		default:
			break
	}

	return { provider: null }
}


export const connectWallet = async ({
	walletType,
	options = {},
	autoReconnect = false
}) => {
	const { provider, isWalletConnect, isWalletLink } = await getProvider({
		walletType,
		options,
	})

	if(!provider)
		throw new Error('No provider found')

	if(isWalletConnect){
		try {
			await provider.enable()
		}catch(e){
			if(
				e.message.includes('User closed WalletConnect modal') ||
				e.message.includes('User closed modal')
			)
				throw e

			return
		}
	} else if (walletType === WalletType.CoinbaseWallet) {
		try {
			await provider.request({ method: 'eth_requestAccounts' })
		}catch(e){
			if(e.message.includes('User denied account authorization'))
				throw e
		}
	} else if (!autoReconnect) {
		try {
			await provider.request({ method: 'eth_requestAccounts' })
		}catch(e){
			if(e.message.includes('User rejected the request'))
				throw e
		}
	}

	const chainId = parseInt(await provider.request({ method: 'eth_chainId' }), 16)
	const accounts = await provider.request({ method: 'eth_accounts' })

	return {
		chainId,
		accounts,
		onAccountChanged: (callback?: (accounts: string[]) => void) => {
			provider.on?.('accountsChanged', callback)
		},
		onChainIdChanged: (callback: (chainId: number) => void) => {
			provider.on?.('chainChanged', callback)
		}
	}
}

export const disconnectWallet = async ({ walletType }) => {
	if(walletType === WalletType.CoinbaseWallet){
		await walletLinkInstance.disconnect()
	} else if(walletConnectProvider?.disconnect){
		walletConnectProvider.qrcode = false
		await walletConnectProvider.disconnect()
	}
}