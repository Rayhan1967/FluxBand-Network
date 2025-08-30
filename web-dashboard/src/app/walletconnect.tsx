'use client';

import { useState } from 'react';
import { useWallet } from '../context/walletcontext';

export function WalletConnect() {
  const { wallet, connectWallet, disconnect, registerValidator } = useWallet();
  const [isRegistering, setIsRegistering] = useState(false);
  const [nodeId, setNodeId] = useState('');

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error: any) {
      alert(`Failed to connect: ${error.message}`);
    }
  };

  const handleRegisterValidator = async () => {
    if (!nodeId.trim()) {
      alert('Please enter a node ID');
      return;
    }

    setIsRegistering(true);
    try {
      const tx = await registerValidator(nodeId);
      alert(`Registration submitted! TX: ${tx.hash}`);
      await tx.wait();
      alert('Registration confirmed!');
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  if (!wallet.isConnected) {
    return (
      <div className="text-center">
        <button
          onClick={handleConnect}
          disabled={wallet.isConnecting}
          className="btn-primary text-lg px-8 py-4"
        >
          {wallet.isConnecting ? '🔄 Connecting...' : '🔗 CONNECT WALLET'}
        </button>
        <p className="text-sm text-text-secondary mt-4">
          Connect your MetaMask wallet to start hunting proofs
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-primary mb-4">👛 Wallet Connected</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-text-secondary">Address:</span>{' '}
            <span className="font-mono text-accent">{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
          </div>
          <div>
            <span className="text-text-secondary">Balance:</span>{' '}
            <span className="text-primary">{wallet.balance} U2U</span>
          </div>
          <div>
            <span className="text-text-secondary">Network:</span>{' '}
            <span className="text-green-400">U2U Testnet</span>
          </div>
        </div>
        
        <button
          onClick={disconnect}
          className="mt-4 px-4 py-2 bg-surface-light hover:bg-surface text-sm rounded-lg transition-all"
        >
          Disconnect
        </button>
      </div>

      {/* Validator Registration */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-primary mb-4">🎯 Register as Validator</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your node ID (e.g., validator-001)"
            value={nodeId}
            onChange={(e) => setNodeId(e.target.value)}
            className="w-full px-4 py-3 bg-surface-light border border-surface rounded-lg text-text-primary placeholder-text-secondary focus:border-primary focus:outline-none"
          />
          
          <div className="text-sm text-text-secondary">
            <p>• Minimum stake: <span className="text-primary">50 U2U</span></p>
            <p>• Registration fee will be deducted from your balance</p>
            <p>• You'll earn rewards for bandwidth validation</p>
          </div>

          <button
            onClick={handleRegisterValidator}
            disabled={isRegistering || !nodeId.trim()}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegistering ? '⏳ Registering...' : '🚀 Register Validator'}
          </button>
        </div>
      </div>
    </div>
  );
}
