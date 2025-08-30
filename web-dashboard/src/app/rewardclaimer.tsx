'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../context/walletcontext';
import { web3Service } from '@/lib/web3';

export function RewardClaimer() {
  const { wallet, claimRewards } = useWallet();
  const [earnings, setEarnings] = useState('0');
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      loadEarnings();
    }
  }, [wallet.isConnected, wallet.address]);

  const loadEarnings = async () => {
    if (!wallet.address) return;
    
    setIsLoading(true);
    try {
      const earningsWei = await web3Service.getEarnings(wallet.address);
      const earningsEth = web3Service.provider ? 
        (await import('ethers')).ethers.formatEther(earningsWei) : '0';
      setEarnings(earningsEth);
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      const tx = await claimRewards();
      alert(`Claim submitted! TX: ${tx.hash}`);
      await tx.wait();
      alert('Rewards claimed successfully! 🎉');
      await loadEarnings(); // Refresh earnings
    } catch (error: any) {
      alert(`Claim failed: ${error.message}`);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!wallet.isConnected) {
    return (
      <div className="card p-6 text-center">
        <h3 className="text-xl font-bold text-primary mb-4">💰 Reward Center</h3>
        <p className="text-text-secondary">Connect wallet to view and claim rewards</p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-2">💰 Reward Center</h3>
        <p className="text-text-secondary">Claim your earned rewards from bandwidth validation</p>
      </div>

      {/* Earnings Display */}
      <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-surface-light rounded mb-2"></div>
            <div className="h-4 bg-surface-light rounded"></div>
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold text-primary mb-2">
              {parseFloat(earnings).toFixed(4)} U2U
            </div>
            <div className="text-text-secondary">Available Rewards</div>
          </>
        )}
      </div>

      {/* Reward Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-surface-light rounded-lg">
          <div className="text-xl font-bold text-green-400">+2.5</div>
          <div className="text-xs text-text-secondary">Today's Earnings</div>
        </div>
        <div className="text-center p-4 bg-surface-light rounded-lg">
          <div className="text-xl font-bold text-yellow-400">156</div>
          <div className="text-xs text-text-secondary">Total Tests</div>
        </div>
        <div className="text-center p-4 bg-surface-light rounded-lg">
          <div className="text-xl font-bold text-purple-400">98.5%</div>
          <div className="text-xs text-text-secondary">Success Rate</div>
        </div>
        <div className="text-center p-4 bg-surface-light rounded-lg">
          <div className="text-xl font-bold text-accent">12</div>
          <div className="text-xs text-text-secondary">Proof Shards</div>
        </div>
      </div>

      {/* Claim Button */}
      <button
        onClick={handleClaim}
        disabled={isClaiming || parseFloat(earnings) === 0 || isLoading}
        className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isClaiming ? '⏳ Claiming...' : 
         parseFloat(earnings) === 0 ? '💰 No Rewards Available' : 
         `🎉 Claim ${parseFloat(earnings).toFixed(4)} U2U`}
      </button>

      {/* Refresh Button */}
      <button
        onClick={loadEarnings}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-surface-light hover:bg-surface rounded-lg transition-all text-sm"
      >
        🔄 Refresh Earnings
      </button>
    </div>
  );
}
