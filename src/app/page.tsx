// src/app/page.tsx - Updated with FluxBand Network Logo Integration

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWallet } from '../context/walletcontext';
import { BandwidthTester } from '../app/bandwidthtester';
import { RewardClaimer } from '../app/rewardclaimer';
import { ReferralSystem } from '../app/RefferalSystem';
import { UserProfile } from './UserProfile';
import { GlobalLeaderboard } from './GlobalLeaderboard';
import { AdvancedStats } from './AdvancedStats';

interface DashboardStats {
  totalUsers: number;
  totalTests: number;
  totalRewards: string;
  activeNodes: number;
  networkUptime: number;
  avgLatency: number;
}

export default function HomePage() {
  const { 
    isConnected, 
    address, 
    u2uBalance, 
    fluxBalance,
    fluxBandContract,
    connectWallet,
    getUserProfile,
    isLoading,
    error 
  } = useWallet();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'bandwidth' | 'rewards' | 'referrals' | 'profile' | 'leaderboard' | 'stats'>('dashboard');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 1,
    totalTests: 89234,
    totalRewards: '458,392',
    activeNodes: 1289,
    networkUptime: 99.8,
    avgLatency: 23.5
  });

  // Load user profile when connected
  useEffect(() => {
    const loadProfile = async () => {
      if (isConnected && fluxBandContract) {
        try {
          const profile = await getUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to load profile:', error);
        }
      }
    };

    loadProfile();
  }, [isConnected, fluxBandContract, getUserProfile]);

  // Navigation tabs
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'bandwidth', label: 'Bandwidth Test', icon: '⚡' },
    { id: 'rewards', label: 'Rewards', icon: '💰' },
    { id: 'referrals', label: 'Referrals', icon: '👥' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'stats', label: 'Analytics', icon: '📊' }
  ];

  // Render dashboard content
  const renderDashboardContent = () => {
    if (!isConnected) {
      return (
        <div className="space-y-8">
          {/* Hero Section with Logo */}
          <div className="text-center py-16">
            <div className="mb-8">
              {/* Main Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="">
                    <div className="relative w-24 h-24">
                      <Image
                        src="/images/fluxband-icon.png"
                        alt="FluxBand Network Logo"
                        width={96}
                        height={96}
                        className="rounded-2xl"
                        onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>  
                </div>
              </div>

              {/* Brand Name */}
              <h1 className="text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  FluxBand
                </span>
                <span className="text-white ml-4">Network</span>
              </h1>
              
              {/* Tagline */}
              <div className="text-2xl text-slate-300 mb-4 font-light">
                Decentralized Bandwidth Validation Protocol
              </div>
              
              <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                The most advanced <span className="text-cyan-400 font-semibold">DePIN infrastructure</span> for real-time network validation. 
                Test your connection, earn <span className="text-green-400 font-semibold">U2U tokens</span>, and contribute to the future of decentralized networks.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              <div className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-4">Bandwidth Testing</h3>
                <p className="text-slate-400 leading-relaxed">
                  Real-time network validation with cryptographic proofs and dynamic rewards up to 10 U2U per test
                </p>
              </div>
              
              <div className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💰</div>
                <h3 className="text-2xl font-bold text-white mb-4">Earn Rewards</h3>
                <p className="text-slate-400 leading-relaxed">
                  Get paid in U2U tokens for network contributions with referral bonuses and staking rewards at 12.5% APY
                </p>
              </div>
              
              <div className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">Compete Globally</h3>
                <p className="text-slate-400 leading-relaxed">
                  Climb the leaderboard, unlock achievements, and compete with validators worldwide for exclusive rewards
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-6">
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="group relative px-12 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-2xl rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-50 transform hover:scale-105"
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </div>
                  ) : (
                    'Connect Wallet to Start'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity"></div>
              </button>

              <div className="text-slate-500 text-sm">
                Supports MetaMask • Built on U2U Network • Gas fees ~$0.001
              </div>

              {error && (
                <div className="mt-6 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 max-w-md mx-auto backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <div className="font-semibold">Connection Error</div>
                      <div className="text-sm opacity-90">{error}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Network Stats */}
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Live Network Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center group">
                <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  {dashboardStats.totalUsers.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm font-medium">Total Users</div>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div className="bg-blue-400 h-1 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">
                  {dashboardStats.totalTests.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm font-medium">Tests Completed</div>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div className="bg-green-400 h-1 rounded-full w-4/5"></div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="text-4xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform">
                  {dashboardStats.totalRewards}
                </div>
                <div className="text-slate-400 text-sm font-medium">U2U Distributed</div>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div className="bg-yellow-400 h-1 rounded-full w-2/3"></div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                  {dashboardStats.activeNodes.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm font-medium">Active Nodes</div>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div className="bg-purple-400 h-1 rounded-full w-3/5"></div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="text-4xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                  {dashboardStats.networkUptime}%
                </div>
                <div className="text-slate-400 text-sm font-medium">Network Uptime</div>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div className="bg-cyan-400 h-1 rounded-full w-full"></div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="text-4xl font-bold text-red-400 mb-2 group-hover:scale-110 transition-transform">
                  {dashboardStats.avgLatency}ms
                </div>
                <div className="text-slate-400 text-sm font-medium">Avg Latency</div>
                <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
                  <div className="bg-red-400 h-1 rounded-full w-1/4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Powered by Advanced Technology</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                <div className="text-3xl mb-2">🔗</div>
                <div className="font-semibold text-white">U2U Network</div>
                <div className="text-slate-400 text-sm">Blockchain Layer</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="font-semibold text-white">Smart Contracts</div>
                <div className="text-slate-400 text-sm">Security & Trust</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-semibold text-white">Real-time Data</div>
                <div className="text-slate-400 text-sm">Live Monitoring</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                <div className="text-3xl mb-2">🔐</div>
                <div className="font-semibold text-white">Cryptographic Proof</div>
                <div className="text-slate-400 text-sm">Tamper Resistant</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Dashboard for connected users
    return (
      <div className="space-y-8">
        {/* Welcome Header with Logo */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center relative">
                <span className="text-2xl font-bold text-white">
                  {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : address?.charAt(2).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome back{userProfile?.username ? `, ${userProfile.username}` : ''}!
                </h2>
                <div className="text-slate-400 flex items-center gap-2">
                  <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-medium">Level {userProfile?.level || 1}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {parseFloat(u2uBalance).toFixed(2)} U2U
              </div>
              <div className="text-slate-400 text-sm">Available Balance</div>
              <div className="text-slate-500 text-xs">~${(parseFloat(u2uBalance) * 0.1).toFixed(2)} USD</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold text-xl">{userProfile?.totalEarnings || '0'}</div>
                <div className="text-xs text-green-300">U2U</div>
              </div>
            </div>
            <div className="text-lg font-bold text-white mb-1">Total Earnings</div>
            <div className="text-green-400 text-sm">All-time rewards</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-right">
                <div className="text-blue-400 font-bold text-xl">{userProfile?.totalTests || 0}</div>
                <div className="text-xs text-blue-300">Tests</div>
              </div>
            </div>
            <div className="text-lg font-bold text-white mb-1">Bandwidth Tests</div>
            <div className="text-blue-400 text-sm">Network validations</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-right">
                <div className="text-purple-400 font-bold text-xl">{userProfile?.referralCount || 0}</div>
                <div className="text-xs text-purple-300">Friends</div>
              </div>
            </div>
            <div className="text-lg font-bold text-white mb-1">Referrals</div>
            <div className="text-purple-400 text-sm">Network growth</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-xl">#{userProfile?.globalRank || '---'}</div>
                <div className="text-xs text-yellow-300">Global</div>
              </div>
            </div>
            <div className="text-lg font-bold text-white mb-1">Leaderboard</div>
            <div className="text-yellow-400 text-sm">Your ranking</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('bandwidth')}
              className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all text-left group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
              <div className="text-lg font-bold text-white mb-2">Run Speed Test</div>
              <div className="text-blue-400 text-sm">Test bandwidth and earn up to 10 U2U rewards</div>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:from-green-500/30 hover:to-emerald-500/30 transition-all text-left group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💰</div>
              <div className="text-lg font-bold text-white mb-2">Claim Rewards</div>
              <div className="text-green-400 text-sm">Withdraw pending tokens to your wallet</div>
            </button>

            <button
              onClick={() => setActiveTab('referrals')}
              className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all text-left group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
              <div className="text-lg font-bold text-white mb-2">Invite Friends</div>
              <div className="text-purple-400 text-sm">Earn 15-30% referral bonuses</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-xl">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">Bandwidth test completed</div>
                <div className="text-slate-400 text-sm">Upload: 245 Mbps • Download: 378 Mbps • Latency: 12ms</div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">+5.2 U2U</div>
                <div className="text-slate-400 text-sm">2 minutes ago</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-xl">🏆</span>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">Achievement unlocked</div>
                <div className="text-slate-400 text-sm">Speed Demon - Complete 100 bandwidth tests</div>
              </div>
              <div className="text-right">
                <div className="text-blue-400 font-bold">+100 XP</div>
                <div className="text-slate-400 text-sm">1 hour ago</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 text-xl">👥</span>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">New referral joined</div>
                <div className="text-slate-400 text-sm">Friend used your referral code FLUX5FD21ADC</div>
              </div>
              <div className="text-right">
                <div className="text-purple-400 font-bold">+1.5 U2U</div>
                <div className="text-slate-400 text-sm">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Logo */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="">
                  <Image
                    src="/images/fluxband-icon.png"
                    alt="FluxBand Logo"
                    width={60}
                    height={90}
                    className="rounded-lg"
                    onError={(e) => {
                      // Show fallback text if image fails
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-xl font-bold text-white">F</span>';
                      }
                    }}
                  />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl opacity-50 blur-md -z-10"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">FluxBand</span>
                  <span className="text-white ml-1">Network</span>
                </h1>
                <div className="text-xs text-slate-400">DePIN Bandwidth Validation</div>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-white font-semibold">{parseFloat(u2uBalance).toFixed(2)} U2U</div>
                    <div className="text-slate-400 text-xs">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">Connected</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {isConnected && (
        <nav className="sticky top-[73px] z-40 bg-slate-800/60 backdrop-blur-md border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center overflow-x-auto py-4 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && renderDashboardContent()}
        {activeTab === 'bandwidth' && <BandwidthTester />}
        {activeTab === 'rewards' && <RewardClaimer />}
        {activeTab === 'referrals' && <ReferralSystem />}
        {activeTab === 'profile' && <UserProfile />}
        {activeTab === 'leaderboard' && <GlobalLeaderboard />}
        {activeTab === 'stats' && <AdvancedStats />}
      </main>

      {/* Footer with Logo */}
      <footer className="bg-slate-900/50 border-t border-slate-700/50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">F</span>
              </div>
              <div className="text-slate-400">
                © 2025 <span className="text-cyan-400">FluxBand Network</span>. Built on U2U Network.
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a 
                href="https://testnet-explorer.uniultra.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                Explorer <span className="text-xs">↗</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}