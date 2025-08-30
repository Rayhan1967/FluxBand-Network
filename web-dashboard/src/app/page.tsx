"use client"

import React, { useState, useEffect } from 'react';
import { WalletConnect } from '@/app/walletconnect';
import { BandwidthTester } from '@/app/bandwidthtester';
import { RewardClaimer } from '@/app/rewardclaimer';
import { ReferralSystem } from '@/app/RefferalSystem';
import { UserProfile } from '@/app/UserProfile';
import { AdvancedStats } from '@/app/AdvancedStats';
import { useWallet } from '@/context/walletcontext';

interface UserStats {
  totalPoints: number;
  todayPoints: number;
  referredCount: number;
  accountStatus: string;
  accountLevel: number;
  maxLevel: number;
  currentBoost: number;
  streak: number;
  nextReward: number;
}

interface NetworkData {
  totalValidators: number;
  activeBandwidth: string;
  networkUptime: number;
  totalRewards: string;
  activeUsers: number;
  dailyTests: number;
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
  disabled?: boolean;
}

export default function Home() {
  const { wallet } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 799.78,
    todayPoints: 23.45,
    referredCount: 0,
    accountStatus: 'Bronze',
    accountLevel: 4000,
    maxLevel: 8000,
    currentBoost: 2,
    streak: 7,
    nextReward: 12.5
  });

  const [networkData, setNetworkData] = useState<NetworkData>({
    totalValidators: 1247,
    activeBandwidth: '15.6 TB',
    networkUptime: 99.7,
    totalRewards: '2.4M U2U',
    activeUsers: 8924,
    dailyTests: 1580
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData(prev => ({
        ...prev,
        totalValidators: prev.totalValidators + Math.floor(Math.random() * 3) - 1,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        dailyTests: prev.dailyTests + Math.floor(Math.random() * 10) - 5,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sample notifications
  useEffect(() => {
    if (wallet.isConnected) {
      setNotifications([
        {
          id: '1',
          type: 'success',
          title: 'Bandwidth Test Completed',
          message: 'You earned 2.5 U2U tokens from your latest test!',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false
        },
        {
          id: '2',
          type: 'info',
          title: 'New Feature Available',
          message: 'Check out the new referral system and earn bonus rewards!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false
        },
        {
          id: '3',
          type: 'warning',
          title: 'Node Maintenance',
          message: 'Scheduled maintenance in 2 hours. No downtime expected.',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          read: true
        }
      ]);
    }
  }, [wallet.isConnected]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠', description: 'Dashboard overview' },
    { id: 'hunt', label: 'Proof Hunt', icon: '🎯', description: 'Start bandwidth testing' },
    { id: 'rewards', label: 'Rewards', icon: '💰', description: 'Claim your earnings' },
    { id: 'referrals', label: 'Referrals', icon: '🔗', description: 'Invite friends & earn' },
    { id: 'stats', label: 'My Nodes', icon: '📊', description: 'Monitor your nodes' },
    { id: 'profile', label: 'Profile', icon: '👤', description: 'Manage your account' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆', description: 'Global rankings' },
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'start-test',
      title: 'Start Bandwidth Test',
      description: 'Run a quick bandwidth validation',
      icon: '🚀',
      color: 'from-blue-500 to-cyan-500',
      action: () => setActiveTab('hunt'),
    },
    {
      id: 'claim-rewards',
      title: 'Claim Rewards',
      description: `${userStats.nextReward} U2U ready to claim`,
      icon: '💎',
      color: 'from-green-500 to-emerald-500',
      action: () => setActiveTab('rewards'),
      disabled: userStats.nextReward === 0,
    },
    {
      id: 'invite-friends',
      title: 'Invite Friends',
      description: 'Share referral code & earn together',
      icon: '👥',
      color: 'from-purple-500 to-pink-500',
      action: () => setActiveTab('referrals'),
    },
    {
      id: 'view-nodes',
      title: 'Check Nodes Status',
      description: 'Monitor your validators',
      icon: '📡',
      color: 'from-orange-500 to-red-500',
      action: () => setActiveTab('stats'),
    },
  ];

  const levelProgress = (userStats.accountLevel / userStats.maxLevel) * 100;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!wallet.isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Hero Section */}
        <section className="relative text-center py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full mb-6">
                <span className="text-3xl">⚡</span>
              </div>
            </div>

            <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              FLUXBAND
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              NETWORK
            </h2>
            <div className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-full text-lg font-semibold mb-8">
              🎯 PROOF HUNT PROTOCOL
            </div>

            <p className="text-xl md:text-2xl mb-12 text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Embark on a digital journey through{' '}
              <span className="text-teal-300 font-semibold">decentralized bandwidth validation</span>.
              <br />
              Collect proof shards, climb global rankings, and build your legend in the DePIN revolution!
            </p>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-teal-300 mb-2">Gamified Experience</h3>
                <p className="text-slate-400">Earn rewards through engaging proof hunt mechanics</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-blue-300 mb-2">Real Rewards</h3>
                <p className="text-slate-400">Get paid in U2U tokens for network validation</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">DePIN Future</h3>
                <p className="text-slate-400">Be part of the decentralized infrastructure revolution</p>
              </div>
            </div>

            <WalletConnect />

            {/* Stats preview */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-teal-400">{networkData.totalValidators}+</div>
                <div className="text-sm text-slate-400">Active Validators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-400">{networkData.activeBandwidth}</div>
                <div className="text-sm text-slate-400">Total Bandwidth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-400">{networkData.totalRewards}</div>
                <div className="text-sm text-slate-400">Rewards Distributed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400">{networkData.networkUptime}%</div>
                <div className="text-sm text-slate-400">Network Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-slate-800/95 backdrop-blur-md border-r border-slate-700 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">FluxBand</h1>
                  <p className="text-xs text-slate-400">DePIN Network</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* User Status Card */}
          <div className="p-6 border-b border-slate-700">
            <div className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-2xl p-4 border border-teal-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                    {wallet.address?.charAt(2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                    </div>
                    <div className="text-sm text-teal-300">{userStats.accountStatus} Level</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{userStats.totalPoints.toFixed(2)}</div>
                  <div className="text-xs text-slate-400">Total Points</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Progress to Silver</span>
                  <span className="text-teal-300">{userStats.accountLevel}/{userStats.maxLevel}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-sm font-semibold text-white">{userStats.currentBoost}%</div>
                  <div className="text-xs text-slate-400">Boost</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-orange-400">{userStats.streak}</div>
                  <div className="text-xs text-slate-400">Day Streak</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-400">{userStats.referredCount}</div>
                  <div className="text-xs text-slate-400">Referrals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                      : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                  {activeTab === tab.id && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-700">
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">Network Status</div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Online - {networkData.networkUptime}% Uptime</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Last updated: {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 bg-slate-800/95 backdrop-blur-md border-b border-slate-700 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-xl">☰</span>
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-slate-400">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Live indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Live</span>
              </div>

              {/* Today's earnings */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-teal-500/20 rounded-full">
                <span className="text-sm text-teal-300">Today: +{userStats.todayPoints.toFixed(2)} pts</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-xl">🔔</span>
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{unreadNotifications}</span>
                    </div>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 z-50">
                    <div className="p-4 border-b border-slate-700">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <p className="text-sm text-slate-400">{unreadNotifications} unread</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-slate-700 last:border-b-0 cursor-pointer hover:bg-slate-700/50 ${
                              !notification.read ? 'bg-slate-700/20' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'success' ? 'bg-green-400' :
                                notification.type === 'warning' ? 'bg-yellow-400' :
                                notification.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                              }`} />
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{notification.title}</h4>
                                <p className="text-sm text-slate-300 mt-1">{notification.message}</p>
                                <p className="text-xs text-slate-500 mt-2">
                                  {notification.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <div className="text-4xl mb-4">🔔</div>
                          <p className="text-slate-400">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <button
                onClick={() => handleTabChange('profile')}
                className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                  {wallet.address?.charAt(2).toUpperCase()}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          {/* Overview Tab - Special Layout */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-8 max-h-full overflow-y-auto">
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                      action.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-lg cursor-pointer'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${action.color.split(' ')[1]}, ${action.color.split(' ')[3]})`
                    }}
                  >
                    <div className="relative z-10">
                      <div className="text-3xl mb-3">{action.icon}</div>
                      <h3 className="font-bold text-white mb-2">{action.title}</h3>
                      <p className="text-sm text-white/80">{action.description}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  </button>
                ))}
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Network Health */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-6">Network Health</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                      <div className="text-2xl font-bold text-teal-400 mb-1">{networkData.totalValidators}</div>
                      <div className="text-xs text-slate-400">Total Validators</div>
                      <div className="text-xs text-green-400 mt-1">↗ +12 today</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{networkData.activeBandwidth}</div>
                      <div className="text-xs text-slate-400">Active Bandwidth</div>
                      <div className="text-xs text-green-400 mt-1">↗ +2.3% today</div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                      <div className="text-2xl font-bold text-purple-400 mb-1">{networkData.activeUsers}</div>
                      <div className="text-xs text-slate-400">Active Users</div>
                      <div className="text-xs text-green-400 mt-1">↗ +156 today</div>
                    </div>
                  </div>
                </div>

                {/* Personal Stats */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-6">Your Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Today's Points</span>
                      <span className="font-bold text-teal-400">+{userStats.todayPoints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Current Streak</span>
                      <span className="font-bold text-orange-400">{userStats.streak} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Pending Rewards</span>
                      <span className="font-bold text-green-400">{userStats.nextReward} U2U</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Referred</span>
                      <span className="font-bold text-purple-400">{userStats.referredCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">Bandwidth test completed</div>
                      <div className="text-sm text-slate-400">Earned 2.5 U2U tokens • 5 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-400">🎯</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">Daily challenge completed</div>
                      <div className="text-sm text-slate-400">Level progress increased • 1 hour ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-400">🔗</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">Profile updated</div>
                      <div className="text-sm text-slate-400">Connected social accounts • 2 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Content */}
          {activeTab !== 'overview' && (
            <div className="p-6 max-h-full overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {activeTab === 'hunt' && <BandwidthTester />}
                {activeTab === 'rewards' && <RewardClaimer />}
                {activeTab === 'referrals' && <ReferralSystem />}
                {activeTab === 'stats' && <AdvancedStats />}
                {activeTab === 'profile' && <UserProfile />}
                {activeTab === 'leaderboard' && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-6">🏆</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Global Leaderboard</h3>
                    <p className="text-slate-400 mb-8">Coming soon! Compete with validators worldwide.</p>
                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                      <div className="text-lg font-semibold text-teal-400 mb-4">Top Performers This Week</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-yellow-500/20 rounded-xl">
                          <div className="text-2xl mb-2">🥇</div>
                          <div className="font-bold text-white">CryptoValidator</div>
                          <div className="text-sm text-slate-400">34,230 points</div>
                        </div>
                        <div className="text-center p-4 bg-slate-500/20 rounded-xl">
                          <div className="text-2xl mb-2">🥈</div>
                          <div className="font-bold text-white">BandwidthKing</div>
                          <div className="text-sm text-slate-400">31,150 points</div>
                        </div>
                        <div className="text-center p-4 bg-orange-500/20 rounded-xl">
                          <div className="text-2xl mb-2">🥉</div>
                          <div className="font-bold text-white">ProofHunter</div>
                          <div className="text-sm text-slate-400">28,900 points</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 p-6">
          <div className="max-w-7xl mx-auto">
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
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-green-400">Smart Contracts Deployed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-blue-400">Web3 Integration Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-purple-400">Production Ready</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-medium">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}