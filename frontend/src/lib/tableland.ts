import type { Signer } from 'ethers'
import type { Connection } from '@tableland/sdk'
import { connect } from '@tableland/sdk'


export const mintTable = async (tableConnection, query, options) => {
	const dryRunReceipt = await tableConnection.create(query, options)
	console.log('dryRunReceipt', dryRunReceipt)
	return await tableConnection.create(query, options)
}

export const queryTable = async (tableConnection, query) => {
	console.log(query)
	return await tableConnection.query(query)
}

export const getVaultsTable = async ({
	signer
}: {
	signer?: Signer,
}) => {
	const tableConnection: Connection = await connect({
		signer,
		network: 'testnet',
		host: 'https://testnet.tableland.network'
	})

	console.log('tableConnection', tableConnection)

	let tableQueryName

	const tables = await tableConnection.list()
	const table = tables[0]
	console.log('tables', tables)
	
	if(table){
		tableQueryName = table.name
	}else{
		const receipt = await mintTable(
			tableConnection,
			`
				CREATE TABLE Vaults (
					id					VARCHAR(255) PRIMARY KEY,
					chainId 			INT,
					vaultConfig 		JSON,
					contractAddress 	TEXT,
					transactionHash 	TEXT
				);
			`,
			{
				description: 'All the vaults created with Vaults Protocol.'
			}
		)
		tableQueryName = receipt.name
		console.log('receipt', receipt)
	}

	return {
		getAll: async () => await queryTable(
			tableConnection,
			`
				SELECT * FROM ${tableQueryName};		
			`
		),

		create: async ({
			vaultConfig,
			contractAddress,
			transactionHash,
		}) => await queryTable(
			tableConnection,
			`
				INSERT INTO ${tableQueryName} (
					id,
					chainId,
					vaultConfig,
					contractAddress,
					transactionHash
				) VALUES (
					${JSON.stringify(`${vaultConfig.chainId}-${contractAddress}`)},
					${Number(vaultConfig.chainId)},
					'${JSON.stringify(vaultConfig)}',
					${JSON.stringify(String(contractAddress))},
					${JSON.stringify(String(transactionHash))}
				);
			`
		)
		// '${JSON.stringify(vaultConfig).replace(/'/g, "\\'")}',
	}
}


// import type { Connection } from '@textile/tableland'
// import { connect } from '@textile/tableland'

// let table

// export const getTable = async () => {
// 	return table ||= await connect({
// 		network: 'testnet',
// 		host: 'https://testnet.tableland.network'
// 	})
// }

// export const createTable = async () => {
// 	table ||= await getTable()

// 	const createRes = await table.create(`
// 		CREATE TABLE Vaults (
// 			name text,
// 			id int,
// 			primary key (id)
// 		);
// 	`)
// 	const queryName = createRes.name
// }


// export const queryTable = async ({
// 	table,
// 	query
// }: {
// 	table?: Connection,
// 	query: string,
// }) => {
// 	table ||= await getTable()
// 	return await table.query(query)
// }

// export const writeRow = async ({
// 	table,
// 	query
// }: {
// 	table?: Connection,
// 	query: string,
// }) => {
// 	table ||= await getTable()
// 	return await table.query(query)
// }
