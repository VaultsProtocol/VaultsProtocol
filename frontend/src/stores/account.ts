import type { Signer } from 'ethers'

import { writable } from 'svelte/store'

export const account = writable<{
	signer: Signer,
	address: string
	ensName?: string
	ensAvatarUri?: string
} | undefined>(undefined)
