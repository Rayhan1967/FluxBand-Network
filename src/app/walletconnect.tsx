'use client';

import { useState } from 'react';
import { useWallet } from '../context/walletcontext';

export function WalletConnect() {
  const { wallet, connectWallet, disconnect, registerNode, isLoading } = useWallet();
  const [isRegistering, setIsRegistering] = useState(false);
  const [nodeId, setNodeId] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [nodeLocation, setNodeLocation] = useState('');

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error: any) {
      alert(`Failed to connect: ${error.message}`);
    }
  };

  // ✅ FIXED: Updated function to match registerNode signature
  const handleRegisterValidator = async () => {
    if (!nodeName.trim()) {
      alert('Please enter a node name');
      return;
    }

    setIsRegistering(true);
    try {
      // ✅ FIXED: registerNode expects (name, location, ipAddress)
      await registerNode(
        nodeName, 
        nodeLocation || 'Unknown Location', 
        '0.0.0.0' // Default IP, akan diganti dengan actual IP detection
      );
      
      alert('Node registration successful!');
      setNodeId('');
      setNodeName('');
      setNodeLocation('');
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  // ✅ FIXED: Check isLoading dari useWallet instead of wallet.isConnecting
  if (!wallet.isConnected) {
    return (
      <div className="text-center">
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
        >
          {isLoading ? '🔄 Connecting...' : '🔗 CONNECT WALLET'}
        </button>
        <p className="text-sm text-slate-400 mt-4">
          Connect your MetaMask wallet to start validating bandwidth
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4">👛 Wallet Connected</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-slate-400">Address:</span>{' '}
            <span className="font-mono text-cyan-400">{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
          </div>
          <div>
            <span className="text-slate-400">Balance:</span>{' '}
            <span className="text-green-400">{wallet.balance} U2U</span>
          </div>
          <div>
            <span className="text-slate-400">Network:</span>{' '}
            <span className="text-green-400">U2U Testnet</span>
          </div>
        </div>
        
        <button
          onClick={disconnect}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-all"
        >
          Disconnect
        </button>
      </div>

      {/* Validator Registration */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4">🎯 Register as Validator</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter node name (e.g., validator-001)"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
          
          <input
            type="text"
            placeholder="Enter location (e.g., Singapore, USA)"
            value={nodeLocation}
            onChange={(e) => setNodeLocation(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
          
          <div className="text-sm text-slate-400">
            <p>• Registration will create your validator node</p>
            <p>• You'll earn rewards for bandwidth validation</p>
            <p>• Node will be active immediately after registration</p>
          </div>

          <button
            onClick={handleRegisterValidator}
            disabled={isRegistering || !nodeName.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegistering ? '⏳ Registering...' : '🚀 Register Validator'}
          </button>
        </div>
      </div>
    </div>
  );
}
