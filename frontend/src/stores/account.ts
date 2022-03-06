import type { WalletConnection } from '$lib/wallets'
import type { Signer } from 'ethers'

import { writable } from 'svelte/store'

export const account = writable<{
	walletConnection: WalletConnection
	signer: Signer
	address: string
	ensName?: string
	ensAvatarUri?: string
} | undefined>(undefined)
