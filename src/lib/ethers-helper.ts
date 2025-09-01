import { ethers } from 'ethers';

// Helper functions for ethers v6
export class EthersHelper {
  // Format ether amount
  static formatEther(wei: bigint | string): string {
    return ethers.formatEther(wei);
  }

  // Parse ether amount
  static parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }

  // Verify message signature
  static verifyMessage(message: string, signature: string): string {
    return ethers.verifyMessage(message, signature);
  }

  // Get provider
  static getBrowserProvider(): ethers.BrowserProvider | null {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
  }

  // Get JSON RPC provider
  static getJsonRpcProvider(url: string): ethers.JsonRpcProvider {
    return new ethers.JsonRpcProvider(url);
  }

  // Create contract instance
  static createContract(
    address: string, 
    abi: any[], 
    signerOrProvider: ethers.Signer | ethers.Provider
  ): ethers.Contract {
    return new ethers.Contract(address, abi, signerOrProvider);
  }
}
