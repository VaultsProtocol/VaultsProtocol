import type { Network } from './networks'
import type { VaultConfig } from './vaultConfig'
import type { Signer } from 'ethers'


import { getContract, getContractBytecode } from './contracts'
import { AbiCoder } from 'ethers/lib/utils'


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
		signer,
		network,
		name: 'VaultFactory'
	})

	console.log('VaultFactory', VaultFactory)

	console.log("Deploying sample vault")

	console.log(
		// getContractBytecode({ network, name: 'BaseVault' }),
		// getContractBytecode({ network, name: 'YearnStrategy' }),
		vaultConfig.tokens[0].address,
		new AbiCoder().encode(
			["address", "string", "string"],
			[vaultConfig.tokens[0].address, vaultConfig.about.name, vaultConfig.about.tickerSymbol ?? 'TEST'],
		),
		{
			gasLimit: '3500000'
		}
	)

	return await VaultFactory.createVault(
		getContractBytecode({ network, name: 'BaseVault' }),
		getContractBytecode({ network, name: 'YearnStrategy' }),
		vaultConfig.tokens[0].address,
		address,
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
