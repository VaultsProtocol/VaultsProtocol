import { loadScript } from './loadScript'

const externalPackages = {
	'@walletconnect/web3-provider': {
		cdnUrl: 'https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.1/dist/umd/index.min.js',
		globalName: 'WalletConnectProvider',
	}
}

export const importExternalPackage = async <T>(packageName: keyof typeof externalPackages): Promise<T> => {
	const { cdnUrl, globalName } = externalPackages[packageName]
	// globalThis.exports = {}
	// globalThis.require = async (path: string) => await loadScript(`${cdnUrl}/${path}`)
	await loadScript(cdnUrl)
	return globalThis[globalName].default as T
}