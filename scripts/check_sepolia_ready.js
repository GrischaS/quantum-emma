const { ethers } = require("ethers");
require("dotenv").config({ path: ".env" });

async function main() {
  console.log("\n⚛️  QUANTUM EMMA — Sepolia Pre-Deploy Check");
  console.log("=".repeat(50));

  const checks = {
    "DEPLOYER_PRIVATE_KEY": process.env.DEPLOYER_PRIVATE_KEY,
    "ALCHEMY_API_KEY":      process.env.ALCHEMY_API_KEY,
    "ETHERSCAN_API_KEY":    process.env.ETHERSCAN_API_KEY,
  };

  let allGood = true;
  for (const [key, val] of Object.entries(checks)) {
    if (!val || val.includes("YOUR_") || val.includes("your_")) {
      console.log(`  X  ${key}: NOT SET`);
      allGood = false;
    } else {
      console.log(`  OK ${key}: SET (${val.slice(0,8)}...)`);
    }
  }

  if (!allGood) {
    console.log("\n  Fill in .env file first — see deployment/SEPOLIA_DEPLOY.md\n");
    process.exit(1);
  }

  console.log("\n  Connecting to Sepolia via Alchemy...");
  try {
    const provider = new ethers.AlchemyProvider("sepolia", process.env.ALCHEMY_API_KEY);
    const wallet   = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
    const balance  = await provider.getBalance(wallet.address);
    const eth      = parseFloat(ethers.formatEther(balance));
    const block    = await provider.getBlockNumber();

    console.log(`  Address : ${wallet.address}`);
    console.log(`  Balance : ${eth.toFixed(4)} ETH`);
    console.log(`  Block   : #${block}`);

    if (eth < 0.08) {
      console.log(`\n  NOT ENOUGH ETH! Need ~0.10 ETH`);
      console.log(`  Get Sepolia ETH: https://sepoliafaucet.com\n`);
      process.exit(1);
    }

    console.log(`\n  ALL CHECKS PASSED - Ready to deploy!`);
    console.log(`  Run: npx hardhat run contracts/deploy/deploy.js --network sepolia\n`);
  } catch(e) {
    console.log(`  Connection failed: ${e.message}\n`);
    process.exit(1);
  }
}
main();
