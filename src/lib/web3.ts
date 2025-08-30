import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = '0x66FEfcCE4924F2a2dD12D0406F9C7c3EE3C2b268';
export const RPC_URL = 'https://rpc-nebulas-testnet.uniultra.xyz';
export const CHAIN_ID = 2484;

// Contract ABI - simplified for key functions
export const CONTRACT_ABI = [
  "function registerValidator(string memory nodeId, string memory referrerNodeId) external payable",
  "function submitBandwidthTest(string memory nodeId, uint256 uploadSpeed, uint256 downloadSpeed, uint256 latency, uint256 uptimePercentage, bytes32 proofHash) external",
  "function claimEarnings() external",
  "function getNodeStats(string memory nodeId) external view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)",
  "function MIN_STAKE() external pure returns (uint256)",
  "function BASE_REWARD() external pure returns (uint256)",
  "function earnings(address) external view returns (uint256)"
];

// Network configuration for U2U Testnet
export const U2U_TESTNET = {
  chainId: CHAIN_ID,
  name: 'U2U Nebulas Testnet',
  currency: 'U2U',
  explorerUrl: 'https://testnet-explorer.uniultra.xyz',
  rpcUrl: RPC_URL,
};

export class Web3Service {
  provider: ethers.BrowserProvider | null = null;
  signer: ethers.JsonRpcSigner | null = null;
  contract: ethers.Contract | null = null;

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask not found! Please install MetaMask.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Switch to U2U network if needed
      await this.switchToU2UNetwork();
      
      // Initialize contract
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      
      return {
        address,
        balance: ethers.formatEther(balance),
        chainId: await this.provider.getNetwork().then(n => n.chainId)
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async switchToU2UNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If network not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${CHAIN_ID.toString(16)}`,
              chainName: U2U_TESTNET.name,
              nativeCurrency: {
                name: U2U_TESTNET.currency,
                symbol: U2U_TESTNET.currency,
                decimals: 18,
              },
              rpcUrls: [U2U_TESTNET.rpcUrl],
              blockExplorerUrls: [U2U_TESTNET.explorerUrl],
            },
          ],
        });
      }
    }
  }

  async registerValidator(nodeId: string, referrerNodeId: string = '') {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const minStake = await this.contract.MIN_STAKE();
    
    return await this.contract.registerValidator(nodeId, referrerNodeId, {
      value: minStake
    });
  }

  async submitBandwidthTest(
    nodeId: string, 
    uploadSpeed: number, 
    downloadSpeed: number, 
    latency: number, 
    uptime: number
  ) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const proofHash = ethers.keccak256(ethers.toUtf8Bytes(`${nodeId}-${Date.now()}`));
    
    return await this.contract.submitBandwidthTest(
      nodeId, uploadSpeed, downloadSpeed, latency, uptime, proofHash
    );
  }

  async claimEarnings() {
    if (!this.contract) throw new Error('Contract not initialized');
    return await this.contract.claimEarnings();
  }

  async getNodeStats(nodeId: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    return await this.contract.getNodeStats(nodeId);
  }

  async getEarnings(address: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    return await this.contract.earnings(address);
  }
}

export const web3Service = new Web3Service();
