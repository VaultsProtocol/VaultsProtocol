import type { Provider } from '@ethersproject/providers'

import { writable } from 'svelte/store'

export const rpcProvider = writable<Provider>(undefined)
