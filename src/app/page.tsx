"use client"

import React, { useState, useEffect } from 'react';
import { WalletConnect } from './walletconnect';
import { BandwidthTester } from './bandwidthtester';
import { RewardClaimer } from './rewardclaimer';
import { ReferralSystem } from './RefferalSystem';
import { UserProfile } from './UserProfile';
import { AdvancedStats } from './AdvancedStats';
import { GlobalLeaderboard } from './GlobalLeaderboard';
import { useWallet } from '../context/walletcontext';

export default function Home() {
  const { wallet } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    totalPoints: 799.78,
    todayPoints: 23.45,
    currentStreak: 7,
    pendingRewards: 12.5,
    totalReferrals: 0,
    accountLevel: 'Bronze',
    levelProgress: 50,
  });

  const [networkStats, setNetworkStats] = useState({
    totalValidators: 1248,
    activeBandwidth: '15.6 TB',
    activeUsers: 8915,
    dailyGrowth: {
      validators: 12,
      bandwidth: 2.3,
      users: 156,
    }
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠', color: 'from-blue-500 to-cyan-500' },
    { id: 'hunt', label: 'Proof Hunt', icon: '🎯', color: 'from-pink-500 to-red-500' },
    { id: 'rewards', label: 'Rewards', icon: '💰', color: 'from-yellow-500 to-orange-500' },
    { id: 'referrals', label: 'Referrals', icon: '🔗', color: 'from-purple-500 to-indigo-500' },
    { id: 'nodes', label: 'My Nodes', icon: '📊', color: 'from-green-500 to-emerald-500' },
    { id: 'profile', label: 'Profile', icon: '👤', color: 'from-indigo-500 to-purple-500' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆', color: 'from-amber-500 to-yellow-500' },
  ];

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUserStats(prev => ({
        ...prev,
        todayPoints: prev.todayPoints + Math.random() * 0.1,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!wallet.isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          <section className="relative text-center py-20 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Brand Header */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl mb-8 shadow-2xl">
                  <span className="text-4xl font-bold text-white">⚡</span>
                </div>
              </div>

              <h1 className="text-8xl font-bold mb-6 bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                FLUXBAND
              </h1>
              <h2 className="text-4xl font-bold mb-4 text-white">
                NETWORK
              </h2>
              <div className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-full text-xl font-semibold mb-12 shadow-lg">
                🎯 PROOF HUNT PROTOCOL
              </div>

              <p className="text-2xl mb-16 text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Embark on a digital journey through{' '}
                <span className="text-teal-300 font-semibold">decentralized bandwidth validation</span>.
                <br />
                Collect proof shards, climb global rankings, and build your legend!
              </p>

              <WalletConnect />

              {/* Network Stats Preview */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  <div className="text-3xl font-bold text-teal-400 mb-2">{networkStats.totalValidators}+</div>
                  <div className="text-slate-400">Active Validators</div>
                </div>
                <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{networkStats.activeBandwidth}</div>
                  <div className="text-slate-400">Total Bandwidth</div>
                </div>
                <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{networkStats.activeUsers}+</div>
                  <div className="text-slate-400">Active Users</div>
                </div>
                <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  <div className="text-3xl font-bold text-green-400 mb-2">99.7%</div>
                  <div className="text-slate-400">Network Uptime</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fixed Header */}
      <header className="sticky top-0 bg-slate-800/95 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FluxBand</h1>
                <p className="text-xs text-slate-400">DePIN Network</p>
              </div>
            </div>

            {/* User Stats Bar */}
            <div className="flex items-center gap-6 bg-slate-700/50 rounded-xl px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {wallet.address?.charAt(2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{userStats.accountLevel} Level</div>
                  <div className="text-xs text-slate-400">{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</div>
                </div>
              </div>
              
              <div className="w-px h-8 bg-slate-600"></div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-teal-400">{userStats.totalPoints.toFixed(2)}</div>
                  <div className="text-xs text-slate-400">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-400">+{userStats.todayPoints.toFixed(2)}</div>
                  <div className="text-xs text-slate-400">Today</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-400">{userStats.currentStreak}</div>
                  <div className="text-xs text-slate-400">Day Streak</div>
                </div>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden group ${
                activeTab === tab.id
                  ? 'text-white shadow-lg scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {activeTab === tab.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-90`}></div>
              )}
              <span className="relative text-xl">{tab.icon}</span>
              <span className="relative font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && <OverviewTab userStats={userStats} networkStats={networkStats} />}
          {activeTab === 'hunt' && <BandwidthTester />}
          {activeTab === 'rewards' && <RewardClaimer />}
          {activeTab === 'referrals' && <ReferralSystem />}
          {activeTab === 'nodes' && <AdvancedStats />}
          {activeTab === 'profile' && <UserProfile />}
          {activeTab === 'leaderboard' && <GlobalLeaderboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-slate-400">
                Built for U2U Network Hackathon 2025 • FluxBand Network Team
              </p>
              <p className="text-sm text-slate-500">
                Powered by decentralized infrastructure • Version 1.0.0
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400">Smart Contracts Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-400">Web3 Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-purple-400">Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ userStats, networkStats }: { userStats: any, networkStats: any }) {
  const quickActions = [
    {
      title: 'Start Bandwidth Test',
      description: 'Run a quick bandwidth validation',
      icon: '🚀',
      color: 'from-blue-500 to-cyan-500',
      action: 'hunt'
    },
    {
      title: 'Claim Rewards',
      description: `${userStats.pendingRewards} U2U ready to claim`,
      icon: '💎',
      color: 'from-green-500 to-emerald-500',
      action: 'rewards'
    },
    {
      title: 'Invite Friends',
      description: 'Share referral code & earn together',
      icon: '👥',
      color: 'from-purple-500 to-pink-500',
      action: 'referrals'
    },
    {
      title: 'Check Node Status',
      description: 'Monitor your validators',
      icon: '📡',
      color: 'from-orange-500 to-red-500',
      action: 'nodes'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${action.color}`}
            >
              <div className="relative z-10">
                <div className="text-3xl mb-4">{action.icon}</div>
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Health & Performance */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Network Health */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">Network Health</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-2xl font-bold text-teal-400 mb-1">{networkStats.totalValidators}</div>
              <div className="text-xs text-slate-400 mb-2">Total Validators</div>
              <div className="text-xs text-green-400">↗ +{networkStats.dailyGrowth.validators} today</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-2xl font-bold text-blue-400 mb-1">{networkStats.activeBandwidth}</div>
              <div className="text-xs text-slate-400 mb-2">Active Bandwidth</div>
              <div className="text-xs text-green-400">↗ +{networkStats.dailyGrowth.bandwidth}% today</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-2xl font-bold text-purple-400 mb-1">{networkStats.activeUsers}</div>
              <div className="text-xs text-slate-400 mb-2">Active Users</div>
              <div className="text-xs text-green-400">↗ +{networkStats.dailyGrowth.users} today</div>
            </div>
          </div>
        </div>

        {/* Your Performance */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">Your Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Current Level</span>
              <span className="font-bold text-yellow-400">{userStats.accountLevel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Progress</span>
              <span className="font-bold text-blue-400">{userStats.levelProgress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${userStats.levelProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400">Current Streak</span>
              <span className="font-bold text-orange-400">{userStats.currentStreak} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Pending Rewards</span>
              <span className="font-bold text-green-400">{userStats.pendingRewards} U2U</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xl">✓</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">Bandwidth test completed</div>
              <div className="text-sm text-slate-400">Earned 2.5 U2U tokens • 5 minutes ago</div>
            </div>
            <div className="text-green-400 font-bold">+2.5 U2U</div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xl">🎯</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">Daily challenge completed</div>
              <div className="text-sm text-slate-400">Level progress increased • 1 hour ago</div>
            </div>
            <div className="text-blue-400 font-bold">+5 XP</div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400 text-xl">👥</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">New referral joined</div>
              <div className="text-sm text-slate-400">Bonus reward unlocked • 2 hours ago</div>
            </div>
            <div className="text-purple-400 font-bold">+10 U2U</div>
          </div>
        </div>
      </div>
    </div>
  );
}
