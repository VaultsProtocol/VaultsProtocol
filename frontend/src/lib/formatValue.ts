export const formatValue = ({
	value,
	currency,
	showDecimals = 3,
	compactLargeValues = false,
}: {
	value: number,
	currency?: string,
	showDecimals: number,
	compactLargeValues: boolean,
}) => {
	try {
		return globalThis.navigator
			? new Intl.NumberFormat(globalThis.navigator.languages, {
				... currency ? {style: 'currency', currency} : {},
				notation: compactLargeValues && value >= 1e7 ? 'compact' : 'standard'
			}).format(value)
			: value
	}catch(e){
		console.error(e)
		return value?.toString()
	}
}
