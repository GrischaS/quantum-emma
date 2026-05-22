// ============================================================
//  QUANTUM EMMA — Hardhat Config
//  Sepolia Testnet + Ethereum Mainnet
//  © 2026 Grigori Saks
// ============================================================

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY  = process.env.PRIVATE_KEY  || "0x0000000000000000000000000000000000000000000000000000000000000001";
const INFURA_KEY   = process.env.INFURA_KEY   || "";
const ETHERSCAN_KEY= process.env.ETHERSCAN_KEY|| "";
const ALCHEMY_KEY  = process.env.ALCHEMY_KEY  || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    // ── Local ───────────────────────────────────────────────
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337,
      gas: "auto",
    },
    // ── Sepolia Testnet ─────────────────────────────────────
    sepolia: {
      url: ALCHEMY_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      gasPrice: "auto",
    },
    // ── Goerli Testnet ──────────────────────────────────────
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    // ── Ethereum Mainnet ────────────────────────────────────
    mainnet: {
      url: ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 1,
      gasPrice: "auto",
    },
    // ── Polygon ─────────────────────────────────────────────
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [PRIVATE_KEY],
      chainId: 137,
    },
    // ── BSC ─────────────────────────────────────────────────
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      accounts: [PRIVATE_KEY],
      chainId: 56,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_KEY,
      sepolia: ETHERSCAN_KEY,
      goerli:  ETHERSCAN_KEY,
      polygon: process.env.POLYGONSCAN_KEY || "",
      bsc:     process.env.BSCSCAN_KEY     || "",
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 21,
    coinmarketcap: process.env.CMC_API_KEY || "",
  },
  paths: {
    sources:   "./contracts",
    tests:     "./test",
    cache:     "./cache",
    artifacts: "./artifacts",
  },
};
