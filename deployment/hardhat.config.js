// ============================================================
//  QUANTUM EMMA — Hardhat Configuration v4.1
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // hardhat default

const INFURA_KEY    = process.env.INFURA_API_KEY    || "";
const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY || "";
const ALCHEMY_KEY   = process.env.ALCHEMY_API_KEY   || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // ─── SOLIDITY ─────────────────────────────────────────────
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: false,
    },
  },

  // ─── PATHS ────────────────────────────────────────────────
  paths: {
    sources:   "./contracts",
    tests:     "./contracts/test",
    cache:     "./cache",
    artifacts: "./artifacts",
  },

  // ─── NETWORKS ─────────────────────────────────────────────
  networks: {
    // Local
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 0,
      },
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 10,
        accountsBalance: "10000000000000000000000", // 10k ETH each
      },
    },

    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    // Testnets
    sepolia: {
      url: ALCHEMY_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      gasPrice: "auto",
    },

    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },

    // Mainnet
    mainnet: {
      url: ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 1,
      gasPrice: "auto",
    },

    // Polygon
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 137,
    },

    polygonMumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
  },

  // ─── GAS REPORTER ─────────────────────────────────────────
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 20,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "",
    outputFile: "gas-report.txt",
    noColors: true,
    reportFormat: "terminal",
  },

  // ─── ETHERSCAN VERIFICATION ───────────────────────────────
  etherscan: {
    apiKey: {
      mainnet:        ETHERSCAN_KEY,
      sepolia:        ETHERSCAN_KEY,
      goerli:         ETHERSCAN_KEY,
      polygon:        process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai:  process.env.POLYGONSCAN_API_KEY || "",
    },
  },

  // ─── MOCHA (TEST TIMEOUT) ─────────────────────────────────
  mocha: {
    timeout: 60000, // 60s per test
    reporter: "spec",
  },
};
