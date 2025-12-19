# QuickSwap Subgraph - Goldsky Deployment Script
# API Key: cmj8sktzmrr2201wk3ujfgcwx

$API_KEY = "cmj8sktzmrr2201wk3ujfgcwx"
$SUBGRAPH_NAME = "quickswap-monad"
$VERSION = "v1"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "       GOLDSKY SUBGRAPH DEPLOYMENT - QuickSwap Monad           " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Check if build exists
if (-not (Test-Path "build/subgraph.yaml")) {
    Write-Host "❌ Build not found. Running build..." -ForegroundColor Red
    npx graph build
}

Write-Host "`n✅ Build found at ./build/" -ForegroundColor Green

# Instructions for manual deployment
Write-Host "`n═══ MANUAL DEPLOYMENT STEPS ═══" -ForegroundColor Yellow
Write-Host "1. Download Goldsky CLI from: https://docs.goldsky.com/get-started/cli" -ForegroundColor White
Write-Host "2. Run: goldsky login" -ForegroundColor White
Write-Host "3. Enter API Key: $API_KEY" -ForegroundColor Cyan
Write-Host "4. Run: goldsky subgraph deploy $SUBGRAPH_NAME/$VERSION --path ./build" -ForegroundColor White

Write-Host "`n═══ ALTERNATIVE: The Graph Studio ═══" -ForegroundColor Yellow
Write-Host "1. Go to https://thegraph.com/studio/" -ForegroundColor White
Write-Host "2. Create subgraph: quickswap-monad" -ForegroundColor White
Write-Host "3. Get deploy key and run:" -ForegroundColor White
Write-Host "   graph auth --studio YOUR_DEPLOY_KEY" -ForegroundColor Cyan
Write-Host "   graph deploy --studio quickswap-monad" -ForegroundColor Cyan

Write-Host "`n═══ BUILD INFO ═══" -ForegroundColor Yellow
Write-Host "Network: monad (Chain ID: 143)" -ForegroundColor White
Write-Host "Factory: 0x5D36Bfea5074456d383e47F5b4df12186eD6e858" -ForegroundColor White
Write-Host "Start Block: 42911473" -ForegroundColor White
Write-Host "Build Output: ./build/" -ForegroundColor White

Write-Host "`n✅ Subgraph is ready for deployment!" -ForegroundColor Green
