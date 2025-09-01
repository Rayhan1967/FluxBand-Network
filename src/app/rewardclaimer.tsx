// src/app/RewardClaimer.tsx - Real Smart Contract Integration

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../context/walletcontext';
import { ethers } from 'ethers';

interface PendingReward {
  amount: string;
  timestamp: Date;
  proofHash: string;
  rewardType: number;
  claimed: boolean;
  displayType: string;
  icon: string;
  color: string;
}

interface UserStats {
  totalEarnings: string;
  claimedRewards: string;
  pendingRewards: string;
  totalTests: number;
  referralEarnings: string;
  stakingRewards: string;
}

export function RewardClaimer() {
  const { 
    isConnected, 
    address,
    u2uBalance,
    fluxBandContract,
    claimAllRewards,
    getUserProfile,
    refreshBalances
  } = useWallet();

  const [userStats, setUserStats] = useState<UserStats>({
    totalEarnings: '0',
    claimedRewards: '0',
    pendingRewards: '0',
    totalTests: 0,
    referralEarnings: '0',
    stakingRewards: '0'
  });

  const [pendingRewards, setPendingRewards] = useState<PendingReward[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isClaimingAll, setIsClaimingAll] = useState(false);
  const [isClaimingSingle, setIsClaimingSingle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reward type mapping
  const rewardTypeMap = {
    0: { name: 'Bandwidth Test', icon: '⚡', color: 'from-blue-500 to-cyan-500' },
    1: { name: 'Referral Bonus', icon: '👥', color: 'from-purple-500 to-pink-500' },
    2: { name: 'Staking Reward', icon: '💎', color: 'from-green-500 to-emerald-500' },
    3: { name: 'Achievement', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
    4: { name: 'Daily Bonus', icon: '🎁', color: 'from-red-500 to-rose-500' }
  };

  // Load user data from smart contract
  const loadUserData = useCallback(async () => {
    if (!fluxBandContract || !address) return;

    setIsLoading(true);
    try {
      // Get user profile
      const profile = await getUserProfile();
      
      // Get pending rewards
      const pendingRewardsData = await fluxBandContract.getUserPendingRewards(address);
      const totalPendingAmount = await fluxBandContract.getPendingRewards(address);

      // Process pending rewards
      const processedRewards: PendingReward[] = pendingRewardsData
        .filter((reward: any) => !reward.claimed)
        .map((reward: any, index: number) => {
          const rewardType = Number(reward.rewardType);
          const typeInfo = rewardTypeMap[rewardType as keyof typeof rewardTypeMap] || rewardTypeMap[0];
          
          return {
            amount: ethers.formatEther(reward.amount),
            timestamp: new Date(Number(reward.timestamp) * 1000),
            proofHash: reward.proofHash,
            rewardType,
            claimed: reward.claimed,
            displayType: typeInfo.name,
            icon: typeInfo.icon,
            color: typeInfo.color
          };
        });

      setPendingRewards(processedRewards);

      // Update user stats
      setUserStats({
        totalEarnings: profile.totalEarnings,
        claimedRewards: (parseFloat(profile.totalEarnings) - parseFloat(ethers.formatEther(totalPendingAmount))).toFixed(4),
        pendingRewards: ethers.formatEther(totalPendingAmount),
        totalTests: profile.totalTests,
        referralEarnings: '0', // Would need separate tracking
        stakingRewards: '0' // Would need separate tracking
      });

      // Load recent transactions (mock data for demo)
      const mockTransactions = [
        {
          id: '1',
          type: 'Bandwidth Test',
          amount: '5.2',
          timestamp: new Date(Date.now() - 1800000),
          status: 'confirmed',
          hash: '0x1234...5678'
        },
        {
          id: '2', 
          type: 'Referral Bonus',
          amount: '1.8',
          timestamp: new Date(Date.now() - 3600000),
          status: 'confirmed',
          hash: '0x2345...6789'
        }
      ];
      setRecentTransactions(mockTransactions);

    } catch (error: any) {
      console.error('Failed to load user data:', error);
      setError(`Failed to load reward data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [fluxBandContract, address, getUserProfile]);

  // Claim all pending rewards
  const handleClaimAll = async () => {
    if (!fluxBandContract || pendingRewards.length === 0) {
      setError('No rewards to claim');
      return;
    }

    setIsClaimingAll(true);
    setError(null);

    try {
      await claimAllRewards();
      
      setSuccessMessage(`Successfully claimed ${userStats.pendingRewards} U2U tokens!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Refresh data
      await loadUserData();
      await refreshBalances();

    } catch (error: any) {
      console.error('Failed to claim rewards:', error);
      setError(`Failed to claim rewards: ${error.message}`);
    } finally {
      setIsClaimingAll(false);
    }
  };

  // Claim single reward
  const handleClaimSingle = async (reward: PendingReward) => {
    if (!fluxBandContract) return;

    setIsClaimingSingle(reward.proofHash);
    setError(null);

    try {
      const tx = await fluxBandContract.claimReward(reward.proofHash);
      await tx.wait();
      
      setSuccessMessage(`Successfully claimed ${reward.amount} U2U!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Refresh data
      await loadUserData();
      await refreshBalances();

    } catch (error: any) {
      console.error('Failed to claim single reward:', error);
      setError(`Failed to claim reward: ${error.message}`);
    } finally {
      setIsClaimingSingle(null);
    }
  };

  // Format time ago
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  useEffect(() => {
    if (isConnected && fluxBandContract) {
      loadUserData();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadUserData, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, fluxBandContract, loadUserData]);

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">👛</div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">Wallet Not Connected</h3>
        <p className="text-slate-400">Please connect your wallet to view and claim rewards.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Reward Center</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Track your earnings from bandwidth testing, referrals, staking, and achievements.
          All rewards are secured by smart contracts on the U2U Network.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-3xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-bold text-lg">{userStats.totalEarnings}</div>
              <div className="text-xs text-green-300">U2U</div>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">Total Earnings</div>
          <div className="text-green-400 text-sm">Lifetime rewards earned</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="text-right">
              <div className="text-blue-400 font-bold text-lg">{userStats.pendingRewards}</div>
              <div className="text-xs text-blue-300">U2U</div>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">Pending Rewards</div>
          <div className="text-blue-400 text-sm">Ready to claim</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-right">
              <div className="text-purple-400 font-bold text-lg">{userStats.claimedRewards}</div>
              <div className="text-xs text-purple-300">U2U</div>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">Claimed</div>
          <div className="text-purple-400 text-sm">In your wallet</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold text-lg">{userStats.totalTests}</div>
              <div className="text-xs text-yellow-300">Tests</div>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">Total Tests</div>
          <div className="text-yellow-400 text-sm">Bandwidth validations</div>
        </div>
      </div>

      {/* Current Balance */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">U2U</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{parseFloat(u2uBalance).toFixed(4)} U2U</div>
              <div className="text-slate-400">Current wallet balance</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-green-400 font-bold text-lg">
              ${(parseFloat(u2uBalance) * 0.1).toFixed(2)}
            </div>
            <div className="text-slate-400 text-sm">Estimated value</div>
          </div>
        </div>
      </div>

      {/* Pending Rewards */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Pending Rewards</h3>
              <div className="text-slate-400">
                {pendingRewards.length} reward{pendingRewards.length !== 1 ? 's' : ''} ready to claim
              </div>
            </div>
            
            {pendingRewards.length > 0 && (
              <button
                onClick={handleClaimAll}
                disabled={isClaimingAll}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isClaimingAll ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Claiming...
                  </>
                ) : (
                  <>
                    <span>💰</span>
                    Claim All ({userStats.pendingRewards} U2U)
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-slate-400">Loading rewards...</div>
            </div>
          ) : pendingRewards.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-lg font-bold text-slate-300 mb-2">No Pending Rewards</h3>
              <p className="text-slate-400">Complete bandwidth tests to earn rewards!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {pendingRewards.map((reward, index) => (
                <div key={index} className="p-6 hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${reward.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <span className="text-xl">{reward.icon}</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">{reward.displayType}</div>
                        <div className="text-slate-400 text-sm">
                          {timeAgo(reward.timestamp)} • {reward.amount} U2U
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleClaimSingle(reward)}
                      disabled={isClaimingSingle === reward.proofHash}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClaimingSingle === reward.proofHash ? 'Claiming...' : 'Claim'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-slate-400">No transactions yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-slate-700/30 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <div className="text-white font-medium">{tx.type}</div>
                    <div className="text-slate-400 text-sm">{timeAgo(tx.timestamp)}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-green-400 font-bold">+{tx.amount} U2U</div>
                  <a 
                    href={`https://testnet-explorer.uniultra.xyz/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    View TX ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500/20 border border-green-500/30 rounded-2xl p-4 backdrop-blur-sm z-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div className="text-green-400 font-medium">{successMessage}</div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-6 right-6 bg-red-500/20 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm z-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div className="text-red-400 font-medium">{error}</div>
            <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-300">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}