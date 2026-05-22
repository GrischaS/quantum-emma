// ============================================================
//  QUANTUM EMMA — Enterprise Deploy Script
//  Deploys all 7 contracts in order with proper linking
//  © 2026 Grigori Saks — All Rights Reserved
// ============================================================

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// ── Colors for terminal output ─────────────────────────────
const GREEN  = "\x1b[32m";
const GOLD   = "\x1b[33m";
const CYAN   = "\x1b[36m";
const PURPLE = "\x1b[35m";
const RED    = "\x1b[31m";
const RESET  = "\x1b[0m";

function log(color, msg) { console.log(`${color}${msg}${RESET}`); }

async function main() {
  console.log(`
${PURPLE}╔══════════════════════════════════════════════════════╗
║        QUANTUM EMMA — ENTERPRISE DEPLOY v2.0         ║
║     Meta Genius TR2 · 7 Contracts · © Grigori Saks   ║
╚══════════════════════════════════════════════════════╝${RESET}
  `);

  const [deployer] = await ethers.getSigners();
  const balance    = await deployer.provider.getBalance(deployer.address);
  const network    = await deployer.provider.getNetwork();

  log(CYAN, `Network:    ${network.name} (chainId: ${network.chainId})`);
  log(CYAN, `Deployer:   ${deployer.address}`);
  log(GOLD, `Balance:    ${ethers.formatEther(balance)} ETH`);
  log(GOLD, `Owner:      Grigori Saks — grischasaks@gmail.com`);
  console.log("");

  if (parseFloat(ethers.formatEther(balance)) < 0.05) {
    log(RED, "❌ Insufficient ETH balance! Need at least 0.05 ETH for gas.");
    log(RED, "   Get Sepolia ETH at: https://sepoliafaucet.com");
    process.exit(1);
  }

  const addresses = {};
  const startTime = Date.now();

  // ── 1. QEMMAToken ────────────────────────────────────────
  log(PURPLE, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(PURPLE, "[1/7] Deploying QEMMAToken.sol...");
  const Token = await ethers.getContractFactory("QEMMAToken");
  const token = await Token.deploy(
    deployer.address,  // initialOwner
    deployer.address,  // miningPool
    deployer.address   // stakingPool
  );
  await token.waitForDeployment();
  addresses.QEMMAToken = await token.getAddress();
  log(GREEN, `✅ QEMMAToken deployed: ${addresses.QEMMAToken}`);

  // ── 2. QEMMAMining ───────────────────────────────────────
  log(PURPLE, "[2/7] Deploying QEMMAMining.sol...");
  const Mining = await ethers.getContractFactory("QEMMAMining");
  const mining = await Mining.deploy(addresses.QEMMAToken);
  await mining.waitForDeployment();
  addresses.QEMMAMining = await mining.getAddress();
  log(GREEN, `✅ QEMMAMining deployed: ${addresses.QEMMAMining}`);

  // ── 3. QEMMAStaking ──────────────────────────────────────
  log(PURPLE, "[3/7] Deploying QEMMAStaking.sol...");
  const Staking = await ethers.getContractFactory("QEMMAStaking");
  const staking = await Staking.deploy(addresses.QEMMAToken);
  await staking.waitForDeployment();
  addresses.QEMMAStaking = await staking.getAddress();
  log(GREEN, `✅ QEMMAStaking deployed: ${addresses.QEMMAStaking}`);

  // ── 4. QEMMAGovernance ───────────────────────────────────
  log(PURPLE, "[4/7] Deploying QEMMAGovernance.sol...");
  const Governance = await ethers.getContractFactory("QEMMAGovernance");
  const governance = await Governance.deploy(addresses.QEMMAToken);
  await governance.waitForDeployment();
  addresses.QEMMAGovernance = await governance.getAddress();
  log(GREEN, `✅ QEMMAGovernance deployed: ${addresses.QEMMAGovernance}`);

  // ── 5. QEMMASwap ─────────────────────────────────────────
  log(PURPLE, "[5/7] Deploying QEMMASwap.sol...");
  // Uniswap V3 Router address (same on all networks)
  const UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const Swap = await ethers.getContractFactory("QEMMASwap");
  const swap = await Swap.deploy(addresses.QEMMAToken, UNISWAP_V3_ROUTER);
  await swap.waitForDeployment();
  addresses.QEMMASwap = await swap.getAddress();
  log(GREEN, `✅ QEMMASwap deployed: ${addresses.QEMMASwap}`);

  // ── 6. QEMMAMetaCodex ────────────────────────────────────
  log(PURPLE, "[6/7] Deploying QEMMAMetaCodex.sol...");
  const MetaCodex = await ethers.getContractFactory("QEMMAMetaCodex");
  const metaCodex = await MetaCodex.deploy(addresses.QEMMAToken);
  await metaCodex.waitForDeployment();
  addresses.QEMMAMetaCodex = await metaCodex.getAddress();
  log(GREEN, `✅ QEMMAMetaCodex deployed: ${addresses.QEMMAMetaCodex}`);

  // ── 7. QEMMAMetaMemory ───────────────────────────────────
  log(PURPLE, "[7/7] Deploying QEMMAMetaMemory.sol...");
  const MetaMemory = await ethers.getContractFactory("QEMMAMetaMemory");
  const metaMemory = await MetaMemory.deploy();
  await metaMemory.waitForDeployment();
  addresses.QEMMAMetaMemory = await metaMemory.getAddress();
  log(GREEN, `✅ QEMMAMetaMemory deployed: ${addresses.QEMMAMetaMemory}`);

  // ── Post-Deploy Setup ────────────────────────────────────
  log(CYAN, "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(CYAN, "🔧 Post-deploy configuration...");

  // Authorize Mining contract to mint
  try {
    const MINER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINER_ROLE"));
    await token.grantRole(MINER_ROLE, addresses.QEMMAMining);
    log(GREEN, "✅ MINER_ROLE granted to Mining contract");
  } catch(e) { log(GOLD, "⚠️  MINER_ROLE: " + e.message.slice(0,60)); }

  // Authorize Staking contract
  try {
    const STAKING_ROLE = ethers.keccak256(ethers.toUtf8Bytes("STAKING_ROLE"));
    await token.grantRole(STAKING_ROLE, addresses.QEMMAStaking);
    log(GREEN, "✅ STAKING_ROLE granted to Staking contract");
  } catch(e) { log(GOLD, "⚠️  STAKING_ROLE: " + e.message.slice(0,60)); }

  // ── Save addresses ────────────────────────────────────────
  const deploymentData = {
    network:    network.name,
    chainId:    network.chainId.toString(),
    deployer:   deployer.address,
    owner:      "Grigori Saks — grischasaks@gmail.com",
    timestamp:  new Date().toISOString(),
    duration:   `${((Date.now()-startTime)/1000).toFixed(1)}s`,
    addresses,
    verifyCommands: Object.entries(addresses).map(([name, addr]) =>
      `npx hardhat verify --network ${network.name} ${addr}`
    ),
  };

  const outPath = path.join(__dirname, `deployment_${network.name}_${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(deploymentData, null, 2));

  // ── Summary ───────────────────────────────────────────────
  console.log(`
${GOLD}╔══════════════════════════════════════════════════════╗
║              DEPLOYMENT COMPLETE ✅                   ║
╚══════════════════════════════════════════════════════╝${RESET}

${CYAN}Network:${RESET}    ${network.name} (${network.chainId})
${CYAN}Duration:${RESET}   ${((Date.now()-startTime)/1000).toFixed(1)}s
${CYAN}Owner:${RESET}      Grigori Saks

${GREEN}CONTRACT ADDRESSES:${RESET}
${Object.entries(addresses).map(([k,v])=>`  ${k.padEnd(20)}: ${v}`).join("\n")}

${PURPLE}VERIFY ON ETHERSCAN:${RESET}
${Object.entries(addresses).map(([,v])=>`  npx hardhat verify --network ${network.name} ${v}`).join("\n")}

${GOLD}Deployment saved to: ${outPath}${RESET}

${PURPLE}© 2026 Grigori Saks — All Rights Reserved — Patent Pending${RESET}
  `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\x1b[31m❌ Deploy failed:\x1b[0m", error);
    process.exit(1);
  });
