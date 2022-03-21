import type { Network } from './networks'
import { type VaultConfig, type VaultStatus, YieldStrategy } from './vaultConfig'
import type { Signer } from 'ethers'
import type { Provider } from '@ethersproject/providers'


import { getDeployedContract, getContractBytecode, VaultFactory__factory, getDeployedContractAddress } from './contracts'
import { utils } from 'ethers'
import { BaseVault__factory } from './contracts'
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
	// const vaultFactory = getDeployedContract({
	// 	name: 'VaultFactory',
	// 	network,
	// 	signer,
	// })
	const vaultFactory = VaultFactory__factory.connect(
		getDeployedContractAddress({ network, name: 'VaultFactory' }),
		signer
	)

	console.log("Deploying sample vault")

	const strategyContractName = {
		[YieldStrategy.Aave]: 'AaveStrategy',
		[YieldStrategy.Yearn]: 'YearnStrategy',
	}[vaultConfig.yieldStrategy]

	return await vaultFactory.createVault(
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
	// const baseVault = getDeployedContract({
	// 	name: 'BaseVault',
	// 	contractAddress,
	// 	network,
	// 	provider,
	// })
	const baseVault = BaseVault__factory.connect(
		contractAddress,
		provider,
	)

	const metadata = await baseVault.tokenURI(0)
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
	// const baseVault = getDeployedContract<BaseVault__factory>({
	// 	name: 'BaseVault',
	// 	contractAddress,
	// 	network,
	// 	provider,
	// })
	const baseVault = BaseVault__factory.connect(
		contractAddress,
		provider,
	)

	return {
		balance: await baseVault.withdrawableById(tokenId),
		yieldEarned: await baseVault.yieldPerId(tokenId),
	}
}
