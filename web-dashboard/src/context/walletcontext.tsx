'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { web3Service } from '@/lib/web3';

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  registerValidator: (nodeId: string, referrer?: string) => Promise<any>;
  submitTest: (nodeId: string, upload: number, download: number, latency: number, uptime: number) => Promise<any>;
  claimRewards: () => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
  });

  const connectWallet = async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));
    
    try {
      const result = await web3Service.connectWallet();
      
      setWallet({
        address: result.address,
        balance: result.balance,
        chainId: Number(result.chainId),
        isConnected: true,
        isConnecting: false,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  };

  const disconnect = () => {
    setWallet({
      address: null,
      balance: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
    });
  };

  const registerValidator = async (nodeId: string, referrer: string = '') => {
    return await web3Service.registerValidator(nodeId, referrer);
  };

  const submitTest = async (
    nodeId: string,
    upload: number,
    download: number,
    latency: number,
    uptime: number
  ) => {
    return await web3Service.submitBandwidthTest(nodeId, upload, download, latency, uptime);
  };

  const claimRewards = async () => {
    return await web3Service.claimEarnings();
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      wallet,
      connectWallet,
      disconnect,
      registerValidator,
      submitTest,
      claimRewards
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
