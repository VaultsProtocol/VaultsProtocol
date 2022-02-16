export type ERC20Token = {
    name?: string,
    address: string,
    chainId?: number,
    symbol: string,
    decimals: number,
    icon?: string
}

export const erc20Tokens: ERC20Token[] = [
    {"chainId":1,"address":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2","name":"WETH","symbol":"WETH","decimals":18,"logoURI":"https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295"},
    {"chainId":1,"address":"0x6b175474e89094c44da98b954eedeac495271d0f","name":"Dai","symbol":"DAI","decimals":18,"logoURI":"https://assets.coingecko.com/coins/images/9956/thumb/dai-multi-collateral-mcd.png?1574218774"},
    {"chainId":1,"address":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48","name":"USD Coin","symbol":"USDC","decimals":6,"logoURI":"https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389"}
]
.map(({logoURI, ...token}) => ({icon: logoURI, ...token}))

export const erc20TokensByContractAddress: Record<string, ERC20Token> = Object.fromEntries(
    erc20Tokens.map(token => [token.address, token])
)

export const erc20TokensBySymbol: Record<string, ERC20Token> = Object.fromEntries(
    erc20Tokens.map(token => [token.symbol, token])
)