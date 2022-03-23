import type { WalletConnection } from '$lib/wallets'
import type { Signer } from 'ethers'

import { writable } from 'svelte/store'

export type ConnectedAccount = {
	walletConnection: WalletConnection
	signer: Signer
	address: string
	chainId: number
	ensName?: string
	ensAvatarUri?: string
}

export const account = writable<ConnectedAccount | undefined>(undefined)
