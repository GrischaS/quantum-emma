// ============================================================
//  QUANTUM EMMA — Hardhat Config v5.2
//  Networks: localhost · Sepolia · Mainnet · Polygon
//  (c) 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const DEPLOYER_KEY  = process.env.DEPLOYER_PRIVATE_KEY || "0x" + "0".repeat(64);
const ALCHEMY_KEY   = process.env.ALCHEMY_API_KEY      || "";
const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY    || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: false,
    },
  },

  networks: {
    // ── Local development ────────────────────────────────────
    hardhat: {
      chainId: 31337,
      gas: "auto",
      allowUnlimitedContractSize: false,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    // ── Sepolia Testnet ──────────────────────────────────────
    sepolia: {
      url: ALCHEMY_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://rpc.sepolia.org",
      accounts: [DEPLOYER_KEY],
      chainId:  11155111,
      gasPrice: "auto",
      gas:      5000000,
      timeout:  120000,
    },

    // ── Ethereum Mainnet ─────────────────────────────────────
    mainnet: {
      url: ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://eth.llamarpc.com",
      accounts: [DEPLOYER_KEY],
      chainId:  1,
      gasPrice: "auto",
      timeout:  180000,
    },

    // ── Polygon ──────────────────────────────────────────────
    polygon: {
      url: ALCHEMY_KEY
        ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://polygon-rpc.com",
      accounts: [DEPLOYER_KEY],
      chainId:  137,
    },

    // ── Base (Coinbase L2) ────────────────────────────────────
    base: {
      url: "https://mainnet.base.org",
      accounts: [DEPLOYER_KEY],
      chainId:  8453,
    },
  },

  etherscan: {
    apiKey: {
      mainnet:        ETHERSCAN_KEY,
      sepolia:        ETHERSCAN_KEY,
      polygon:        process.env.POLYGONSCAN_API_KEY || "",
    },
  },

  gasReporter: {
    enabled:      process.env.REPORT_GAS === "true",
    currency:     "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "",
    outputFile:   "gas-report.txt",
    noColors:     true,
  },

  paths: {
    sources:   "./contracts",
    tests:     "./contracts/test",
    cache:     "./cache",
    artifacts: "./artifacts",
  },

  mocha: {
    timeout: 120000,
  },
};
