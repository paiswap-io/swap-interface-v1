import { Currency, ETHER, Token } from '@paiswap/sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return '  PI'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
