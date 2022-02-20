// import BaseVault from '$lib/contracts/BaseVault.sol/BaseVault.json'
// import BasicMetaTransaction from '$lib/contracts/BasicMetaTransaction.sol/BasicMetaTransaction.json'
// import CharityVault from '$lib/contracts/CharityVault.sol/CharityVault.json'
// import DaoVault from '$lib/contracts/DaoVault.sol/DaoVault.json'
// import DegenVault from '$lib/contracts/DegenVault.sol/DegenVault.json'
// import SuperFluidVault from '$lib/contracts/SuperFluidVault.sol/SuperFluidVault.json'
import VaultFactory from '$lib/contracts/VaultFactory.sol/DAOFactory.json'


export const contracts = {
	// BaseVault,
	// BasicMetaTransaction,
	// CharityVault,
	// DaoVault,
	// DegenVault,
	// SuperFluidVault,
	VaultFactory
}


import type { Network } from './networks'
import { Contract } from 'ethers'

import contractDeployments from './contracts.json'

export const getContract = ({
	provider,
	network,
	name
}: {
	provider: Provider,
	network: Network,
	name: keyof typeof contracts
}) => {
	const contractsForNetwork = contractDeployments[network.slug]

	if(!contractsForNetwork)
		throw new Error(`All-Your-Vault isn't yet deployed to ${network.name}.`)

	return new Contract(
		contractsForNetwork.VaultFactory,
		contracts.VaultFactory.abi,
		provider
	)
}
