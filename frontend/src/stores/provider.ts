import type { Provider } from '@ethersproject/providers'

import { writable } from 'svelte/store'

export const provider = writable<Provider>(undefined)
