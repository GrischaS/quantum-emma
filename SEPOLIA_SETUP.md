# ⛓ Sepolia Testnet Deployment Guide — Quantum Emma v5.0

> Complete step-by-step guide to deploy all 7 QEMMA smart contracts
> © 2026 Grigori Saks — All Rights Reserved

---

## 📋 Prerequisites

| Item | Where to get | Cost |
|------|-------------|------|
| **Alchemy API Key** | https://alchemy.com → New App → Ethereum Sepolia | Free |
| **Deploy Wallet** | MetaMask → New Account "QEMMA Deploy" → Export Private Key | — |
| **Sepolia ETH** | https://sepoliafaucet.com OR https://faucets.chain.link | Free |
| **Etherscan API** | https://etherscan.io/myapikey | Free |

---

## 🚀 Method A — GitHub Actions (Recommended)

### 1. Add Secrets to GitHub
Go to: `github.com/GrischaS/quantum-emma/settings/secrets/actions`

Add these secrets:
```
ALCHEMY_API_KEY       = your_alchemy_key_here
DEPLOYER_PRIVATE_KEY  = 0xyour_private_key_here
ETHERSCAN_API_KEY     = your_etherscan_key_here
VERCEL_TOKEN          = your_vercel_token (for web deploy)
NETLIFY_AUTH_TOKEN    = your_netlify_token (for web deploy)
NETLIFY_SITE_ID       = your_netlify_site_id
```

### 2. Trigger Deploy
- Go to: Actions → "⛓ Sepolia Contract Deploy" → Run workflow
- Type `DEPLOY` in the confirm field
- Select network: `sepolia`
- Click "Run workflow"

### 3. View Results
- Etherscan: https://sepolia.etherscan.io
- Artifact: Download `sepolia-contracts-*.zip` from the workflow run

---

## 🔧 Method B — Local Deploy

### 1. Clone & setup
```bash
git clone https://github.com/GrischaS/quantum-emma.git
cd quantum-emma
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts ethers dotenv
cp deployment/hardhat.config.js hardhat.config.js
```

### 2. Create .env file
```bash
cat > .env << EOF
ALCHEMY_API_KEY=your_key_here
DEPLOYER_PRIVATE_KEY=0xyour_private_key
ETHERSCAN_API_KEY=your_etherscan_key
EOF
```

### 3. Run deploy script
```bash
npx hardhat compile
npx hardhat run contracts/deploy/deploy.js --network sepolia
```

### 4. Expected output
```
╔══════════════════════════════════════════════════════╗
║        QUANTUM EMMA — ENTERPRISE DEPLOY v2.0         ║
╚══════════════════════════════════════════════════════╝

✅ QEMMAToken:     0x1234...abcd
✅ QEMMAMining:    0x2345...bcde
✅ QEMMAStaking:   0x3456...cdef
✅ QEMMAGovernance:0x4567...def0
✅ QEMMASwap:      0x5678...ef01
✅ QEMMAMetaCodex: 0x6789...f012
✅ QEMMAMetaMemory:0x7890...0123

🎉 All 7 contracts deployed & verified!
📁 Saved: deployment-sepolia.json
```

---

## 📊 Contract Details

| Contract | Function | Gas Est. |
|----------|---------|---------|
| **QEMMAToken** | ERC-20, 100M supply, metamorphic phases | ~800K gas |
| **QEMMAMining** | Proof-of-Work, halving every 210K blocks | ~600K gas |
| **QEMMAStaking** | 5 tiers, 12–60% APY, auto-compound | ~700K gas |
| **QEMMAGovernance** | DAO voting, treasury, proposals | ~900K gas |
| **QEMMASwap** | Uniswap V3 integration, DEX swap | ~1.1M gas |
| **QEMMAMetaCodex** | On-chain AI reasoning, HQMLL | ~1.3M gas |
| **QEMMAMetaMemory** | Recursive memory storage, loops | ~950K gas |

**Total estimated gas:** ~6.35M gas (~0.025 ETH on Sepolia)

---

## 🔗 After Deployment

1. **Update frontend** — copy addresses from `deployment-sepolia.json` to your `.env`
2. **Verify on Etherscan** — `npx hardhat verify --network sepolia <address>`
3. **Add liquidity** — deploy initial QEMMA/ETH pool on Uniswap V3 Sepolia
4. **Test IDO flow** — run whitelist → purchase → vesting cycle

---

*© 2026 Grigori Saks — Quantum Emma Enterprise v5.0 — Patent Pending*
