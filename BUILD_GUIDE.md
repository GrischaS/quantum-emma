# 📦 Build Guide — Quantum Emma Enterprise v5.0

> All platforms: Web · Windows EXE · Android APK · Docker
> © 2026 Grigori Saks — All Rights Reserved

---

## 🌐 Web App (Vite/React)

```bash
# Development
npm run dev          # http://localhost:5173

# Production build
npm run build        # → dist/
npm run preview      # Preview production build

# Deploy to Vercel (one command)
npx vercel --prod
```

**Live:** https://quantum-emma-app.base44.app

---

## 🖥 Windows Desktop (Electron)

### Setup
```bash
npm install --save-dev electron electron-builder
```

### package.json scripts
```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron": "electron .",
    "build:win": "electron-builder --win --x64",
    "build:win:portable": "electron-builder --win portable"
  },
  "build": {
    "appId": "com.quantumemma.enterprise",
    "productName": "Quantum Emma Enterprise",
    "win": {
      "target": ["nsis", "portable"],
      "icon": "assets/icon.ico"
    },
    "nsis": {
      "installerIcon": "assets/icon.ico",
      "installerHeaderIcon": "assets/icon.ico",
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

### Build
```bash
npm run build:win
# → dist/QEMMA-Setup-v5.0.0.exe  (~148MB)
# → dist/QEMMA-v5.0.0-portable.exe (~95MB)
```

---

## 📱 Android APK (Expo/EAS)

### Setup
```bash
cd android
npm install
npm install -g eas-cli
eas login    # login with Expo account
```

### eas.json
```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "aab" }
    }
  }
}
```

### Build
```bash
# APK (for direct install)
eas build --platform android --profile preview
# → QEMMA-v5.0.0.apk (~52MB)

# AAB (for Google Play)
eas build --platform android --profile production
# → QEMMA-v5.0.0.aab (~38MB)

# Local build (requires Android SDK)
npx expo run:android
```

---

## 🐳 Docker

```bash
# Build image
docker build -t quantum-emma:v5.0.0 .

# Run container
docker run -d -p 3000:3000 quantum-emma:v5.0.0

# Docker Compose (full stack)
docker-compose up -d
# → App: http://localhost:3000
# → API: http://localhost:4000
```

---

## ⛓ Smart Contracts

```bash
# Install
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts ethers dotenv
cp deployment/hardhat.config.js hardhat.config.js

# Compile
npx hardhat compile         # Compile all 7 contracts

# Test (124 tests)
npx hardhat test            # Run full test suite
npx hardhat test --grep "Token"  # Run specific tests

# Deploy
npx hardhat run contracts/deploy/deploy.js --network hardhat   # Local
npx hardhat run contracts/deploy/deploy.js --network sepolia   # Testnet
npx hardhat run contracts/deploy/deploy.js --network mainnet   # Mainnet

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## 🔑 Required Environment Variables

Create `.env` in project root:
```bash
# Blockchain
ALCHEMY_API_KEY=your_alchemy_key
DEPLOYER_PRIVATE_KEY=0xyour_private_key
ETHERSCAN_API_KEY=your_etherscan_key

# Web Deploy
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

---

## 🚀 Release Flow

```bash
# Bump version + tag + push
./scripts/release.sh patch   # v5.0.0 → v5.0.1
./scripts/release.sh minor   # v5.0.0 → v5.1.0
./scripts/release.sh major   # v5.0.0 → v6.0.0

# GitHub Actions then auto-deploys to Vercel + Netlify
```

---

## 📊 Build Output Summary

| Target | File | Size | Command |
|--------|------|------|---------|
| Web App | dist/ | ~8MB | `npm run build` |
| Windows EXE | QEMMA-Setup-v5.0.0.exe | ~148MB | `npm run build:win` |
| Android APK | QEMMA-v5.0.0.apk | ~52MB | `eas build --profile preview` |
| Docker Image | quantum-emma:v5.0.0 | ~320MB | `docker build .` |

---

*© 2026 Grigori Saks — Quantum Emma Enterprise v5.0 — Patent Pending*
