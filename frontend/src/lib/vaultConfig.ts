import { availableNetworks, networksByChainID, networksBySlug, vaultAssetsByNetwork, type ChainID } from '$lib/networks'
import { BigNumber } from 'ethers'
import { type ERC20Token, erc20TokensBySymbol } from './tokens'


import aaveIcon from '../assets/dapps/aave.svg'
import balancerIcon from '../assets/dapps/balancer.svg'
import elementfiIcon from '../assets/dapps/elementfi.svg'
import superfluidIcon from '../assets/dapps/superfluid.svg'
import truefiIcon from '../assets/dapps/truefi.svg'
import yearnIcon from '../assets/dapps/yearn.svg'


import { random } from './random'


export enum VaultType {
	Standard = 'Standard',
	Charity = 'Charity',
	DAO = 'DAO',
	Degen = 'Degen',
	// Superfluid = 'Superfluid',
}

export const vaultTypeInfo = {
	[VaultType.Standard]: {
		label: '🏦\tStandard',
		description: 'Contribute ERC-20 tokens to the vault to mint an NFT that earns you passive yield proportional to the total value locked in the vault. You can adjust your position, send/trade the NFT, or withdraw the original tokens by burning the NFT.',
		color: 'var(--background-color-standard)'
	},
	[VaultType.Charity]: {
		label: '🎁\tNo-Loss Charity',
		description: 'An extension of the Standard Vault. A portion of all the earned yield is set aside for a designated recipient to be claimed at any time.',
		color: 'var(--background-color-charity)'
	},
	// [VaultType.Superfluid]: {
	// 	label: '🦈\tSuperfluid',
	// 	description: 'Stream Superfluid super-tokens into the vault at a specified rate. Dividends are streamed to all past contributors'
	// },
	[VaultType.DAO]: {
		label: '🗳\tDAO',
		description: 'An extension of the Standard Vault. The vault parameters can be changed upon the approval of multiple designated signers or by a delegated token-weighted vote amongst the vault’s position holders.',
		// description: 'Democratized capital control via delegatable weighted voting or multi-sig',
		color: 'var(--background-color-DAO)'
	},
	[VaultType.Degen]: {
		label: '🐸\tDegen Game',
		description: 'The ultimate ponzi war! When someone makes a contribution, a Dividend is distributed to all past contributors, and a timer is reset to a pre-defined time interval. When the timer runs out, the vault stops accepting contributions, and the last person to contribute wins the Jackpot allocation instantly.',
		color: 'var(--background-color-degen)'
	},
}

export enum YieldStrategy {
	None = 'None',
	Aave = 'Aave',
	Balancer = 'Balancer',
	ElementFi = 'ElementFi',
	TrueFi = 'TrueFi',
	Yearn = 'Yearn',
}
export const yieldStrategyInfo = {
	[YieldStrategy.None]: {
		label: '🚫\tNone',
		description: 'Tokens in the vault don\'t earn any yield.'
	},
	[YieldStrategy.Aave]: {
		icon: aaveIcon,
		label: 'Aave',
		description: 'Tokens in the vault are lent to borrowers on Aave. Interest will be paid out to holders.'
	},
	[YieldStrategy.Balancer]: {
		icon: balancerIcon,
		label: 'Balancer',
		description: 'Tokens in the vault are deposited into a corresponding "boosted" weighted linear pool on Balancer. Yield and trading fees will be paid out to holders.'
	},
	[YieldStrategy.ElementFi]: {
		icon: elementfiIcon,
		label: 'ElementFi',
		description: 'Tokens in the vault are locked in a fixed-rate yield generating position on ElementFi. Interest from Yield Tokens will be paid out to holders when the term ends.'
	},
	[YieldStrategy.TrueFi]: {
		icon: truefiIcon,
		label: 'TrueFi',
		description: 'The DAO treasury will be lent to borrowers on the TrueFi Lending Marketplace. Yield will be paid out to holders.'
	},
	[YieldStrategy.Yearn]: {
		icon: yearnIcon,
		label: 'Yearn Finance',
		description: 'The DAO treasury will be deposited into a Yearn vault. Yield will be paid out to holders.'
	},
}

// export enum GovernanceStrategy {
// 	None = 'None',
// 	Vote = 'Vote',
// }
// export const governanceStrategyInfo = {
// 	[GovernanceStrategy.None]: {
// 		label: '🚫\tNone',
// 		description: 'Stakeholders can withdraw their share from the vault at any time.'
// 	},
// 	[GovernanceStrategy.Vote]: {
// 		label: '🗳\tVote',
// 		description: 'Stakeholders must vote to approve changes to yield strategies or send funds out of the vault.'
// 	},
// }


export enum GovernanceType {
	MultiSignature = 'Multi-Signature',
	TokenVoting = 'Community Voting',
}
export const governanceTypeInfo = {
	[GovernanceType.MultiSignature]: {
		label: '✍️\tMulti-Signature',
		description: 'Multiple signatures from a pre-approved list of addresses are required to manage DAO funds and approve changes to the vault parameters.'
	},
	[GovernanceType.TokenVoting]: {
		label: '🗳\tCommunity Voting',
		description: 'Stakeholders cast or delegate votes weighted proportionally to their vault contribution to manage DAO funds and approve or deny changes to the vault parameters.'
	},
}


export enum PayoutType {
	Once = 'Once',
	Superfluid = 'Superfluid',
}
export const payoutTypeInfo = {
	[PayoutType.Once]: {
		label: '💸\tOnce',
		description: 'The recipient is paid their accrued yield instantly whenever anyone triggers the claim transaction.'
	},
	[PayoutType.Superfluid]: {
		icon: superfluidIcon,
		label: 'Superfluid',
		description: 'The yield is streamed to the recipient in real time in the form of Superfluid Super Tokens. The recipient can redeem the ERC-20 tokens by unwrapping the Super Tokens.'
	},
}


type ERC20TokenAndAmount = {
	contractAddress: string
	amount: BigNumber
}

export type VaultConfig<T extends VaultType> = {
	about: {
		name: string
		description: string
		website: string
		twitter: string
		discord: string
	},
	chainId: ChainID
	tokens: ERC20Token[]
	type: T
	config:
		T extends VaultType.Degen ?
			{
				jackpot: number
				dividend: number
				treasury: number
				deadline: number
				initialLiquidity: ERC20TokenAndAmount
			}
		: T extends VaultType.DAO ?
			{
				governanceType: GovernanceType.MultiSignature,
				signers: string[],
				minimumSignatures: number
			}
			| {
				governanceType: GovernanceType.TokenVoting,
				quorum: number,
			}
		: T extends VaultType.Charity ?
			{
				payoutType: PayoutType.Once,
				recipientAddress: string,
				recipientYieldPercent: number
			}
			| {
				payoutType: PayoutType.Superfluid,
				payoutRate: number
			}
		: {}
	yieldStrategy: YieldStrategy
	// governanceStrategy: GovernanceStrategy
}

export const getDefaultVaultConfig = (type?: VaultType) => ({
	about: {
		name: '',//random(['My Test Vault']),
		description: '',
		website: '',
		twitter: '',
		discord: '',
	},
	chainId: networksBySlug['ethereum-rinkeby'].chainId,
	tokens: [],
	type,
	config: {
		// VaultType.Degen
		jackpot: 20,
		dividend: 30,
		treasury: 50,
		deadline: 3600,
		initialLiquidity: {
			contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			amount: BigNumber.from(0)
		},

		// VaultType.DAO
		governanceType: GovernanceType.MultiSignature,
		signers: [],
		minimumSignatures: 2,
		quorum: 50,

		// VaultType.Charity
		payoutType: PayoutType.Once,
		recipientAddress: '',
		recipientYieldPercent: 0,

		// payoutType === PayoutType.Superfluid,
		payoutRate: 10
	},
	yieldStrategy: YieldStrategy.None,
	// governanceStrategy: GovernanceStrategy.None,
} as VaultConfig)


export const getRandomVaultConfig = () => {
	const chainId = random(availableNetworks).chainId
	return {
		about: {
			name: random(['Vaultalik', 'Ape Chicken', 'Vaultron', 'Pool Vault', 'Vault-n-Pepper', 'LunchBox', 'VaultTogether', 'WAGMI', 'Egg', 'Vaultage', 'Vaultility', 'ApeReserve', 'Orangutan Chicken', 'Vault Me Daddy']),
			description: '',
			website: random(['', 'https://ethdenver.com']),
			twitter: random(['', 'https://twitter.com']),
			discord: random(['', 'https://discord.gg']),
		},
		chainId,
		tokens: [random(vaultAssetsByNetwork[networksByChainID[chainId].slug])],
		type: random(Object.values(VaultType)),
		config: {
			// VaultType.Degen
			jackpot: 20,
			dividend: 30,
			treasury: 50,
			deadline: Math.random() * 10000 | 0,
			initialLiquidity: {
				contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
				amount: BigNumber.from(0)
			},

			// VaultType.DAO
			governanceType: GovernanceType.MultiSignature,
			signers: [],
			minimumSignatures: 2,
			quorum: 50,

			// VaultType.Charity
			payoutType: PayoutType.Once,
			recipientAddress: '',
			recipientYieldPercent: 0,

			// payoutType === PayoutType.Superfluid,
			payoutRate: 10
		},
		yieldStrategy: YieldStrategy.None,
		// governanceStrategy: GovernanceStrategy.None,
	} as VaultConfig<any>
}


export type VaultStatus = {
	contractAddress: string
	tokenId: number
	totalBalance: BigNumber
	endTimestamp: number
}

export type VaultPosition = {
	balance: BigNumber
	yieldEarned: BigNumber
}

export type DeployedVault<T extends VaultType> = {
	vaultConfig: VaultConfig<T>,
	contractAddress: string,
	transactionHash: string,
}

export enum MetadataType {
	TokenBalance = 'TokenBalance',
	Date = 'Date',
	String = 'String',
	Percent = 'Percent',
	Address = 'Address'
}
