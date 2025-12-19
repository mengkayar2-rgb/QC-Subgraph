import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

// Contract Addresses - Monad Mainnet
export const FACTORY_ADDRESS = '0x5D36Bfea5074456d383e47F5b4df12186eD6e858'
export const ROUTER_ADDRESS = '0xa45cc7A52C5179BD24076994Ef253Eb1FB1A9929'
export const WMON_ADDRESS = '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A'
export const QUICK_ADDRESS = '0x6d42eFC8B2EC16cC61B47BfC2ABb38D570Faabb5'
export const MASTERCHEF_ADDRESS = '0x1CF67a6Ac3E049E78E6BC22642126C6AB8511d03'

// Init Code Hash
export const INIT_CODE_HASH = '0xc5046c562153e8288204e770fc7fec0968c4fb899ad6d483cec04005fa165600'

// Fee Structure
export const TOTAL_FEE_PERCENT = BigDecimal.fromString('0.5')
export const LP_FEE_PERCENT = BigDecimal.fromString('0.4')
export const PROTOCOL_FEE_PERCENT = BigDecimal.fromString('0.1')

// Zero values
export const ZERO_BI = BigInt.fromI32(0)
export const ONE_BI = BigInt.fromI32(1)
export const ZERO_BD = BigDecimal.fromString('0')
export const ONE_BD = BigDecimal.fromString('1')
export const BI_18 = BigInt.fromI32(18)

// Address helpers
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

// Stablecoin addresses for USD pricing (add when available on Monad)
export let STABLECOIN_ADDRESSES: string[] = []

// Whitelist tokens for volume tracking
export let WHITELIST: string[] = [
  WMON_ADDRESS.toLowerCase(),
  QUICK_ADDRESS.toLowerCase()
]
