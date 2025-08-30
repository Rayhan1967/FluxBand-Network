require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const U2U_RPC_URL = process.env.U2U_RPC_URL || "https://rpc-nebulas-testnet.uniultra.xyz";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const validatePrivateKey = (key) => {
  if (!key) return false;
  const cleanKey = key.startsWith('0x') ? key : `0x${key}`;
  return cleanKey.length === 66 && /^0x[a-fA-F0-9]{64}$/.test(cleanKey);
};

const formatPrivateKey = (key) => {
  if (!key) return "";
  return key.startsWith('0x') ? key : `0x${key}`;
};

module.exports = {
  solidity: {
    // ✅ Updated to match OpenZeppelin v5.4.0 requirements
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    }
  },
  
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      gasPrice: 20000000000,
      allowUnlimitedContractSize: true,
    },
    
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    
    u2u_testnet: {
      url: U2U_RPC_URL,
      accounts: validatePrivateKey(PRIVATE_KEY) ? [formatPrivateKey(PRIVATE_KEY)] : [],
      chainId: 2484,
      gas: 8000000,
      gasPrice: 20000000000,
      timeout: 60000,
      confirmations: 2,
    },
    
    u2u_mainnet: {
      url: "https://rpc-mainnet.uniultra.xyz",
      accounts: validatePrivateKey(PRIVATE_KEY) ? [formatPrivateKey(PRIVATE_KEY)] : [],
      chainId: 39,
      gas: 8000000,
      gasPrice: 20000000000,
      timeout: 60000,
      confirmations: 5,
    }
  },
  
  etherscan: {
    apiKey: {
      u2u_testnet: ETHERSCAN_API_KEY,
      u2u_mainnet: ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "u2u_testnet",
        chainId: 2484,
        urls: {
          apiURL: "https://testnet-explorer.uniultra.xyz/api",
          browserURL: "https://testnet-explorer.uniultra.xyz"
        }
      },
      {
        network: "u2u_mainnet", 
        chainId: 39,
        urls: {
          apiURL: "https://explorer.uniultra.xyz/api",
          browserURL: "https://explorer.uniultra.xyz"
        }
      }
    ]
  },
  
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 20,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  
  mocha: {
    timeout: 60000,
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
