export enum WalletType {
	CoinbaseWallet = 'Coinbase Wallet',
	MetaMask = 'MetaMask',
	OtherWallet = 'Other',
	Tally = 'Tally',
	WalletConnect = 'WalletConnect',
	MEW = 'MEW',
}

export enum WalletConnectionType {
	InjectedEip1193 = 'Injected EIP-1193 Provider',
	InjectedEthereum = 'Injected ethereum Provider',
	InjectedWeb3 = 'Injected web3 Provider',
	WalletConnect = 'WalletConnect',
	WalletLink = 'Coinbase Wallet SDK',
}


type WalletConfig = {
	type: WalletType,
	name: string,
	icon: typeof import("*.svg").default,

	connectionTypes: WalletConnectionType[],

	// connectionType === WalletConnectionType.InjectedWeb3 || connectionType === WalletConnectionType.InjectedEthereum
	injectedEip1193ProviderGlobal?: string,
	injectedEip1193ProviderFlag?: string,
	
	// connectionType === WalletConnectionType.WalletConnect 
	walletConnectMobileLinks?: string[],
}


import MetaMaskIcon from '../assets/wallets/metamask.svg'
import TallyIcon from '../assets/wallets/tally.svg'
import CoinbaseWalletIcon from '../assets/wallets/coinbase-wallet.svg'
import MyEtherWalletIcon from '../assets/wallets/mew.svg'
import WalletConnectIcon from '../assets/wallets/walletconnect.svg'
import WalletIcon from '../assets/wallets/wallet.svg'

export const wallets: WalletConfig[] = [
	{
		type: WalletType.MetaMask,
		name: 'MetaMask',
		// icon: (await import('../assets/wallets/metamask.svg')).default,
		icon: MetaMaskIcon,

		connectionTypes: [
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.WalletConnect,
		],

		injectedEip1193ProviderFlag: 'isMetaMask',
		walletConnectMobileLinks: ['metamask'],
	},
	{
		type: WalletType.Tally,
		name: 'Tally',
		// icon: (await import('../assets/wallets/tally.svg')).default,
		icon: TallyIcon,

		connectionTypes: [
			WalletConnectionType.InjectedEip1193,
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.InjectedWeb3,
		],

		injectedEip1193ProviderGlobal: 'tally',
		injectedEip1193ProviderFlag: 'isTally',
		walletConnectMobileLinks: ['tally'],
	},
	{
		type: WalletType.CoinbaseWallet,
		name: 'Coinbase Wallet',
		// icon: (await import('../assets/wallets/coinbase-wallet.svg')).default,
		icon: CoinbaseWalletIcon,

		connectionTypes: [
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.WalletLink,
			WalletConnectionType.WalletConnect,
		],

		injectedEip1193ProviderFlag: 'isCoinbaseWallet',
	},
	{
		type: WalletType.MEW,
		name: 'MyEtherWallet',
		// icon: (await import('../assets/wallets/mew.svg')).default,
		icon: MyEtherWalletIcon,

		connectionTypes: [
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.WalletConnect,
		],

		injectedEip1193ProviderFlag: 'isMew',
		walletConnectMobileLinks: ['mew'],
	},

	{
		type: WalletType.WalletConnect,
		name: 'WalletConnect',
		// icon: (await import('../assets/wallets/walletconnect.svg')).default,
		icon: WalletConnectIcon,

		connectionTypes: [
			WalletConnectionType.WalletConnect,
		],
	},
	{
		type: WalletType.OtherWallet,
		name: 'Other Wallet',
		// icon: (await import('../assets/wallets/wallet.svg')).default,
		icon: WalletIcon,

		connectionTypes: [
			WalletConnectionType.InjectedEthereum,
			WalletConnectionType.InjectedWeb3,
			WalletConnectionType.WalletConnect,
		],
	},

	// {
	// 	name: 'MathWallet',
	// 	injectedEip1193ProviderFlag: 'isMathWallet',
	// },
	// {
	// 	name: 'DIDWallet',
	// 	injectedEip1193ProviderFlag: 'isDIDWallet',
	// },
	// {
	// 	name: 'wallet.io',
	// 	injectedEip1193ProviderFlag: 'isWalletIO',
	// },
	// {
	// 	name: "D'CENT",
	// 	injectedEip1193ProviderFlag: 'isDcentWallet',
	// },
	// {
	// 	name: 'TokenPocket',
	// 	injectedEip1193ProviderFlag: 'isTokenPocket',
	// },
	// {
	// 	name: 'Ownbit',
	// 	injectedEip1193ProviderFlag: 'isOwnbit',
	// },
	// {
	// 	name: 'MEETONE',
	// 	injectedEip1193ProviderFlag: 'wallet',
	// },
	// {
	// 	name: 'Torus',
	// 	injectedEip1193ProviderFlag: 'isTorus',
	// },
	// {
	// 	name: 'imToken',
	// 	injectedEip1193ProviderFlag: 'isImToken',
	// },
	// {
	// 	name: 'Dapper',
	// 	injectedEip1193ProviderFlag: 'isDapper',
	// },
	// {
	// 	name: 'WalletConnect',
	// 	injectedEip1193ProviderFlag: 'isWalletConnect',
	// },
	// {
	// 	name: 'Trust',
	// 	injectedEip1193ProviderFlag: 'isTrust',
	// },
	// {
	// 	name: 'Coinbase',
	// 	injectedEip1193ProviderFlag: 'isCoinbaseWallet',
	// },
	// {
	// 	name: 'Opera',
	// 	injectedEip1193ProviderFlag: 'isOpera',
	// },
	// {
	// 	name: 'Status',
	// 	injectedEip1193ProviderFlag: 'isStatus',
	// },
	// {
	// 	name: 'XDEFI',
	// 	injectedEip1193ProviderFlag: 'isXDEFI',
	// },
	// {
	// 	name: 'Tally',
	// 	injectedEip1193ProviderFlag: 'isTally',
	// },
	// {
	// 	name: 'Tokenary',
	// 	injectedEip1193ProviderFlag: 'isTokenary',
	// },
	// {
	// 	name: 'Frame',
	// 	injectedEip1193ProviderFlag: 'isFrame',
	// },
	// {
	// 	name: 'MYKEY',
	// 	injectedEip1193ProviderFlag: 'isMYKEY',
	// },
	// {
	// 	name: 'huobiwallet',
	// 	injectedEip1193ProviderFlag: 'isHbWallet',
	// },
	// {
	// 	name: 'HyperPay',
	// 	injectedEip1193ProviderFlag: 'isHyperPay',
	// },
	// {
	// 	name: 'AToken',
	// 	injectedEip1193ProviderFlag: 'isAToken',
	// },
	// {
	// 	name: 'Liquality',
	// 	injectedEip1193ProviderFlag: 'isLiquality',
	// },
	// {
	// 	name: 'AlphaWallet',
	// 	injectedEip1193ProviderFlag: 'isAlphaWallet',
	// },
	// {
	// 	name: 'Bitpie',
	// 	injectedEip1193ProviderFlag: 'isBitpie',
	// },
	// {
	// 	name: 'tp',
	// 	injectedEip1193ProviderFlag: 'isTp',
	// },
	// {
	// 	name: 'BlockWallet',
	// 	injectedEip1193ProviderFlag: 'isBlockWallet',
	// },
	// {
	// 	name: '1inch',
	// 	injectedEip1193ProviderFlag: 'isOneInchIOSWallet',
	// },
]

export const walletsByType = Object.fromEntries(wallets.map(wallet => [wallet.type, wallet]))


import type { ExternalProvider } from '@ethersproject/providers'
import type { CoinbaseWalletProvider, CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import type WalletConnectProvider from '@walletconnect/web3-provider'

export type WalletConnection = {
	walletType: WalletType,
	connectionType: WalletConnectionType,
	provider: ExternalProvider | WalletConnectProvider | CoinbaseWalletProvider,
	connect?: () => void,
	disconnect?: () => void,
}


import { env } from './env'

const ETHEREUM_NODE_URI = env.ETHEREUM_NODE_URI || `https://eth-rinkeby.alchemyapi.io/v2/${env.ALCHEMY_API_KEY_MAINNET}`

import { importExternalPackage } from './loadExternalPackages'

import { Web3Provider } from '@ethersproject/providers'

const connectEip1193 = async (provider: ExternalProvider) => {
	try {
		if(!provider.request){
			// provider.request = (request) => provider.sendPromise(request.method, request.params)
			provider.request = async (request) => await new Promise((resolve, reject) => {
				provider.sendAsync(request, (error, result) => {
					console.log('sendAsync', error, result)
					error ? reject(error) : resolve(result)
				})
			})
		}

		console.log('provider.request...')
		await provider.request({ method: 'eth_requestAccounts' })
		console.log('provider.request done')

		// provider.request = async (request) => await new Promise((resolve, reject) => provider.sendAsync(request, reject))
		// if(provider.request)
		// 	await provider.request({ method: 'eth_requestAccounts' })
		// else{
		// 	console.log('env.ETHEREUM_NODE_URI', ETHEREUM_NODE_URI)
		// 	let _provider = new provider.requestManager.providers.HttpProvider(ETHEREUM_NODE_URI)
		// 	console.log('_provider', _provider, _provider)
		// 	console.log('9')
		// 	await _provider.sendAsync({ method: 'eth_requestAccounts' })
		// 	console.log('dohne')
		// 	await new Promise((resolve, reject) =>
		// 		provider.sendAsync({ method: 'eth_requestAccounts' }, reject)
		// 	)
		// }
	}catch(e){
		if(e.message.includes('User rejected the request'))
			throw e
	}
}

const getWalletConnection = async ({
	walletType,
	chainId = env.NETWORK_ID
}: {
	walletType: WalletType,
	chainId?: number
}): Promise<WalletConnection> => {
	const walletConfig = walletsByType[walletType]

	for (const connectionType of walletConfig.connectionTypes) {
		switch (connectionType) {
			case WalletConnectionType.InjectedEip1193: {
				const provider = globalThis[walletConfig.injectedEip1193ProviderGlobal]

				if (provider?.[walletConfig.injectedEip1193ProviderFlag]) {
					return {
						walletType,
						connectionType: WalletConnectionType.InjectedEip1193,
						provider,

						connect: async () => await connectEip1193(provider),
					}
				}

				break
			}

			case WalletConnectionType.InjectedEthereum: {
				const provider = globalThis.ethereum

				if (
					provider && (
						!walletConfig.injectedEip1193ProviderFlag
						|| provider[walletConfig.injectedEip1193ProviderFlag]
					)
				) {
					// https://docs.metamask.io/guide/provider-migration.html#migrating-to-the-new-provider-api
					provider.autoRefreshOnNetworkChange = false

					// Coinbase Wallet browser extension disguised as MetaMask
					if(provider.selectedProvider?.isCoinbaseWallet)
						break
						// walletType = WalletType.CoinbaseWallet

					return {
						walletType,
						connectionType: WalletConnectionType.InjectedEthereum,
						provider,

						connect: async () => await connectEip1193(provider),
					}
				}

				break
			}

			case WalletConnectionType.InjectedWeb3: {
				const provider = globalThis.web3?.currentProvider

				if (
					provider && (
						!walletConfig.injectedEip1193ProviderFlag
						|| provider[walletConfig.injectedEip1193ProviderFlag]
					)
				) {
					return {
						walletType,
						connectionType: WalletConnectionType.InjectedWeb3,
						provider,

						connect: async () => await connectEip1193(provider),
					}
				}

				break
			}

			case WalletConnectionType.WalletLink: {
				// const { CoinbaseWalletSDK } = await import('@coinbase/wallet-sdk')
				const { CoinbaseWalletSDK } = (await import('../modules/@coinbase/wallet-sdk')).default

				const provider: CoinbaseWalletProvider = new CoinbaseWalletSDK({
					appName: 'DAO Creator',
					appLogoUrl: '',
					darkMode: true,
					overrideIsMetaMask: false,
					overrideIsCoinbaseWallet: true,
				}).makeWeb3Provider(
					ETHEREUM_NODE_URI,
					chainId
				)

				return {
					walletType,
					connectionType: WalletConnectionType.WalletLink,
					provider,

					connect: async () => {
						try {
							await provider.request({ method: 'eth_requestAccounts' })
						}catch(e){
							if(e.message.includes('User denied account authorization'))
								throw e
						}
					},

					disconnect: async () => {
						await provider.disconnect()
					}
				}
			}

			case WalletConnectionType.WalletConnect: {
				const WalletConnectProvider: WalletConnectProvider = await importExternalPackage('@walletconnect/web3-provider')

				const provider: WalletConnectProvider = new WalletConnectProvider({
					rpc: {
						[chainId]: ETHEREUM_NODE_URI || '',
					},
					bridge: env.WALLET_CONNECT_BRIDGE_URI,

					// Restrict WalletConnect options to the selected wallet
					...walletConfig.walletConnectMobileLinks
						? { qrcodeModalOptions: { mobileLinks: walletConfig.walletConnectMobileLinks } }
						: {},
				})

				return {
					walletType,
					connectionType: WalletConnectionType.WalletConnect,
					provider,

					connect: async () => {
						try {
							await provider.enable()
						}catch(e){
							if(
								e.message.includes('User closed WalletConnect modal') ||
								e.message.includes('User closed modal')
							)
								throw e
						}
					},

					disconnect: async () => {
						provider.qrcode = false
						await provider.disconnect()
					}
				}
			}
		}
	}

	return {
		walletType: undefined,
		connectionType: undefined,
		provider: undefined
	}
}


import { readable } from 'svelte/store'

export const connectWallet = async ({
	walletType,
	chainId
}: {
	walletType: WalletType,
	chainId?: number
}) => {
	const walletConnection = await getWalletConnection({
		walletType,
		chainId
	})

	const { provider } = walletConnection

	if(!walletConnection.provider)
		throw new Error('No provider found')

	await walletConnection.connect()

	return {
		walletConnection,

		signer: new Web3Provider(provider).getSigner(), // Object.assign(signer, { address: accounts[0] }),

		accounts: readable<string[]>([], set => {
			const onAccountsChanged = (accounts: string[]) => set(accounts)

			provider.request({ method: 'eth_accounts' }).then(onAccountsChanged)

			provider.on?.('accountsChanged', onAccountsChanged)

			return () => provider.off?.('accountsChanged', onAccountsChanged)
		}),

		chainId: readable<number>(chainId, set => {
			const onChainIdChanged = (chainId: number | string) => set(Number(chainId))

			provider.request({ method: 'eth_chainId' }).then(onChainIdChanged)

			provider.on?.('chainChanged', onChainIdChanged)

			return () => provider.off?.('chainChanged', onChainIdChanged)
		}),
	}
}
