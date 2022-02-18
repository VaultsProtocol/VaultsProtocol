export const formatAddress = (address: string) => {
	return address
		? `0×${address.slice(2, 6)}···${address.slice(-4)}`.toUpperCase()
		: ''
}
