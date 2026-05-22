# QUANTUM EMMA — Build & Deploy Guide v4.0
## © 2026 Grigori Saks — All Rights Reserved

---

## 🌐 WEB APP (Live)
**URL:** https://quantum-emma-app.base44.app
- No build needed — always live
- All 10 modules accessible

---

## 🪟 WINDOWS APP (Electron)

### Prerequisites
```bash
node --version   # 20+
npm --version    # 10+
```

### Build Steps
```bash
# 1. Clone / setup
git clone https://github.com/grischasaks/quantum-emma
cd quantum-emma

# 2. Install
npm install
npm install --save-dev electron electron-builder

# 3. Build Windows EXE
npm run build:win

# Output: dist/QEMMA-Setup-v4.0.1.exe (~148 MB)
```

### package.json scripts
```json
{
  "scripts": {
    "electron": "electron .",
    "build:win": "electron-builder --win --x64",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.grischasaks.quantumemma",
    "productName": "Quantum Emma",
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    }
  }
}
```

---

## 🤖 ANDROID APP (Expo/React Native)

### Prerequisites
```bash
npm install -g expo-cli eas-cli
eas login   # with Expo account
```

### Build Steps
```bash
cd android/

# 1. Install dependencies
npm install

# 2. Configure EAS
eas build:configure

# 3. Build APK
eas build --platform android --profile preview

# OR local build:
expo build:android -t apk

# Output: QEMMA-v4.0.1.apk (~48 MB)
```

### eas.json
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

---

## 🐳 DOCKER DEPLOYMENT

```bash
# Build image
docker build -t quantum-emma:v4.0.1 .

# Run container
docker run -p 3000:3000 quantum-emma:v4.0.1

# Docker Compose
docker-compose up -d
```

---

## ☁️ VERCEL DEPLOYMENT

```bash
npm install -g vercel
vercel --prod
# Auto-deploys from GitHub main branch
```

---

## 📜 SMART CONTRACT DEPLOY (Ethereum)

```bash
cd contracts/

# Install Hardhat
npm install --save-dev hardhat @openzeppelin/contracts

# Compile
npx hardhat compile

# Deploy Sepolia Testnet
npx hardhat run deploy/deploy.js --network sepolia

# Deploy Mainnet
npx hardhat run deploy/deploy.js --network mainnet

# Verify on Etherscan
npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
```

---

## ✅ CHECKLIST BEFORE MAINNET

- [ ] All 7 contracts compiled (0 errors)
- [ ] Sepolia testnet deploy successful
- [ ] Full audit passed (Score: A+)
- [ ] Multisig wallet configured (3-of-5)
- [ ] Uniswap V3 pool created (QEMMA/ETH)
- [ ] CoinGecko listing application submitted
- [ ] CoinMarketCap listing application submitted
- [ ] IDO smart contract deployed
- [ ] Team vesting contract configured
- [ ] TimelockController set (2-day delay)

---

*© 2026 Grigori Saks — grischasaks@gmail.com*
