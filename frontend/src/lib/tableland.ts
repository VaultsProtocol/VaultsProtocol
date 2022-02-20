import type { Connection } from '@textile/tableland'
import { connect } from '@textile/tableland'

let table

export const getTable = async () => {
	return table ||= await connect({
		network: 'testnet',
		host: 'https://testnet.tableland.network'
	})
}

export const queryTable = async ({
	table,
	query
}: {
	table?: Connection,
	query: string,
}) => {
	table ||= await getTable()
	return await table.query(query)
}
