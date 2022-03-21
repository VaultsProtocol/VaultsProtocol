
import type { Network } from './networks'
import type { Provider } from '@ethersproject/providers'

export enum RpcProvider {
	Default = 'Default',
	Ethers = 'Ethers',
	Infura = 'Infura',
	Alchemy = 'Alchemy',
	PocketNetwork = 'Pocket Network',
	BlockDaemon = 'BlockDaemon',
}

type RpcProviderConfig = {
	type: RpcProvider,
	name: string,
	icon?: string,
	get: (_: {network: Network}) => Provider
}


import { env } from './env'
import { getDefaultProvider, providers } from 'ethers'

import pocketNetworkIcon from '../assets/dapps/pocket.svg'
import alchemyIcon from '../assets/dapps/alchemy.svg'
import blockdaemonIcon from '../assets/dapps/blockdaemon.svg'

export const rpcProviders: RpcProviderConfig[] = [
	// {
	// 	type: RpcProvider.Default,
	// 	name: 'Default',
	// 	get: ({ network }) => getDefaultProvider(network.chainId, {
	// 		alchemy: env.ALCHEMY_API_KEY_MAINNET,
	// 		etherscan: env.ETHERSCAN_API_KEY,
	// 		infura: env.INFURA_PROJECT_ID,
	// 		pocket: {
	// 			applicationId: env.POCKET_APP_PUBLIC_KEY,
	// 			applicationSecretKey: env.POCKET_SECRET_KEY
	// 		},
	// 	})
	// },
	// {
	// 	type: RpcProvider.Infura,
	// 	name: 'Infura',
	// 	get: ({ network }) => new providers.InfuraProvider(network.chainId, {
	// 		infura: env.INFURA_PROJECT_ID
	// 	})
	// },
	{
		type: RpcProvider.Alchemy,
		name: 'Alchemy',
		icon: alchemyIcon,

		get: ({ network }) =>
			new providers.AlchemyProvider(
				network.chainId,
				{
					'ethereum': env.ALCHEMY_API_KEY_MAINNET,
					'ethereum-rinkeby': env.ALCHEMY_API_KEY_RINKEBY
				}[network.slug]
			)
	},
	{
		type: RpcProvider.PocketNetwork,
		name: 'Pocket Network',
		icon: pocketNetworkIcon,

		get: ({ network }) =>
			new providers.PocketProvider(network.chainId, {
				applicationId: env.POCKET_NETWORK_PORTAL_ID,
				applicationSecretKey: env.POCKET_NETWORK_SECRET_KEY,
				loadBalancer: true
			})
	},
	{
		type: RpcProvider.BlockDaemon,
		name: 'BlockDaemon',
		icon: blockdaemonIcon,

		get: ({ network }) => getDefaultProvider() // undefined
	},
]


export const rpcProvidersForNetwork = {
	"ethereum": [
		RpcProvider.Alchemy,
		RpcProvider.PocketNetwork,
		RpcProvider.BlockDaemon,
	],
	"ethereum-ropsten": [
		// RpcProvider.Alchemy,
		RpcProvider.PocketNetwork,
		RpcProvider.BlockDaemon,
	],
	"ethereum-rinkeby": [
		RpcProvider.Alchemy,
		RpcProvider.PocketNetwork,
		RpcProvider.BlockDaemon,
	],
	"ethereum-goerli": [
		// RpcProvider.Alchemy,
		RpcProvider.PocketNetwork,
		RpcProvider.BlockDaemon,
	],
	"polygon-mumbai": [],
	// "avalanche-fuji": [],
	"celo-alfajores": [],
	"metis-stardust": [],
	"aurora-testnet": [],
	"harmony-shard0": [],
	"harmony-shard1": [],
	"skale-testnet": [],
	"nahmii-testnet": [],
	"nervos-godwoken": [],
	"arbitrum-rinkeby": [],
	"reef-testnet": [],
}