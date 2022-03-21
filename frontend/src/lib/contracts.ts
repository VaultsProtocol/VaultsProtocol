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
} as const


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

export * from '$lib/contracts/index'

const contractsFactories = {
// const contractsFactories: Record<string, { connect(address: string, signerOrProvider: Signer | Provider)}> = {
	'VaultFactory': VaultFactory__factory,

	'BaseVault': BaseVault__factory,
	'CharityVault': CharityVault__factory,
	'DaoVault': DaoVault__factory,
	'DegenVault': DegenVault__factory,
	// 'SuperFluidVault': SuperFluidVault__factory,

	'AaveStrategy': AaveStrategy__factory,
	'YearnStrategy': YearnStrategy__factory,

	'BasicMetaTransaction': BasicMetaTransaction__factory,
} as const


import type { Network } from './networks'
import type { Provider } from '@ethersproject/providers'
// import { Contract, ContractFactory, getDefaultProvider, type Signer } from 'ethers' // Using Hardhat artifacts
import type { ContractFactory, Signer } from 'ethers' // Using Typechain

import contractDeployments from './contracts.json'

export const getDeployedContractAddress = <T extends keyof typeof contractsFactories>({
	network,
	name
}: {
	network: Network,
	name: T
}) => {
	const contractsForNetwork = contractDeployments[network.slug]

	if (!contractsForNetwork)
		throw new Error(`Vaults Protocol isn't yet deployed to ${network.name}.`)

	return contractsForNetwork[name]
}


export const getDeployedContract = <T extends keyof typeof contractsFactories>({
// export const getDeployedContract = <T extends keyof typeof contractsFactories, U extends { new(): ContractFactory }>({
// export const getDeployedContract = <
// 	T extends keyof typeof contractsFactories,
// 	U extends { connect(address: string, signerOrProvider: Signer | Provider): V },
// 	V
// >({
	name,
	contractFactory,
	contractAddress,
	network,
	signer,
	provider,
}: {
	// name: keyof typeof contractArtifacts, // Using Hardhat artifacts
	name?: T, // Using Typechain
	// contractFactory?: U,
	contractFactory?: typeof contractsFactories[keyof typeof contractsFactories],
	contractAddress?: string,
	network: Network,
	signer?: Signer,
	provider?: Provider,
// }): V => {
}) => {
	contractAddress ||= getDeployedContractAddress({
		network,
		name
	})

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
		// return (contractFactory || contractsFactories[name])
		return contractsFactories[name]
			.connect(
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


// Using Hardhat artifacts
// export const getContractBytecode = ({
// 	network,
// 	name
// }: {
// 	network: Network,
// 	name: keyof typeof contractArtifacts
// }) => {
// 	const contractsForNetwork = contractDeployments[network.slug]

// 	if(!contractsForNetwork)
// 		throw new Error(`Vaults Protocol isn't yet deployed to ${network.name}.`)

// 	return contractArtifacts[name].bytecode
// }

// Using Typechain
export const getContractBytecode = ({
	network,
	name
}: {
	network: Network,
	name: keyof typeof contractsFactories
}) =>
	contractsFactories[name].bytecode
