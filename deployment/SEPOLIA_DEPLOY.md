# 🚀 Quantum Emma — Sepolia Testnet Deploy Guide
**Version:** v4.1.2 · © 2026 Grigori Saks — All Rights Reserved

---

## SCHRITT 1 — Alchemy API Key holen (5 Min, kostenlos)

1. Gehe zu **https://alchemy.com** → „Sign Up" (kostenlos)
2. Dashboard → „Create new app"
   - Name: `Quantum Emma`
   - Chain: **Ethereum**
   - Network: **Ethereum Sepolia**
3. „Create App" → **„API Key"** kopieren
4. In `.env` eintragen:
   ```
   ALCHEMY_API_KEY=abc123xyz...
   ```

---

## SCHRITT 2 — Deploy Wallet erstellen (3 Min)

> ⚠️ **WICHTIG:** Benutze NIEMALS dein Haupt-Wallet zum Deployen!  
> Erstelle ein dediziertes Deploy-Wallet.

### Option A — MetaMask (empfohlen)
1. MetaMask öffnen → Accounts → „Add Account" → „Create New Account"
2. Name: `QEMMA Deploy`
3. Account Details → „Export Private Key"
4. In `.env` eintragen:
   ```
   DEPLOYER_PRIVATE_KEY=0x_dein_private_key
   ```

### Option B — Hardhat generieren
```bash
node -e "const {ethers} = require('ethers'); const w = ethers.Wallet.createRandom(); console.log('Address:', w.address); console.log('PK:', w.privateKey);"
```

---

## SCHRITT 3 — Sepolia ETH holen (5 Min, kostenlos)

Du brauchst ca. **0.1–0.15 Sepolia ETH** für Gas (7 Contracts).

| Faucet | Link | Limit |
|--------|------|-------|
| Alchemy Faucet | https://sepoliafaucet.com | 0.5 ETH/Tag |
| Google Faucet | https://cloud.google.com/application/web3/faucet/ethereum/sepolia | 0.05 ETH |
| Infura Faucet | https://www.infura.io/faucet/sepolia | 0.5 ETH/Tag |
| Chainlink Faucet | https://faucets.chain.link/sepolia | 0.1 ETH |

**Adresse deines Deploy-Wallets eingeben → ETH wird in ~30 Sekunden gesendet.**

---

## SCHRITT 4 — Etherscan API Key (3 Min, kostenlos)

Für automatische Contract-Verifizierung:

1. **https://etherscan.io** → Sign Up / Login
2. Oben rechts: Profil → **API Keys** → „Add"
3. App Name: `Quantum Emma` → „Create New API Key"
4. In `.env` eintragen:
   ```
   ETHERSCAN_API_KEY=abc123xyz...
   ```

---

## SCHRITT 5 — .env Datei befüllen

```bash
# Im quantum-emma Projektordner:
cp .env.example .env
# Dann .env öffnen und ausfüllen:
nano .env   # oder VS Code / Notepad
```

Fertig ausgefüllte `.env`:
```env
DEPLOYER_PRIVATE_KEY=0xdein_private_key_hier
ALCHEMY_API_KEY=dein_alchemy_key
ETHERSCAN_API_KEY=dein_etherscan_key
```

---

## SCHRITT 6 — Deploy auf Sepolia! 🚀

```bash
# 1. Dependencies installieren (falls noch nicht)
npm install

# 2. Contracts kompilieren
npx hardhat compile

# 3. 🚀 AUF SEPOLIA DEPLOYEN
npx hardhat run contracts/deploy/deploy.js --network sepolia
```

**Erwartete Ausgabe:**
```
╔══════════════════════════════════════════════════════╗
║        QUANTUM EMMA — ENTERPRISE DEPLOY v2.0         ║
╚══════════════════════════════════════════════════════╝

Network:    sepolia (chainId: 11155111)
Deployer:   0xDeinWallet...
Balance:    0.15 ETH

[1/7] Deploying QEMMAToken.sol...      ✅ 0x...
[2/7] Deploying QEMMAMining.sol...     ✅ 0x...
[3/7] Deploying QEMMAStaking.sol...    ✅ 0x...
[4/7] Deploying QEMMAGovernance.sol... ✅ 0x...
[5/7] Deploying QEMMASwap.sol...       ✅ 0x...
[6/7] Deploying QEMMAMetaCodex.sol...  ✅ 0x...
[7/7] Deploying QEMMAMetaMemory.sol... ✅ 0x...

DEPLOYMENT COMPLETE ✅
```

**Dauer:** ~3–5 Minuten | **Gas:** ~0.08–0.12 ETH

---

## SCHRITT 7 — Contracts auf Etherscan verifizieren

```bash
# Nach dem Deploy — Adressen aus deployment_sepolia_*.json nehmen:
npx hardhat verify --network sepolia <QEMMA_TOKEN_ADDRESS>
npx hardhat verify --network sepolia <QEMMA_MINING_ADDRESS> <QEMMA_TOKEN_ADDRESS>
npx hardhat verify --network sepolia <QEMMA_STAKING_ADDRESS> <QEMMA_TOKEN_ADDRESS>
npx hardhat verify --network sepolia <QEMMA_GOVERNANCE_ADDRESS> <QEMMA_TOKEN_ADDRESS>
npx hardhat verify --network sepolia <QEMMA_SWAP_ADDRESS> <QEMMA_TOKEN_ADDRESS>
npx hardhat verify --network sepolia <QEMMA_METACODEX_ADDRESS>
npx hardhat verify --network sepolia <QEMMA_METAMEMORY_ADDRESS>
```

**Nach Verifizierung sichtbar auf:**  
`https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>#code`

---

## SCHRITT 8 — Contract auf Etherscan testen

1. Gehe zu `https://sepolia.etherscan.io`
2. Suche nach deiner `QEMMAToken` Adresse
3. Tab **„Contract"** → **„Read Contract"**
4. Prüfe: `name()` → `"Quantum Emma"`, `symbol()` → `"QEMMA"`, `totalSupply()`
5. Tab **„Write Contract"** → Connect MetaMask → Funktionen testen

---

## ✅ Checkliste

```
[ ] Alchemy API Key erstellt
[ ] Deploy Wallet erstellt (NICHT Haupt-Wallet)
[ ] 0.15 Sepolia ETH im Deploy Wallet
[ ] Etherscan API Key erstellt
[ ] .env Datei ausgefüllt
[ ] npx hardhat compile → erfolgreich
[ ] npx hardhat run contracts/deploy/deploy.js --network sepolia → 7/7 ✅
[ ] Alle 7 Contracts auf Etherscan verifiziert
[ ] Contract-Adressen in deployment_sepolia_*.json gespeichert
```

---

## 🔑 Zusammenfassung — Was du brauchst

| Was | Woher | Zeit |
|-----|-------|------|
| Alchemy API Key | https://alchemy.com | 5 Min |
| Deploy Wallet + Private Key | MetaMask | 3 Min |
| 0.15 Sepolia ETH | https://sepoliafaucet.com | 5 Min |
| Etherscan API Key | https://etherscan.io | 3 Min |

**Total: ~15 Minuten Setup → dann 1 Befehl → alle 7 live auf Sepolia!**

---

*© 2026 Grigori Saks — Quantum Emma Enterprise v4.1.2 — Patent Pending*
