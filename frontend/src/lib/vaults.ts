import { vaultAssetsByNetwork, type ChainID } from '$lib/networks'
import { BigNumber } from 'ethers'
import { type ERC20Token, erc20TokensBySymbol } from './tokens'


export enum VaultType {
	Standard = 'Standard',
	Charity = 'Charity',
	DAO = 'DAO',
	Degen = 'Degen',
	// Superfluid = 'Superfluid',
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
		description: 'A portion of the yield is set aside for a designated recipient to be claimed at any time.'
	},
	// [VaultType.Superfluid]: {
	// 	label: '🦈 Superfluid',
	// 	description: 'Stream Superfluid super-tokens into the vault at a specified rate. Dividends are streamed to all past contributors'
	// },
	[VaultType.DAO]: {
		label: '🗳 DAO',
		description: 'The vault parameters can be changed upon the approval of multiple designated signers or by a token-weighted vote by all holdersapproval.'
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


export enum GovernanceType {
	MultiSignature = 'Multi-Signature',
	TokenVoting = 'Token Voting',
}
export const governanceTypeInfo = {
	[GovernanceType.MultiSignature]: {
		label: '✍️ Multi-Signature',
		description: 'Multiple signatures from a pre-approved list of addresses are required to approve changes to the vault parameters.'
	},
	[GovernanceType.TokenVoting]: {
		label: '🗳 Token Voting',
		description: 'Stakeholders cast votes weighted proportional to their vault contribution to approve or deny changes to the vault parameters.'
	},
}


export enum PayoutType {
	Once = 'Once',
	Superfluid = 'Superfluid',
}
export const payoutTypeInfo = {
	[PayoutType.Once]: {
		label: '💸 Once',
		description: 'The recipient\'s payout accrues over time; anyone can trigger the claim transaction.'
	},
	[PayoutType.Superfluid]: {
		label: '🌊 Superfluid',
		description: 'The payout is autmatically streamed to the recipient as Superfluid super tokens. The recipient can redeem their funds by unwrapping their super tokens.'
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

export const getDefaultVaultConfig = (typę: VaultType) => ({
	about: {
		name: '',
		description: '',
		website: '',
		twitter: '',
		discord: '',
	},
	chainId: 1,
	tokens: vaultAssetsByNetwork['ethereum'],
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
	yieldStrategy: YieldStrategy.Aave,
	// governanceStrategy: GovernanceStrategy.None,
} as VaultConfig)


export type VaultStatus = {
	tokenId: number
	totalBalance: BigNumber
	endTimestamp: number
}


export type VaultPosition = {
	balance: BigNumber
	yieldEarned: BigNumber
}


export enum MetadataType {
	TokenBalance = 'TokenBalance',
	Date = 'Date',
	String = 'String'
}