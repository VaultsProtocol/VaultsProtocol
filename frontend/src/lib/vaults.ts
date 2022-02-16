import type { ChainID } from '$lib/networks'
import { BigNumber } from 'ethers'


export enum VaultType {
	Degen = 'Degen',
	DAO = 'DAO',
	Charity = 'Charity',
	Superfluid = 'Superfluid',
}

export const vaultTypeInfo = {
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
		label: '👻 Aave',
		description: 'The DAO treasury will be lent to borrowers on Aave. Interest will be paid out to holders.'
	},
	[YieldStrategy.Yearn]: {
		label: '🏦 Yearn',
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

export type VaultConfig = {
	about: {
		name: string
		description: string
		website: string
		twitter: string
		discord: string
	},
	chainId: ChainID,
	type: VaultType
	fundingAllocation: {
		jackpot: number
		dividend: number
		treasury: number
		deadline: number
	}
	yieldStrategy: YieldStrategy
	// governanceStrategy: GovernanceStrategy
	initialLiquidity: ERC20TokenAndAmount
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
	type: VaultType.Degen,
	fundingAllocation: {
		jackpot: 20,
		dividend: 30,
		treasury: 50,
		deadline: 3600
	},
	yieldStrategy: YieldStrategy.Aave,
	// governanceStrategy: GovernanceStrategy.None,
	initialLiquidity: {
		contractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
		amount: BigNumber.from(0)
	}
} as VaultConfig)