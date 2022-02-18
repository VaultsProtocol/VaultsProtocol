import type { ChainID } from '$lib/networks'
import { BigNumber } from 'ethers'
import type { ERC20Token } from './tokens'


export enum VaultType {
	Standard = 'Standard',
	Degen = 'Degen',
	DAO = 'DAO',
	Charity = 'Charity',
	Superfluid = 'Superfluid',
}

export const vaultTypeInfo = {
	[VaultType.Standard]: {
		label: '🏦 Standard',
		description: 'Contribute to the vault and receive a yield-bearing position NFT. Withdraw anytime.'
	},
	[VaultType.Degen]: {
		label: '🐸 Degen Game',
		description: 'The crowdfund ends if a contribution is not made after a set interval of time. The last person to contribute wins the Jackpot allocation.'
	},
	[VaultType.Charity]: {
		label: '🎁 No-Loss Charity',
		description: 'The funds'
	},
	[VaultType.Superfluid]: {
		label: '🦈 Superfluid',
		description: 'Stream Superfluid super-tokens into the vault at a specified rate. Dividends are streamed to all past contributors'
	},
	[VaultType.DAO]: {
		label: '🗳 DAO',
		description: ''
	}
}

export enum YieldStrategy {
	None = 'None',
	Aave = 'Aave',
	Yearn = 'Yearn',
}
export const yieldStrategyInfo = {
	[YieldStrategy.None]: {
		label: '🚫 None',
		description: 'The DAO treasury.'
	},
	[YieldStrategy.Aave]: {
		label: '👻 Aave Yield-Bearing Vault',
		description: 'The DAO treasury will be lent to borrowers on Aave. Interest will be paid out to holders.'
	},
	[YieldStrategy.Yearn]: {
		label: '🏦 Yearn Yield-Bearing Vault',
		description: 'The DAO treasury will be deposited into a Yearn vault. Yield will be paid out to holders.'
	},
}

// export enum GovernanceStrategy {
// 	None = 'None',
// 	Vote = 'Vote',
// }
// export const governanceStrategyInfo = {
// 	[GovernanceStrategy.None]: {
// 		label: '🚫 None',
// 		description: 'Stakeholders can withdraw their share from the vault at any time.'
// 	},
// 	[GovernanceStrategy.Vote]: {
// 		label: '🗳 Vote',
// 		description: 'Stakeholders must vote to approve changes to yield strategies or send funds out of the vault.'
// 	},
// }

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

			}
		: T extends VaultType.Charity ?
			{

			}
		: T extends VaultType.Superfluid ?
			{

			}
		: {}
	yieldStrategy: YieldStrategy
	// governanceStrategy: GovernanceStrategy
}

export const getDefaultVaultConfig = () => ({
	about: {
		name: '',
		description: '',
		website: '',
		twitter: '',
		discord: '',
	},
	chainId: 1,
	tokens: [],
	type: undefined,
	config: {
		// VaultType.Degen
		jackpot: 20,
		dividend: 30,
		treasury: 50,
		deadline: 3600,
		initialLiquidity: {
			contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
			amount: BigNumber.from(0)
		}

		// VaultType.DAO
		// VaultType.Charity
		// VaultType.Superfluid
		
	},
	yieldStrategy: YieldStrategy.Aave,
	// governanceStrategy: GovernanceStrategy.None,
} as VaultConfig)


export type VaultPosition = {
	withdrawableBalance: BigNumber
	yieldEarned: BigNumber
}


export enum MetadataType {
	TokenBalance = 'TokenBalance',
	Date = 'Date'
}