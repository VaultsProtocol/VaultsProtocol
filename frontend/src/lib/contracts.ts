import VaultFactory from '$lib/contracts/artifacts/VaultFactory.json'

import BaseVault from '$lib/contracts/artifacts/BaseVault.json'
import CharityVault from '$lib/contracts/artifacts/CharityVault.json'
import DaoVault from '$lib/contracts/artifacts/DaoVault.json'
import DegenVault from '$lib/contracts/artifacts/DegenVault.json'
// import SuperFluidVault from '$lib/contracts/artifacts/SuperFluidVault.json'

import AaveStrategy from '$lib/contracts/artifacts/AaveStrategy.json'
import YearnStrategy from '$lib/contracts/artifacts/YearnStrategy.json'

import BasicMetaTransaction from '$lib/contracts/artifacts/BasicMetaTransaction.json'

const contractArtifacts = {
	VaultFactory,

	BaseVault,
	CharityVault,
	DaoVault,
	DegenVault,
	// SuperFluidVault,

	AaveStrategy,
	YearnStrategy,

	BasicMetaTransaction,
}


import {
	VaultFactory__factory,

	BaseVault__factory,
	CharityVault__factory,
	DaoVault__factory,
	DegenVault__factory,
	// SuperFluidVault__factory,

	AaveStrategy__factory,
	YearnStrategy__factory,

	BasicMetaTransaction__factory,
} from '$lib/contracts/index'

const contractsFactories = {
	'VaultFactory': VaultFactory__factory,

	'BaseVault': BaseVault__factory,
	'CharityVault': CharityVault__factory,
	'DaoVault': DaoVault__factory,
	'DegenVault': DegenVault__factory,
	// 'SuperFluidVault': SuperFluidVault__factory,

	'AaveStrategy': AaveStrategy__factory,
	'YearnStrategy': YearnStrategy__factory,

	'BasicMetaTransaction': BasicMetaTransaction__factory,
}


import type { Network } from './networks'
import type { Provider } from '@ethersproject/providers'
// import { Contract, ContractFactory, getDefaultProvider, type Signer } from 'ethers' // Using Hardhat artifacts
import type { Signer } from 'ethers' // Using Typechain

import contractDeployments from './contracts.json'

export const getContract = ({
	name,
	contractAddress,
	network,
	signer,
	provider,
}: {
	// name: keyof typeof contractArtifacts, // Using Hardhat artifacts
	name: keyof typeof contractsFactories, // Using Typechain
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
		// Using Hardhat artifacts
		// return new Contract(
		// 	contractAddress,
		// 	contractArtifacts[name].abi,
		// 	signer || provider
		// )

		// Using Typechain
		return contractsFactories[name].connect(
			contractAddress,
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
	name: keyof typeof contractArtifacts
}) => {
	const contractsForNetwork = contractDeployments[network.slug]

	if(!contractsForNetwork)
		throw new Error(`Vaults Protocol isn't yet deployed to ${network.name}.`)

	return contractArtifacts[name].bytecode
}
