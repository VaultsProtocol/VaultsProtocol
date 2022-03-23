import type { Signer } from 'ethers'
import type { Connection } from '@tableland/sdk'
import { connect } from '@tableland/sdk'


const connections: Record<string, Connection> = {}

export const getTablelandConnection = async ({ signer }: { signer: Signer }): Promise<Connection> =>
	connections[await signer.getAddress()] ||= await connect({
		signer,
		network: 'testnet',
		host: 'https://testnet.tableland.network'
	})


export const getTables = async (connection: Connection) =>
	await connection.list()


export const createTable = async (connection: Connection, query: string, options) => {
	// const dryRunReceipt = await connection.create(query, options)
	// console.log('dryRunReceipt', dryRunReceipt)

	return await connection.create(query, options)
}

export const queryTable = async (connection: Connection, query) => {
	console.log('queryTable', query)
	return await connection.query(query)
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
