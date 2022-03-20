import type { Network } from './networks'
import { type VaultConfig, type VaultStatus, YieldStrategy } from './vaultConfig'
import type { Signer } from 'ethers'
import type { Provider } from '@ethersproject/providers'


import { getContract, getContractBytecode } from './contracts'
import { utils } from 'ethers'
const { AbiCoder } = utils


export const createVault = async ({
	vaultConfig,
	network,
    address,
	signer
}: {
	vaultConfig: VaultConfig<any>,
	network: Network,
    address: string,
    signer: Signer
}) => {
	const VaultFactory = getContract({
		name: 'VaultFactory',
		network,
		signer,
	})

	console.log('VaultFactory', VaultFactory)

	console.log("Deploying sample vault")

	console.log(
		// address vaultToken,
		vaultConfig.tokens[0].address,

		// address yieldVault,
		address,

		// bytes calldata _constructor
		new AbiCoder().encode(
			["address", "string", "string"],
			[vaultConfig.tokens[0].address, vaultConfig.about.name, vaultConfig.about.tickerSymbol ?? 'TEST'],
		),
	)

	const strategyContractName = {
		[YieldStrategy.Aave]: 'AaveStrategy',
		[YieldStrategy.Yearn]: 'YearnStrategy',
	}[vaultConfig.yieldStrategy]

	return await VaultFactory.createVault(
		// bytes calldata vaultCreationCode,
		getContractBytecode({ network, name: 'BaseVault' }),

		// bytes calldata strategyCreationCode,
		strategyContractName && getContractBytecode({ network, name: strategyContractName }),

		// address vaultToken,
		vaultConfig.tokens[0].address,

		// address yieldVault,
		address,

		// bytes calldata _constructor
		new AbiCoder().encode(
			["address", "string", "string"],
			[vaultConfig.tokens[0].address, vaultConfig.about.name, vaultConfig.about.tickerSymbol ?? 'TEST'],
		),

		{
			gasLimit: '3500000'
		}
	)

	// const sampleVault = await VaultFactory.vaults("0")
	// console.log("sample vault is", sampleVault)
}

export const getVaultStatus = async ({
	contractAddress,
	network,
	provider,
}: {
	contractAddress: string,
	network: Network,
	provider: Provider,
}): Promise<VaultStatus> => {
	const BaseVault = getContract({
		name: 'BaseVault',
		contractAddress,
		network,
		provider,
	})

	const metadata = await BaseVault.tokenURI(0)
	console.log('metadata', metadata)

	return {
		name: metadata.name,
		contractAddress: metadata.vaultAddress,
		totalBalance: metadata.withdrawable,
		vaultType: metadata.vaultType
	}
}

export const getVaultPosition = async ({
	contractAddress,
	network,
	provider,
	tokenId,
}) => {
	const BaseVault = getContract({
		name: 'BaseVault',
		contractAddress,
		network,
		provider,
	})

	return {
		balance: await BaseVault.withdrawableById(tokenId),
		yieldEarned: await BaseVault.yieldPerId(tokenId),
	}
}
