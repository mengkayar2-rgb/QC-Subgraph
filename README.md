# QuickSwap Subgraph - Monad Mainnet

Subgraph tracking QuickSwap V2 DEX di Monad Mainnet.

## Contract Addresses

| Contract | Address |
|----------|---------|
| Factory | `0x5D36Bfea5074456d383e47F5b4df12186eD6e858` |
| Router | `0xa45cc7A52C5179BD24076994Ef253Eb1FB1A9929` |
| WMON | `0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A` |
| QUICK | `0x6d42eFC8B2EC16cC61B47BfC2ABb38D570Faabb5` |
| MasterChef | `0x1CF67a6Ac3E049E78E6BC22642126C6AB8511d03` |

## Setup

```bash
npm install
```

## Deploy ke Goldsky

```bash
# Login
goldsky login

# Compile
npm run codegen
npm run build

# Deploy
npm run deploy:goldsky
```

## Query Examples

```graphql
# Get all pairs
{
  pairs(first: 10, orderBy: reserveUSD, orderDirection: desc) {
    id
    token0 { symbol }
    token1 { symbol }
    reserveUSD
    volumeUSD
  }
}

# Get recent swaps
{
  swaps(first: 20, orderBy: timestamp, orderDirection: desc) {
    id
    pair { token0 { symbol } token1 { symbol } }
    amount0In
    amount1Out
    amountUSD
  }
}
```
