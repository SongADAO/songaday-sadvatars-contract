import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "hardhat-abi-exporter";

dotenv.config();

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: String(process.env.ETHERSCAN_API_KEY),
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: String(process.env.COINMARKETCAP_API_KEY),
    gasPrice: 5,
  },
  networks: {
    localhost: {
      from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // want this contract owner
      url: "http://127.0.0.1:8545",
    },
    mainnet: {
      accounts: [String(process.env.MAINNET_PRIVATE_KEY)],
      from: process.env.MAINNET_FROM, // want this contract owner
      url: process.env.MAINNET_URL,
    },
    sepolia: {
      accounts: [String(process.env.SEPOLIA_PRIVATE_KEY)],
      from: process.env.SEPOLIA_FROM, // want this contract owner
      url: process.env.SEPOLIA_URL,
    },
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    version: "0.8.24",
  },
};

export default config;
