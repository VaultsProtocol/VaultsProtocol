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
		"slug": "ethereum-goerli",
		"name": "Ethereum Görli Testnet",
		"chainId": 5,
		"shortName": "gor",
		"chain": "ETH",
		"network": "goerli",
		"networkId": 5,
		"nativeCurrency": {
			"name": "Görli Ether",
			"symbol": "GOR",
			"decimals": 18
		},
		"rpc": [
			"https://rpc.goerli.mudit.blog/",
			"https://rpc.slock.it/goerli ",
			"https://goerli.prylabs.net/"
		],
		"faucets": [
			"https://goerli-faucet.slock.it/?address=${ADDRESS}",
			"https://faucet.goerli.mudit.blog"
		],
		"explorers": [],
		"infoURL": "https://goerli.net/#about",
		"ens": {
			"registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
		}
	},
	{
		"slug": "ethereum-kovan",
		"name": "Ethereum Kovan Testnet",
		"chainId": 42,
		"shortName": "kov",
		"chain": "ETH",
		"network": "kovan",
		"networkId": 42,
		"nativeCurrency": {
			"name": "Kovan Ether",
			"symbol": "KOV",
			"decimals": 18
		},
		"rpc": [
			"https://kovan.poa.network",
			"http://kovan.poa.network:8545",
			"https://kovan.infura.io/v3/${INFURA_PROJECT_ID}",
			"wss://kovan.infura.io/ws/v3/${INFURA_PROJECT_ID}",
			"ws://kovan.poa.network:8546"
		],
		"faucets": [
			"https://faucet.kovan.network",
			"https://gitter.im/kovan-testnet/faucet"
		],
		"explorers": [],
		"infoURL": "https://kovan-testnet.github.io/website"
	},
	{
		"slug": "ethereum-rinkeby",
		"name": "Ethereum Rinkeby Testnet",
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
		"slug": "ethereum-ropsten",
		"name": "Ethereum Ropsten Testnet",
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
		"slug": "celo-baklava",
		"name": "Celo Baklava Testnet",
		"chainId": 62320,
		"shortName": "BKLV",
		"chain": "CELO",
		"network": "Baklava",
		"networkId": 62320,
		"nativeCurrency": {
			"name": "CELO",
			"symbol": "CELO",
			"decimals": 18
		},
		"rpc": [
			"https://baklava-forno.celo-testnet.org"
		],
		"faucets": [
			"https://docs.google.com/forms/d/e/1FAIpQLSdfr1BwUTYepVmmvfVUDRCwALejZ-TUva2YujNpvrEmPAX2pg/viewform",
			"https://cauldron.pretoriaresearchlab.io/baklava-faucet"
		],
		"explorers": [],
		"infoURL": "https://docs.celo.org/"
	},

	{
		"slug": "metis",
		"name": "Metis",
		"chainId": 488, // 435
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
		"slug": "aurora-betanet",
		"name": "Aurora BetaNet",
		"chainId": 1313161556,
		"shortName": "aurora-betanet",
		"chain": "NEAR",
		"network": "betanet",
		"networkId": 1313161556,
		"nativeCurrency": {
			"name": "Ether",
			"symbol": "aETH",
			"decimals": 18
		},
		"rpc": [
			"https://rpc.betanet.aurora.dev:8545"
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
		"slug": "harmony-shard2",
		"name": "Harmony Shard 2",
		"chainId": 1666600002,
		"shortName": "hmy-s2",
		"chain": "Harmony",
		"network": "mainnet",
		"networkId": 1666600002,
		"nativeCurrency": {
			"name": "ONE",
			"symbol": "ONE",
			"decimals": 18
		},
		"rpc": [
			"https://s2.api.harmony.one"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://www.harmony.one/"
	},
	{
		"slug": "harmony-shard3",
		"name": "Harmony Shard 3",
		"chainId": 1666600003,
		"shortName": "hmy-s3",
		"chain": "Harmony",
		"network": "mainnet",
		"networkId": 1666600003,
		"nativeCurrency": {
			"name": "ONE",
			"symbol": "ONE",
			"decimals": 18
		},
		"rpc": [
			"https://s3.api.harmony.one"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://www.harmony.one/"
	},
	{
		"slug": "harmony-testnet-shard0",
		"name": "Harmony Testnet Shard 0",
		"chainId": 1666700000,
		"shortName": "hmy-b-s0",
		"chain": "Harmony",
		"network": "testnet",
		"networkId": 1666700000,
		"nativeCurrency": {
			"name": "ONE",
			"symbol": "ONE",
			"decimals": 18
		},
		"rpc": [
			"https://api.s0.b.hmny.io"
		],
		"faucets": [
			"https://faucet.pops.one"
		],
		"explorers": [
			{
				"name": "Harmony Testnet Block Explorer",
				"url": "https://explorer.pops.one",
				"standard": "EIP3091"
			}
		],
		"infoURL": "https://www.harmony.one/"
	},
	{
		"slug": "harmony-testnet-shard1",
		"name": "Harmony Testnet Shard 1",
		"chainId": 1666700001,
		"shortName": "hmy-b-s1",
		"chain": "Harmony",
		"network": "testnet",
		"networkId": 1666700001,
		"nativeCurrency": {
			"name": "ONE",
			"symbol": "ONE",
			"decimals": 18
		},
		"rpc": [
			"https://api.s1.b.hmny.io"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://www.harmony.one/"
	},
	{
		"slug": "harmony-testnet-shard2",
		"name": "Harmony Testnet Shard 2",
		"chainId": 1666700002,
		"shortName": "hmy-b-s2",
		"chain": "Harmony",
		"network": "testnet",
		"networkId": 1666700002,
		"nativeCurrency": {
			"name": "ONE",
			"symbol": "ONE",
			"decimals": 18
		},
		"rpc": [
			"https://api.s2.b.hmny.io"
		],
		"faucets": [],
		"explorers": [],
		"infoURL": "https://www.harmony.one/"
	},
	{
		"slug": "harmony-testnet-shard3",
		"name": "Harmony Testnet Shard 3",
		"chainId": 1666700003,
		"shortName": "hmy-b-s3",
		"chain": "Harmony",
		"network": "testnet",
		"networkId": 1666700003,
		"nativeCurrency": {
			"name": "ONE",
			"symbol": "ONE",
			"decimals": 18
		},
		"rpc": [
			"https://api.s3.b.hmny.io"
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
		"slug": "nervos-godwoken-testnet",
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
]


export const networksByChainID: Record<string, Network> = {}
for(const network of networks)
	networksByChainID[network.chainId] = network

export const networksBySlug: Record<string, Network> = {}
for(const network of networks)
	networksBySlug[network.slug] = network


export const testnetsForMainnets = Object.fromEntries<Network[]>(
	Object.entries({
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
		]
	}).map(([mainnetSlug, testnetSlugs]) =>
		[mainnetSlug, testnetSlugs.map(slug => networksBySlug[slug])]
	)
)

export const testnetNetworks = Object.values(testnetsForMainnets).flat()

export function isTestnet(network: Network){
	return network.network?.includes('test')
		|| network.slug?.includes('testnet')
		|| network.name?.toLowerCase().includes('testnet')
		|| testnetNetworks.includes(network)
}
