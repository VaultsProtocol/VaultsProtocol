import { erc20Tokens, type ERC20Token } from "./tokens"

export type ChainID = number

export type Network = {
	slug: string,
	name: string,
	chainId: ChainID,
	slip44?: number,
	shortName?: string,
	chain?: string,
	network?: string,
	networkId?: number,
	nativeCurrency: {
		name: string,
		symbol: string,
		decimals: number
	},
	rpc: string[],
	faucets?: string[],
	explorers?: {
		name: string,
		url: string,
		standard?: string,
		icon?: string,
	}[],
	infoURL?: string,
	icon?: string,
	ens?: {
		registry: string
	}
	parent?: {
		chain: `eip155-${ChainID}`,
		type: 'L2' | 'shard' | 'parachain'
	},
}

export const networks: Network[] = [
  {
		"slug": "ethereum",
		"name": "Ethereum",
		"chainId": 1,
		"slip44": 60,
		"shortName": "eth",
		"chain": "ETH",
		"network": "mainnet",
		"networkId": 1,
		"nativeCurrency": {
			"name": "Ether",
			"symbol": "ETH",
			"decimals": 18
		},
		"rpc": [
			"https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}",
			"wss://mainnet.infura.io/ws/v3/${INFURA_PROJECT_ID}",
		],
		"faucets": [],
		"explorers": [
			{
				"name": "etherscan",
				"url": "https://etherscan.io",
				"standard": "EIP3091"
			}
		],
		"infoURL": "https://ethereum.org",
		"ens": {
			"registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
		},
		"icon": "ethereum",
	},
	{
		"slug": "ethereum-ropsten",
		"name": "Ethereum Ropsten",
		"chainId": 3,
		"shortName": "rop",
		"chain": "ETH",
		"network": "ropsten",
		"networkId": 3,
		"nativeCurrency": {
			"name": "Ropsten Ether",
			"symbol": "ROP",
			"decimals": 18
		},
		"rpc": [
			"https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}",
			"wss://ropsten.infura.io/ws/v3/${INFURA_PROJECT_ID}"
		],
		"faucets": [
			"https://faucet.ropsten.be?${ADDRESS}"
		],
		"explorers": [],
		"infoURL": "https://github.com/ethereum/ropsten",
		"ens": {
			"registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
		}
	},
	{
		"slug": "ethereum-rinkeby",
		"name": "Ethereum Rinkeby",
		"chainId": 4,
		"shortName": "rin",
		"chain": "ETH",
		"network": "rinkeby",
		"networkId": 4,
		"nativeCurrency": {
			"name": "Rinkeby Ether",
			"symbol": "RIN",
			"decimals": 18
		},
		"rpc": [
			"https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}",
			"wss://rinkeby.infura.io/ws/v3/${INFURA_PROJECT_ID}"
		],
		"faucets": [
			"https://faucet.rinkeby.io"
		],
		"explorers": [
			{
				"name": "etherscan-rinkeby",
				"url": "https://rinkeby.etherscan.io",
				"standard": "EIP3091"
			}
		],
		"infoURL": "https://www.rinkeby.io",
		"ens": {
			"registry": "0xe7410170f87102df0055eb195163a03b7f2bff4a"
		}
	},
	{
		"slug": "ethereum-goerli",
		"name": "Ethereum Goerli",
		"chainId": 5,
		"shortName": "goe",
		"chain": "ETH",
		"network": "goerli",
		"networkId": 5,
		"nativeCurrency": {
			"name": "Goerli Ether",
			"symbol": "GOE",
			"decimals": 18
		},
		"rpc": [
			"https://goerli.infura.io/v3/${INFURA_PROJECT_ID}",
			"wss://goerli.infura.io/ws/v3/${INFURA_PROJECT_ID}"
		],
		"faucets": [
			"https://faucet.goerli.io"
		],
		"explorers": [
			{
				"name": "etherscan-goerli",
				"url": "https://goerli.etherscan.io",
				"standard": "EIP3091"
			}
		],
		"infoURL": "https://www.goerli.net",
		"ens": {
			"registry": "0xe7410170f87102df0055eb195163a03b7f2bff4a"
		}
	},
	{
		"slug": "polygon",
		"name": "Polygon",
		"chainId": 137,
		"shortName": "polygon",
		"chain": "Polygon",
		"network": "mainnet",
		"networkId": 137,
		"nativeCurrency": {
			"name": "Matic",
			"symbol": "MATIC",
			"decimals": 18
		},
		"rpc": [
			"https://rpc-mainnet.matic.network",
			"wss://ws-mainnet.matic.network",
			"https://rpc-mainnet.matic.quiknode.pro",
			"https://matic-mainnet.chainstacklabs.com"
		],
		"faucets": [],
		"explorers": [
			{
				"name": "polygonscan",
				"url": "https://polygonscan.com",
				"standard": "EIP3091"
			}
		],
		"infoURL": "https://polygon.technology"
	},
	{
		"slug": "polygon-mumbai",
		"name": "Polygon Mumbai Testnet",
		"chainId": 80001,
		"shortName": "maticmum",
		"chain": "Polygon",
		"network": "testnet",
		"networkId": 80001,
		"nativeCurrency": {
			"name": "Matic",
			"symbol": "tMATIC",
			"decimals": 18
		},
		"rpc": [
			"https://rpc-mumbai.matic.today",
			"wss://ws-mumbai.matic.today"
		],
		"faucets": [
			"https://faucet.matic.network/"
		],
		"explorers": [
			{
				"name": "polygonscan",
				"url": "https://mumbai.polygonscan.com/",
				"standard": "EIP3091"
			}
		],
		"infoURL": "https://matic.network/"
	},

	{
		"slug": "avalanche",
		"name": "Avalanche C-Chain",
		"chainId": 43114,
		"shortName": "Avalanche",
		"chain": "AVAX",
		"network": "mainnet",
		"networkId": 1,
		"nativeCurrency": {
			"name": "Avalanche",
			"symbol": "AVAX",
			"decimals": 18
		},
		"rpc": [
			"https://api.avax.network/ext/bc/C/rpc"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://cchain.explorer.avax.network/"
	},
	{
		"slug": "avalanche-fuji",
		"name": "Avalanche Fuji Testnet",
		"chainId": 43113,
		"shortName": "Fuji",
		"chain": "AVAX",
		"network": "testnet",
		"networkId": 1,
		"nativeCurrency": {
			"name": "Avalanche",
			"symbol": "AVAX",
			"decimals": 18
		},
		"rpc": [
			"https://api.avax-test.network/ext/bc/C/rpc"
		],
		"faucets": [
			"https://faucet.avax-test.network/"
		],
		"explorers": [],
		"infoURL": "https://cchain.explorer.avax-test.network"
	},

	{
		"slug": "celo",
		"name": "Celo",
		"chainId": 42220,
		"shortName": "CELO",
		"chain": "CELO",
		"network": "Mainnet",
		"networkId": 42220,
		"nativeCurrency": {
			"name": "CELO",
			"symbol": "CELO",
			"decimals": 18
		},
		"rpc": [
			"https://explorer.celo.org/api/eth-rpc",
			"https://forno.celo.org",
			"wss://forno.celo.org/ws"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://docs.celo.org/"
	},
	{
		"slug": "celo-alfajores",
		"name": "Celo Alfajores Testnet",
		"chainId": 44787,
		"shortName": "ALFA",
		"chain": "CELO",
		"network": "Alfajores",
		"networkId": 44787,
		"nativeCurrency": {
			"name": "CELO",
			"symbol": "CELO",
			"decimals": 18
		},
		"rpc": [
			"https://alfajores-forno.celo-testnet.org",
			"wss://alfajores-forno.celo-testnet.org/ws"
		],
		"faucets": [
			"https://celo.org/developers/faucet",
			"https://cauldron.pretoriaresearchlab.io/alfajores-faucet"
		],
		"explorers": [],
		"infoURL": "https://docs.celo.org/"
	},

	{
		"slug": "metis",
		"name": "Metis",
		"chainId": 1088,
		"nativeCurrency": {
			"name": "Metis",
			"symbol": "METIS",
			"decimals": 18
		},
		"rpc": [
			"https://dragonfire.metis.io/?owner=488",
			// "https://rocketfuel.metis.io/?owner=435"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://www.metis.io"
	},
  	{
		"slug": "metis-stardust",
		"name": "Metis Stardust",
		"chainId": 588,
		"nativeCurrency": {
			"name": "Metis",
			"symbol": "METIS",
			"decimals": 18
		},
		"rpc": [
			"https://stardust.metis.io/?owner=588",
			// "https://rocketfuel.metis.io/?owner=435"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://www.metis.io"
	},

	{
		"slug": "aurora",
		"name": "Aurora",
		"chainId": 1313161554,
		"shortName": "aurora",
		"chain": "NEAR",
		"network": "mainnet",
		"networkId": 1313161554,
		"nativeCurrency": {
			"name": "Ether",
			"symbol": "aETH",
			"decimals": 18
		},
		"rpc": [
			"https://rpc.mainnet.aurora.dev:8545"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://aurora.dev"
	},
	{
		"slug": "aurora-testnet",
		"name": "Aurora TestNet",
		"chainId": 1313161555,
		"shortName": "aurora-testnet",
		"chain": "NEAR",
		"network": "testnet",
		"networkId": 1313161555,
		"nativeCurrency": {
			"name": "Ether",
			"symbol": "aETH",
			"decimals": 18
		},
		"rpc": [
			"https://rpc.testnet.aurora.dev:8545"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://aurora.dev"
	},

	{
		"slug": "harmony-shard0",
		"name": "Harmony Shard 0",
		"chainId": 1666600000,
		"shortName": "hmy-s0",
		"chain": "Harmony",
		"network": "mainnet",
		"networkId": 1666600000,
		"nativeCurrency": {
			"name": "ONE",
			"symbol": "ONE",
			"decimals": 18
		},
		"rpc": [
			"https://api.harmony.one"
		],
		"faucets": [],
		"explorers": [
			{
				"name": "Harmony Block Explorer",
				"url": "https://explorer.harmony.one",
				"standard": "EIP3091"
			}
		],
		"infoURL": "https://www.harmony.one/"
	},
	{
		"slug": "harmony-shard1",
		"name": "Harmony Shard 1",
		"chainId": 1666600001,
		"shortName": "hmy-s1",
		"chain": "Harmony",
		"network": "mainnet",
		"networkId": 1666600001,
		"nativeCurrency": {
			"name": "ONE",
			"symbol": "ONE",
			"decimals": 18
		},
		"rpc": [
			"https://s1.api.harmony.one"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://www.harmony.one/"
	},

	{
		"slug": "skale-testnet",
		"name": "SKALE Network Testnet",
		"chainId": 344435,
		"nativeCurrency": {
			"name": "SKALE ETH",
			"symbol": "skETH",
			"decimals": 18
		},
		"rpc": [
			"https://dev-testnet-v1-0.skalelabs.com"
		],
		"faucets": [],
		"explorers": [
			{
				"name": "Expedition",
				"url": "https://expedition.dev/?rpcUrl=https://dev-testnet-v1-0.skalelabs.com"
			}
			
		],
		"infoURL": "https://skale.network/"
	},

	{
		"slug": "nahmii",
		"name": "Nahmii",
		"chainId": 5513,
		"nativeCurrency": {
			"name": "ETH",
			"symbol": "ETH",
			"decimals": 18
		},
		"rpc": [
			"https://l2.nahmii.io"
		],
		"faucets": [],
		"explorers": [
			{
				"name": "Nahmii Explorer",
				"url": "https://explorer.testnet.nahmii.io/"
			}
			
		],
		"infoURL": "https://nahmii.io/"
	},
	{
		"slug": "nahmii-testnet",
		"name": "Nahmii Testnet",
		"chainId": 5553,
		"nativeCurrency": {
			"name": "ETH",
			"symbol": "ETH",
			"decimals": 18
		},
		"rpc": [
			"https://l2.testnet.nahmii.io"
		],
		"faucets": [],
		"explorers": [
			{
				"name": "Nahmii Explorer",
				"url": "https://explorer.testnet.nahmii.io/"
			}
			
		],
		"infoURL": "https://nahmii.io/"
	},

	{
		"slug": "nervos-godwoken",
		"name": "Nervos Godwoken Testnet",
		"chainId": 71393,
		"nativeCurrency": {
			"name": "ETH",
			"symbol": "ETH",
			"decimals": 18
		},
		"rpc": [
			"https://godwoken-testnet-web3-rpc.ckbapp.dev/"
		],
		"faucets": [],
		"explorers": [
			{
				"name": "GwScan",
				"url": "https://www.gwscan.com/"
			}
			
		],
		"infoURL": "https://github.com/nervosnetwork/godwoken"
	},

	{
		"slug": "arbitrum",
		"name": "Arbitrum",
		"chainId": 42161,
		"nativeCurrency": {
			"name": "ETH",
			"symbol": "ETH",
			"decimals": 18
		},
		"rpc": [
			"https://arb1.arbitrum.io/rpc"
		],
		"faucets": [],
		"explorers": [
		],
	},
	{
		"slug": "arbitrum-rinkeby",
		"name": "Arbitrum Rinkeby",
		"chainId": 421611,
		"nativeCurrency": {
			"name": "ETH",
			"symbol": "ETH",
			"decimals": 18
		},
		"rpc": [
			"https://rinkeby.arbitrum.io/rpc"
		],
		"faucets": [],
		"explorers": [
		],
	},

	{
		"slug": "reef",
		"name": "Reef",
		"chainId": 13939,
		"nativeCurrency": {
			"name": "REEF",
			"symbol": "REEF",
			"decimals": 18
		},
		"rpc": [
			"https://rpc.reefscan.com"
		],
		"faucets": [],
		"explorers": [
		],
	},
	{
		"slug": "reef-testnet",
		"name": "Reef Testnet",
		"chainId": 13939, // Yes the chainID is same prod vs test
		"nativeCurrency": {
			"name": "REEF",
			"symbol": "REEF",
			"decimals": 18
		},
		"rpc": [
			"https://rpc-testnet.reefscan.com"
		],
		"faucets": [],
		"explorers": [
		],
	},
]


export const networksByChainID: Record<string, Network> = {}
for(const network of networks)
	networksByChainID[network.chainId] = network

export const networksBySlug: Record<string, Network> = {}
for(const network of networks)
	networksBySlug[network.slug] = network


const testnetSlugsForMainnetSlugs = {
	'ethereum': [
		'ethereum-kovan',
		'ethereum-rinkeby',
		'ethereum-ropsten',
		'ethereum-goerli',
	],
	'polygon': [
		'polygon-mumbai',
	],
	'avalanche': [
		'avalanche-fuji',
	],
	'celo': [
		'celo-alfajores',
		'celo-baklava',
	],
	'nahmii': [
		'nahmii-testnet',
	],
	'metis': [
		'metis-stardust',
	],
	'arbitrum': [
		'arbitrum-rinkeby',
	],
	'reef': [
		'reef-testnet',
	],
	'skale': [
		'skale-testnet',
	],
	'aurora': [
		'aurora-testnet',
	],
	'nervos': [
		'nervos-godwoken',
	]
}

export const testnetsForMainnets = Object.fromEntries<Network[]>(
	Object.entries(testnetSlugsForMainnetSlugs).map(([mainnetSlug, testnetSlugs]) =>
		[mainnetSlug, testnetSlugs.map(slug => networksBySlug[slug])]
	)
)

export const mainnetForTestnet = Object.fromEntries(
	Object.entries(testnetSlugsForMainnetSlugs).flatMap(([mainnetSlug, testnetSlugs]) =>
		testnetSlugs.map(slug => [slug, networksBySlug[mainnetSlug]])
	)
)

export const testnetNetworks = Object.values(testnetsForMainnets).flat()

export function isTestnet(network: Network){
	return network.network?.includes('test')
		|| network.slug?.includes('testnet')
		|| network.name?.toLowerCase().includes('testnet')
		|| testnetNetworks.includes(network)
}




export const availableNetworks = [
	"ethereum",
	"ethereum-ropsten",
	"ethereum-rinkeby",
	"ethereum-goerli",
	"polygon-mumbai",
	// "avalanche-fuji",
	"celo-alfajores",
	"metis-stardust",
	"aurora-testnet",
	"harmony-shard0",
	"harmony-shard1",
	"skale-testnet",
	"nahmii-testnet",
	"nervos-godwoken",
	"arbitrum-rinkeby",
	"reef-testnet"
].map(slug => networksBySlug[slug])


import arbitrumIcon from '../assets/networks/arbitrum.svg'
import auroraIcon from '../assets/networks/aurora.svg'
import avalancheIcon from '../assets/networks/avalanche.svg'
import celoIcon from '../assets/networks/celo.svg'
import ethereumIcon from '../assets/networks/ethereum.svg'
import harmonyIcon from '../assets/networks/harmony.svg'
import metisIcon from '../assets/networks/metis.png'
import nahmiiIcon from '../assets/networks/nahmii.svg'
import nervosIcon from '../assets/networks/nervos.svg'
import polygonIcon from '../assets/networks/polygon.svg'
import reefIcon from '../assets/networks/reef.svg'
import skaleIcon from '../assets/networks/skale.svg'

const networkSlugToIcon: Record<string, string> = {
	'arbitrum': arbitrumIcon,
	'aurora': auroraIcon,
	'avalanche': avalancheIcon,
	'celo': celoIcon,
	'ethereum': ethereumIcon,
	'harmony-shard0': harmonyIcon,
	'harmony-shard1': harmonyIcon,
	'metis': metisIcon,
	'nahmii-testnet': nahmiiIcon,
	'nervos-godwoken': nervosIcon,
	'polygon': polygonIcon,
	'reef': reefIcon,
	'skale-testnet': skaleIcon,
}
export const networkIcons: Record<string, string> = Object.fromEntries(networks.map(({ slug, chainId }) => [chainId, networkSlugToIcon[slug] ?? networkSlugToIcon[mainnetForTestnet[slug]?.slug]]))

export const vaultAssetsByNetwork: Record<string, ERC20Token[]> = {
	"ethereum": [],
	"ethereum-ropsten": [],
	"ethereum-rinkeby": [],
	"ethereum-goerli": [],
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

	'ethereum': [{"chainId":1,"address":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48","name":"USD Coin","symbol":"USDC","decimals":6,"icon":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"}],
	'ethereum-rinkeby': [{"chainId":4,"address":"0xeb8f08a975ab53e34d8a0330e0d34de942c95926","name":"USD Coin","symbol":"USDC","decimals":6,"icon":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"}],
	'polygon': [{"chainId":137,"address":"0xeb8f08a975ab53e34d8a0330e0d34de942c95926","name":"USD Coin","symbol":"USDC","decimals":6,"icon":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"}],
	'polygon-mumbai': [{"chainId":80001,"address":"0xe6b8a5cf854791412c1f6efc7caf629f5df1c747","name":"USD Coin","symbol":"USDC","decimals":6,"icon":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"}],
	'avalanche-fuji': [{"chainId":43113,"address":"0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160","name":"USD Coin","symbol":"USDC","decimals":6,"icon":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"}],
	'avalanche': [{"chainId":43114,"address":"0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664","name":"USD Coin","symbol":"USDC","decimals":6,"icon":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"}],
	'celo': [{"chainId":42220,"address":"0x765DE816845861e75A25fCA122bb6898B8B1282a","name":"Celo Dollar","symbol":"cUSD","decimals":18,"icon":"https://s2.coinmarketcap.com/static/img/coins/64x64/7236.png"}],
	'celo-alfajores': [{"chainId":44787,"address":"0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1","name":"Celo Dollar","symbol":"cUSD","decimals":18,"icon":"https://s2.coinmarketcap.com/static/img/coins/64x64/7236.png"}],
	'metis': [{"chainId":1088,"address":"0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160","name":"USD Coin","symbol":"USDC","decimals":6,"icon":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"}],
	'metis-stardust': [{"chainId":588,"address":"0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664","name":"USD Coin","symbol":"USDC","decimals":6,"icon":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389"}],
}
