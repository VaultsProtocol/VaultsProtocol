import BaseVault from '$lib/contracts/BaseVault.sol/BaseVault.json'
import BasicMetaTransaction from '$lib/contracts/BasicMetaTransaction.sol/BasicMetaTransaction.json'
import CharityVault from '$lib/contracts/CharityVault.sol/CharityVault.json'
import DaoVault from '$lib/contracts/DaoVault.sol/DaoVault.json'
import DegenVault from '$lib/contracts/DegenVault.sol/DegenVault.json'
import SuperFluidVault from '$lib/contracts/SuperFluidVault.sol/SuperFluidVault.json'
import VaultFactory from '$lib/contracts/VaultFactory.sol/VaultFactory.json'
import YearnStrategy from '$lib/contracts/strategies/ExampleYearnStrat.sol/YearnStrategy.json'

export const contracts = {
	BaseVault,
	BasicMetaTransaction,
	CharityVault,
	DaoVault,
	DegenVault,
	SuperFluidVault,
	VaultFactory,
	YearnStrategy
}


import type { Network } from './networks'
import type { Provider } from '@ethersproject/providers'
import { Contract, ContractFactory, getDefaultProvider, type Signer } from 'ethers'

import contractDeployments from './contracts.json'

export const getContract = ({
	name,
	contractAddress,
	network,
	signer,
	provider,
}: {
	name: keyof typeof contracts,
	contractAddress?: string,
	network: Network,
	signer?: Signer,
	provider?: Provider,
}) => {
	if(!contractAddress){
		const contractsForNetwork = contractDeployments[network.slug]

		if(!contractsForNetwork)
			throw new Error(`Vaults Protocol isn't yet deployed to ${network.name}.`)
		
		contractAddress = contractsForNetwork[name]
	}

	// if(!contractAddress)
	// 	throw new Error(`Invalid contract address: ${contractAddress}`)

	try {
		return new Contract(
			contractAddress,
			contracts[name].abi,
			signer || provider
		)
	}catch(e){
		console.error(e)
	}

	// return new ContractFactory(
	// 	contracts[name].abi,
	// 	contracts[name].bytecode,
	// 	signer
	// ).connect(signer)
}

export const getContractBytecode = ({
	network,
	name
}: {
	network: Network,
	name: keyof typeof contracts
}) => {
	const contractsForNetwork = contractDeployments[network.slug]

	if(!contractsForNetwork)
		throw new Error(`Vaults Protocol isn't yet deployed to ${network.name}.`)

	return contracts[name].bytecode
}
