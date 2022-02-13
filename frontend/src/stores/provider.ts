import { getDefaultProvider, providers } from 'ethers'
// import { getPocketNetwork } from './providers/pocket-network'
import { env } from '../lib/env'
// import { getNetworkRPC } from './networks'
import { writable } from 'svelte/store'

export const getProviderAndInstance = async (network: number, providerName: string) => {
	return await {
		'Auto': async network => {
			return {
				provider: new providers.JsonRpcProvider(
					// getNetworkRPC(network)
				)
			}
		},

		'Ethers': async network => {
			return {
				provider: getDefaultProvider(network.chainId, {
					alchemy: env.ALCHEMY_API_KEY_MAINNET,
					etherscan: env.ETHERSCAN_API_KEY,
					infura: env.INFURA_PROJECT_ID,
					pocket: {
						applicationId: env.POCKET_APP_PUBLIC_KEY,
						applicationSecretKey: env.POCKET_SECRET_KEY
					},
					// quorum: 2
				})
			}
		},

		'Infura': async network => {
			return {
				provider: new providers.InfuraProvider(network.chainId, {
					infura: env.INFURA_PROJECT_ID
				})
			}
		},
	
		'Alchemy': async network => {
			return {
				provider: new providers.AlchemyProvider(network.chainId, env.ALCHEMY_API_KEY_MAINNET)
			}
		},
	
		'Pocket Network': async network => {
			// const { instance, provider } = await getPocketNetwork(network)
			// return { instance, provider }
	
	
			// const getUrl = providers.PocketProvider.getUrl
			// providers.PocketProvider.getUrl = (...args) => {
			// 	const connection = getUrl(...args)
			// 	// connection.url = connection.url.replace('eth-mainnet.gateway.pokt.network', 'eth-archival.gateway.pokt.network')
			// 	connection.url = connection.url.replace('eth-mainnet.gateway.pokt.network', 'eth-trace.gateway.pokt.network')
			// 	return connection
			// }
	
			return {
				provider: new providers.PocketProvider(network.chainId, {
					applicationId: env.POCKET_GATEWAY_ID,
					applicationSecretKey: env.POCKET_SECRET_KEY,
					loadBalancer: true
				})
			}
	
			// const provider = new providers.PocketProvider(network.chainId, env.POCKET_GATEWAY_ID)
			// return { instance: provider, provider }
		}
	}[providerName]?.(network)
}


export const getEthersProvider = async (network: number, providerName: string) => {
	const { provider } = await getProviderAndInstance(network, providerName)
	return provider
}

export const provider = writable(async (undefined, set) => {
	set(await getEthersProvider(1, 'Pocket Network'))
})