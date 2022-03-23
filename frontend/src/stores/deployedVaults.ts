import type { DeployedVault } from '$lib/vaultConfig'

import { localStorageWritable } from './localStorage'

export const deployedVaults = localStorageWritable<DeployedVault<any>[]>('deployedVaults', [])
