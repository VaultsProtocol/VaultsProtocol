export enum WalletType {
	CoinbaseWallet = 'Coinbase Wallet',
	MetaMask = 'MetaMask',
	OtherWallet = 'Other',
	Tally = 'Tally',
	WalletConnect = 'WalletConnect',
	MEW = 'MEW',
}

export enum WalletConnectionType {
	InjectedWeb3 = 'InjectedWeb3',
	InjectedEthereum = 'InjectedEthereum',
	WalletConnect = 'WalletConnect',
	WalletLink = 'WalletLink',
}


const ETHEREUM_NODE_URI = env.ETHEREUM_NODE_URI || `https://eth-rinkeby.alchemyapi.io/v2/${env.ALCHEMY_API_KEY_MAINNET}`


import type { MessageFormatter } from 'svelte-i18n/types/runtime/types'

type WalletConfig = {
	type: WalletType,
	name: string,
	icon: typeof import("*.svg").default,

	connectionTypes: WalletConnectionType[],

	// connectionType === WalletConnectionType.InjectedWeb3 || connectionType === WalletConnectionType.InjectedEthereum
	injectedWalletFlag?: string,
	
	// connectionType === WalletConnectionType.WalletConnect 
	walletConnectMobileLinks?: string[],
}


export const wallets: WalletConfig[] = [
	{
		type: WalletType.MetaMask,
		name: 'MetaMask',
		icon: (await import('../assets/wallets/metamask.svg')).default,

		connectionTypes: [
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.WalletConnect,
		],

		injectedWalletFlag: 'isMetaMask',
		walletConnectMobileLinks: ['metamask'],
	},
	{
		type: WalletType.Tally,
		name: 'Tally',
		icon: (await import('../assets/wallets/tally.svg')).default,

		connectionTypes: [
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.WalletConnect,
		],

		injectedWalletFlag: 'isTally',
		walletConnectMobileLinks: ['tally'],
	},
	{
		type: WalletType.CoinbaseWallet,
		name: 'Coinbase Wallet',
		icon: (await import('../assets/wallets/coinbase-wallet.png')).default,

		connectionTypes: [
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.WalletConnect,
			WalletConnectionType.WalletLink,
		],

		injectedWalletFlag: 'isCoinbaseWallet',
	},
	{
		type: WalletType.MEW,
		name: 'MyEtherWallet',
		icon: (await import('../assets/wallets/mew.svg')).default,

		connectionTypes: [
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.WalletConnect,
		],

		injectedWalletFlag: 'isMew',
		walletConnectMobileLinks: ['mew'],
	},

	{
		type: WalletType.WalletConnect,
		name: 'WalletConnect',
		icon: (await import('../assets/wallets/walletconnect.svg')).default,

		connectionTypes: [
			WalletConnectionType.WalletConnect,
		],
	},
	{
		type: WalletType.OtherWallet,
		name: 'Other Wallet',
		icon: (await import('../assets/wallets/wallet.svg')).default,

		connectionTypes: [
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.WalletConnect,
		],
	},
]

export const walletsByType = Object.fromEntries(wallets.map(wallet => [wallet.type, wallet]))


import { env } from './env'

let walletConnectProvider


import { importExternalPackage } from './loadExternalPackages'
import { _ } from 'svelte-i18n'

import type WalletConnectProvider from '@walletconnect/web3-provider'

// import { providers } from 'ethers'
import { JsonRpcSigner, Web3Provider, type ExternalProvider } from '@ethersproject/providers'

const getProvider = async ({
	walletType,
	chainId = env.NETWORK_ID
}: {
	walletType: WalletType,
	chainId?: number
}): Promise<{
	connectionType: WalletConnectionType
	provider: ExternalProvider | WalletConnectProvider,
}> => {
	const walletConfig = walletsByType[walletType]

	if(
		walletConfig.connectionTypes.includes(WalletConnectionType.InjectedEthereum) && (
			!walletConfig.injectedWalletFlag
			|| globalThis.ethereum?.[walletConfig.injectedWalletFlag]
		)
	){
		globalThis.ethereum.autoRefreshOnNetworkChange = false
		return {
			connectionType: WalletConnectionType.InjectedEthereum,
			provider: globalThis.ethereum,
		}
	}

	if(
		walletConfig.connectionTypes.includes(WalletConnectionType.InjectedEthereum) && (
			!walletConfig.injectedWalletFlag
			|| globalThis.web3?.currentProvider?.[walletConfig.injectedWalletFlag]
		)
	){
		return {
			connectionType: WalletConnectionType.InjectedEthereum,
			provider: globalThis.web3.currentProvider,
		}
	}

	if(walletConfig.connectionTypes.includes(WalletConnectionType.WalletLink)){
		await import('./walletlink')

		const WalletLink = globalThis.WalletLink

		return {
			connectionType: WalletConnectionType.WalletLink,
			provider: new WalletLink({
				appName: 'DAO Creator',
				appLogoUrl: ''
			}).makeWeb3Provider(
				ETHEREUM_NODE_URI,
				chainId
			)
		}
	}

	if(walletConfig.connectionTypes.includes(WalletConnectionType.WalletConnect)){
		const WalletConnectProvider: WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')

		return {
			connectionType: WalletConnectionType.WalletConnect,
			provider: new WalletConnectProvider({
				rpc: {
					[chainId]: ETHEREUM_NODE_URI || '',
				},
				bridge: env.WALLET_CONNECT_BRIDGE_URI,

				// Restrict WalletConnect options to the selected wallet
				... walletConfig.walletConnectMobileLinks
					? { qrcodeModalOptions: { mobileLinks: walletConfig.walletConnectMobileLinks } }
					: {},
			})
		}
	}

	return {
		connectionType: undefined,
		provider: undefined
	}
}


export const connectWallet = async ({
	walletType,
	autoReconnect = false
}) => {
	const { connectionType, provider } = await getProvider({ walletType })

	console.log('provider', connectionType, provider, provider.__proto__)

	if(!provider)
		throw new Error('No provider found')

	if(connectionType === WalletConnectionType.WalletConnect){
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
	}
	
	else if(connectionType === WalletConnectionType.WalletLink){
		try {
			await provider.request({ method: 'eth_requestAccounts' })
		}catch(e){
			if(e.message.includes('User denied account authorization'))
				throw e
		}
	}
	
	else if (!autoReconnect) {
		try {
			await provider.request({ method: 'eth_requestAccounts' })
		}catch(e){
			if(e.message.includes('User rejected the request'))
				throw e
		}
	}

	const chainId = parseInt(await provider.request({ method: 'eth_chainId' }), 16)
	const accounts = await provider.request({ method: 'eth_accounts' })

	const signer = new Web3Provider(provider).getSigner()
	

	return {
		signer: Object.assign(signer, { address: accounts[0] }),
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



export function getProviderName(provider: any): string | undefined {
	if (!provider) return

	if (provider.isMathWallet) {
		return 'MathWallet'
	}

	if (provider.isDIDWallet) {
		return 'DIDWallet'
	}

	if (provider.isWalletIO) {
		return 'wallet.io'
	}

	if (provider.isDcentWallet) {
		return "D'CENT"
	}

	if (provider.isTokenPocket) {
		return 'TokenPocket'
	}

	if (provider.isOwnbit) {
		return 'Ownbit'
	}

	if (provider.wallet === 'MEETONE') {
		return 'MEETONE'
	}

	if (provider.isTorus) {
		return 'Torus'
	}

	if (provider.isImToken) {
		return 'imToken'
	}

	if (provider.isDapper) {
		return 'Dapper'
	}

	if (provider.isWalletConnect) {
		return 'WalletConnect'
	}

	if (provider.isTrust) {
		return 'Trust'
	}

	if (provider.isCoinbaseWallet) {
		return 'Coinbase'
	}

	if (provider.isOpera) {
		return 'Opera'
	}

	if (provider.isStatus) {
		return 'Status'
	}

	if (provider.isXDEFI) {
		return 'XDEFI'
	}

	if (provider.isTally) {
		return 'Tally'
	}

	if (provider.isTokenary) {
		return 'Tokenary'
	}

	if (provider.isFrame) {
		return 'Frame'
	}

	if (provider.isMYKEY) {
		return 'MYKEY'
	}

	if (provider.isHbWallet) {
		return 'huobiwallet'
	}

	if (provider.isHyperPay) {
		return 'HyperPay'
	}

	if (provider.isAToken) {
		return 'AToken'
	}

	if (provider.isLiquality) {
		return 'Liquality'
	}

	if (provider.isAlphaWallet) {
		return 'AlphaWallet'
	}

	if (provider.isBitpie) {
		return 'Bitpie'
	}

	if (provider.isTp) {
		return 'tp'
	}

	if (provider.isBlockWallet) {
		return 'BlockWallet'
	}

	if (provider.isOneInchIOSWallet) {
		return '1inch'
	}

	if (provider.isOneInchIOSWallet) {
		return '1inch'
	}

	// =====================================
	// When adding new wallet place above this metamask check as some providers
	// have an isMetaMask property in addition to the wallet's own `is[WalletName]`

	if (provider.isMetaMask && provider._metamask) {
		return 'MetaMask'
	}

	if (provider.host && provider.host.indexOf('localhost') !== -1) {
		return 'localhost'
	}
}
