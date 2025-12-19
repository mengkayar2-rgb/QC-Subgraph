# QuickSwap Subgraph Deployment Guide

## Option 1: Goldsky (Recommended)

### Install Goldsky CLI (Windows)
```powershell
# Download from releases
Invoke-WebRequest -Uri "https://github.com/goldsky-io/goldsky-cli/releases/latest/download/goldsky-windows-amd64.exe" -OutFile "goldsky.exe"

# Or use npm (if available)
npm install -g @goldsky/cli
```

### Login & Deploy
```bash
# Login with API key
./goldsky.exe login --api-key cmj8sktzmrr2201wk3ujfgcwx

# Deploy subgraph
./goldsky.exe subgraph deploy quickswap-monad/v1 --path ./build
```

## Option 2: The Graph Studio

1. Go to https://thegraph.com/studio/
2. Create new subgraph "quickswap-monad"
3. Deploy:
```bash
graph auth --studio YOUR_DEPLOY_KEY
graph deploy --studio quickswap-monad
```

## Option 3: Self-hosted Graph Node

```bash
# Start graph-node with docker
docker-compose up -d

# Create subgraph
npm run create:local

# Deploy
npm run deploy:local
```

## Build Status
- ✅ Codegen: Success
- ✅ Build: Success
- 📁 Output: ./build/

## Contract Addresses
- Factory: 0x5D36Bfea5074456d383e47F5b4df12186eD6e858
- Start Block: 42911473
- Network: monad (Chain ID: 143)

## Query Endpoint (after deployment)
```
https://api.goldsky.com/api/v1/project/YOUR_PROJECT/quickswap-monad/v1/gn
```
