# ⛓ Quantum Emma — Sepolia Testnet Deploy Guide
**Version:** v5.3.0 · Stand: 10. Juni 2026  
**© 2026 Grigori Saks — All Rights Reserved — Patent Pending**

---

## 🎯 Ziel

Alle **7 QEMMA Smart Contracts** auf dem Ethereum Sepolia Testnet deployen:

| Contract | Funktion |
|----------|----------|
| `QEMMAToken.sol` | ERC-20 Token (100M max supply) |
| `QEMMAMining.sol` | Proof-of-Stake Mining Pools |
| `QEMMAStaking.sol` | 5-Tier Staking (bis 60% APY) |
| `QEMMAGovernance.sol` | DAO Governance & Voting |
| `QEMMASwap.sol` | DEX Swap (Uniswap V3 kompatibel) |
| `QEMMAMetaCodex.sol` | On-Chain AI Reasoning Layer |
| `QEMMAMetaMemory.sol` | HQMLL 7-Layer Memory System |

---

## 📋 Schritt 1 — Alchemy API Key holen

1. Gehe zu **https://alchemy.com** und registriere dich (kostenlos)
2. Klicke **"Create App"**
3. Name: `Quantum Emma Sepolia`
4. Chain: **Ethereum** · Network: **Sepolia**
5. App erstellen → **"API Key"** kopieren

```
ALCHEMY_API_KEY = dein_key_hier
```

---

## 🔑 Schritt 2 — Deploy Wallet erstellen

> ⚠️ **WICHTIG:** Nutze eine **dedizierte Deploy-Wallet** — NIEMALS deine Haupt-Wallet!

### Option A: MetaMask (empfohlen)
1. MetaMask öffnen → **"Create Account"**
2. Name: `QEMMA Deploy Wallet`
3. Konto → **drei Punkte → Account Details → Export Private Key**
4. Private Key kopieren (mit `0x` Prefix)

### Option B: Neu generieren (sicher)
```bash
node -e "const {ethers}=require('ethers'); const w=ethers.Wallet.createRandom(); console.log('Address:',w.address,'\nKey:',w.privateKey)"
```

```
DEPLOYER_PRIVATE_KEY = 0x_dein_private_key
```

---

## 💧 Schritt 3 — Sepolia ETH holen (kostenlos)

Du brauchst ~0.1 ETH für Gas. Hol dir Testnet-ETH von einem dieser Faucets:

| Faucet | URL | Limit |
|--------|-----|-------|
| Alchemy | https://sepoliafaucet.com | 0.5 ETH/Tag |
| Chainlink | https://faucets.chain.link/sepolia | 0.1 ETH |
| Infura | https://www.infura.io/faucet/sepolia | 0.5 ETH/Tag |
| QuickNode | https://faucet.quicknode.com/ethereum/sepolia | 0.1 ETH |

→ Deine Wallet-Adresse eingeben → ETH erhalten (~1 Min)

---

## 🔐 Schritt 4 — GitHub Secrets setzen

Gehe zu:  
**https://github.com/GrischaS/quantum-emma/settings/secrets/actions**

Klicke **"New repository secret"** und füge hinzu:

| Secret Name | Wert | Pflicht |
|-------------|------|---------|
| `DEPLOYER_PRIVATE_KEY` | `0x...` dein Private Key | ✅ |
| `ALCHEMY_API_KEY` | dein Alchemy Key | ✅ |
| `ETHERSCAN_API_KEY` | von etherscan.io | optional |

> **Etherscan API Key** (für Contract-Verifizierung):  
> https://etherscan.io → Account → **API Keys** → Add

---

## 🚀 Schritt 5 — Deploy starten

### Via GitHub Actions (empfohlen):
1. Gehe zu: **https://github.com/GrischaS/quantum-emma/actions**
2. Wähle **"⛓ Sepolia Contract Deploy"**
3. Klicke **"Run workflow"**
4. `confirm` Feld: Tippe **`DEPLOY`**
5. Network: **`sepolia`**
6. **"Run workflow"** klicken → ~5 Min warten

### Lokal (alternativ):
```bash
git clone https://github.com/GrischaS/quantum-emma
cd quantum-emma

# .env anlegen
cat > .env << EOF
DEPLOYER_PRIVATE_KEY=0x_dein_key
ALCHEMY_API_KEY=dein_alchemy_key
ETHERSCAN_API_KEY=dein_etherscan_key
EOF

npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts ethers dotenv
cp deployment/hardhat.config.js hardhat.config.js
npx hardhat compile
npx hardhat run contracts/deploy/deploy.js --network sepolia
```

---

## ✅ Schritt 6 — Ergebnis prüfen

Nach dem Deploy erscheinen die **Contract-Adressen** im GitHub Actions Log.  
Öffne den Run → **"Deploy to Sepolia"** → Scroll ans Ende.

Beispiel-Output:
```
✅ QEMMAToken deployed:      0x1234...abcd
✅ QEMMAMining deployed:     0x2345...bcde
✅ QEMMAStaking deployed:    0x3456...cdef
✅ QEMMAGovernance deployed: 0x4567...def0
✅ QEMMASwap deployed:       0x5678...ef01
✅ QEMMAMetaCodex deployed:  0x6789...f012
✅ QEMMAMetaMemory deployed: 0x7890...0123
```

Contracts auf Etherscan prüfen:  
**https://sepolia.etherscan.io/address/0x...**

---

## 🔗 Nach dem Deploy — Nächste Schritte

- [ ] Contract-Adressen in `src/config/contracts.ts` eintragen
- [ ] MetaMask auf Sepolia umschalten und testen
- [ ] Staking / Mining / Swap via Frontend testen
- [ ] Etherscan Verifizierung: `npx hardhat verify --network sepolia <address>`
- [ ] Uniswap V3 QEMMA/ETH Pool auf Sepolia anlegen
- [ ] CoinGecko Testnet-Listing beantragen

---

*© 2026 Grigori Saks — Quantum Emma · Patent Pending*
