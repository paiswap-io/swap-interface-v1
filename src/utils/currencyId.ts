import { Currency, ETHER, Token } from '@alex_7/sdk'

export function currencyId(currency: Currency): string {
 console.info ("currency",currency)
 console.info ("ETHER",ETHER)

  if (currency === ETHER) return 'PI'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
