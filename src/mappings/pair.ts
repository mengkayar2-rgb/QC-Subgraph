import { BigInt, BigDecimal, Address, log } from '@graphprotocol/graph-ts'
import { 
  Mint as MintEvent, 
  Burn as BurnEvent, 
  Swap as SwapEvent, 
  Transfer as TransferEvent,
  Sync as SyncEvent 
} from '../../generated/templates/Pair/Pair'
import { 
  Pair, 
  Token, 
  Transaction, 
  Mint, 
  Burn, 
  Swap, 
  Factory,
  User
} from '../../generated/schema'

// Constants
const FACTORY_ADDRESS = '0x5D36Bfea5074456d383e47F5b4df12186eD6e858'
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
const ZERO_BI = BigInt.fromI32(0)
const ONE_BI = BigInt.fromI32(1)
const ZERO_BD = BigDecimal.fromString('0')
const BI_18 = BigInt.fromI32(18)

function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals.equals(ZERO_BI)) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function handleTransfer(event: TransferEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let from = event.params.from.toHexString()
  let to = event.params.to.toHexString()

  // Handle mint (from zero address)
  if (from == ADDRESS_ZERO) {
    pair.totalSupply = pair.totalSupply.plus(convertTokenToDecimal(event.params.value, BI_18))
    pair.save()
  }

  // Handle burn (to zero address)
  if (to == ADDRESS_ZERO && from != event.address.toHexString()) {
    pair.totalSupply = pair.totalSupply.minus(convertTokenToDecimal(event.params.value, BI_18))
    pair.save()
  }

  // Create users
  if (from != ADDRESS_ZERO && from != event.address.toHexString()) {
    let fromUser = User.load(from)
    if (fromUser === null) {
      fromUser = new User(from)
      fromUser.usdSwapped = ZERO_BD
      fromUser.save()
    }
  }

  if (to != ADDRESS_ZERO && to != event.address.toHexString()) {
    let toUser = User.load(to)
    if (toUser === null) {
      toUser = new User(to)
      toUser.usdSwapped = ZERO_BD
      toUser.save()
    }
  }
}

export function handleSync(event: SyncEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  if (token0 === null || token1 === null) return

  pair.reserve0 = convertTokenToDecimal(event.params.reserve0, token0.decimals)
  pair.reserve1 = convertTokenToDecimal(event.params.reserve1, token1.decimals)

  if (pair.reserve1.notEqual(ZERO_BD)) {
    pair.token0Price = pair.reserve0.div(pair.reserve1)
  } else {
    pair.token0Price = ZERO_BD
  }
  
  if (pair.reserve0.notEqual(ZERO_BD)) {
    pair.token1Price = pair.reserve1.div(pair.reserve0)
  } else {
    pair.token1Price = ZERO_BD
  }

  pair.save()
  token0.save()
  token1.save()
}

export function handleMint(event: MintEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  if (token0 === null || token1 === null) return

  // Get or create transaction
  let txHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(txHash)
  if (transaction === null) {
    transaction = new Transaction(txHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.mints = []
    transaction.burns = []
    transaction.swaps = []
  }

  let mintId = txHash + '-' + event.logIndex.toString()
  let mint = new Mint(mintId)
  
  mint.transaction = transaction.id
  mint.pair = pair.id
  mint.to = event.params.sender
  mint.timestamp = event.block.timestamp
  mint.liquidity = ZERO_BD
  mint.amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  mint.amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)
  mint.logIndex = event.logIndex
  mint.amountUSD = ZERO_BD
  mint.save()

  let mints = transaction.mints
  mints.push(mint.id)
  transaction.mints = mints
  transaction.save()

  // Update pair tx count
  pair.txCount = pair.txCount.plus(ONE_BI)
  pair.save()

  // Update factory tx count
  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory !== null) {
    factory.txCount = factory.txCount.plus(ONE_BI)
    factory.save()
  }

  log.info('Mint: {} - amount0: {}, amount1: {}', [
    event.address.toHexString(),
    mint.amount0 !== null ? mint.amount0!.toString() : '0',
    mint.amount1 !== null ? mint.amount1!.toString() : '0'
  ])
}

export function handleBurn(event: BurnEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  if (token0 === null || token1 === null) return

  // Get or create transaction
  let txHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(txHash)
  if (transaction === null) {
    transaction = new Transaction(txHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.mints = []
    transaction.burns = []
    transaction.swaps = []
  }

  let burnId = txHash + '-' + event.logIndex.toString()
  let burn = new Burn(burnId)
  
  burn.transaction = transaction.id
  burn.pair = pair.id
  burn.timestamp = event.block.timestamp
  burn.liquidity = ZERO_BD
  burn.amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  burn.amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)
  burn.to = event.params.to
  burn.sender = event.params.sender
  burn.logIndex = event.logIndex
  burn.amountUSD = ZERO_BD
  burn.needsComplete = false
  burn.save()

  let burns = transaction.burns
  burns.push(burn.id)
  transaction.burns = burns
  transaction.save()

  // Update pair tx count
  pair.txCount = pair.txCount.plus(ONE_BI)
  pair.save()

  // Update factory tx count
  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory !== null) {
    factory.txCount = factory.txCount.plus(ONE_BI)
    factory.save()
  }
}

export function handleSwap(event: SwapEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  if (token0 === null || token1 === null) return

  let amount0In = convertTokenToDecimal(event.params.amount0In, token0.decimals)
  let amount1In = convertTokenToDecimal(event.params.amount1In, token1.decimals)
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, token0.decimals)
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, token1.decimals)

  // Calculate volume
  let amount0Total = amount0In.plus(amount0Out)
  let amount1Total = amount1In.plus(amount1Out)

  // Get or create transaction
  let txHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(txHash)
  if (transaction === null) {
    transaction = new Transaction(txHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.mints = []
    transaction.burns = []
    transaction.swaps = []
  }

  let swapId = txHash + '-' + event.logIndex.toString()
  let swap = new Swap(swapId)
  
  swap.transaction = transaction.id
  swap.pair = pair.id
  swap.timestamp = event.block.timestamp
  swap.sender = event.params.sender
  swap.from = event.transaction.from
  swap.to = event.params.to
  swap.amount0In = amount0In
  swap.amount1In = amount1In
  swap.amount0Out = amount0Out
  swap.amount1Out = amount1Out
  swap.amountUSD = ZERO_BD
  swap.logIndex = event.logIndex
  swap.save()

  let swaps = transaction.swaps
  swaps.push(swap.id)
  transaction.swaps = swaps
  transaction.save()

  // Update pair volume
  pair.volumeToken0 = pair.volumeToken0.plus(amount0Total)
  pair.volumeToken1 = pair.volumeToken1.plus(amount1Total)
  pair.txCount = pair.txCount.plus(ONE_BI)
  pair.save()

  // Update token volumes
  token0.tradeVolume = token0.tradeVolume.plus(amount0Total)
  token0.txCount = token0.txCount.plus(ONE_BI)
  token0.save()

  token1.tradeVolume = token1.tradeVolume.plus(amount1Total)
  token1.txCount = token1.txCount.plus(ONE_BI)
  token1.save()

  // Update factory
  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory !== null) {
    factory.txCount = factory.txCount.plus(ONE_BI)
    factory.save()
  }

  log.info('Swap: {} - in: {}/{}, out: {}/{}', [
    event.address.toHexString(),
    amount0In.toString(),
    amount1In.toString(),
    amount0Out.toString(),
    amount1Out.toString()
  ])
}
