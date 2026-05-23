require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY   = process.env.DEPLOYER_PRIVATE_KEY  || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const ALCHEMY_KEY   = process.env.ALCHEMY_API_KEY       || "";
const INFURA_KEY    = process.env.INFURA_API_KEY         || "";
const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY      || "";

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.26",
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: "cancun",
          viaIR: true,
        },
      },
    ],
  },
  paths: {
    sources:   "./contracts",
    tests:     "./contracts/test",
    cache:     "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
      hardfork: "cancun",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 10,
        accountsBalance: "10000000000000000000000",
      },
    },
    sepolia: {
      url: ALCHEMY_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      gasPrice: "auto",
    },
    mainnet: {
      url: ALCHEMY_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
      chainId: 1,
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: { mainnet: ETHERSCAN_KEY, sepolia: ETHERSCAN_KEY },
  },
  mocha: { timeout: 120000 },
};
