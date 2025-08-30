import { useState, useCallback } from 'react';

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
}

interface UseWalletReturn extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
  });

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      setWalletState(prev => ({
        ...prev,
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        isConnected: true,
        isConnecting: false,
      }));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({ ...prev, isConnecting: false }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      balance: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
    });
  }, []);

  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
}

export default useWallet;