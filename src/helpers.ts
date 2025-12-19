import { BigInt, BigDecimal, Address, ethereum } from '@graphprotocol/graph-ts'
import { ERC20 } from '../generated/Factory/ERC20'
import { ZERO_BI, ZERO_BD, ONE_BD, BI_18 } from './constants'

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = ONE_BD
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)
  let symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    return 'UNKNOWN'
  }
  return symbolResult.value
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)
  let nameResult = contract.try_name()
  if (nameResult.reverted) {
    return 'Unknown Token'
  }
  return nameResult.value
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  let decimalsResult = contract.try_decimals()
  if (decimalsResult.reverted) {
    return BI_18
  }
  return BigInt.fromI32(decimalsResult.value)
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  let totalSupplyResult = contract.try_totalSupply()
  if (totalSupplyResult.reverted) {
    return ZERO_BI
  }
  return totalSupplyResult.value
}

export function createUser(address: Address): void {
  // User creation logic
}

export function createLiquidityPosition(exchange: Address, user: Address): void {
  // Liquidity position creation logic
}
