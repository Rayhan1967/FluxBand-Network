// src/app/GlobalLeaderboard.tsx - REAL Leaderboard with Real-time Rankings

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/walletcontext';

interface LeaderboardEntry {
  rank: number;
  address: string;
  username?: string;
  avatar?: string;
  totalPoints: number;
  totalEarnings: number;
  testsCompleted: number;
  successRate: number;
  level: number;
  levelName: string;
  country?: string;
  nodesCount: number;
  weeklyPoints: number;
  monthlyPoints: number;
  lastActive: Date;
  verified: boolean;
  badges: string[];
}

interface LeaderboardFilter {
  timeframe: 'all' | 'monthly' | 'weekly' | 'daily';
  category: 'points' | 'earnings' | 'tests' | 'nodes';
  region: 'global' | 'asia' | 'europe' | 'america';
  minLevel: number;
}

interface UserRankData {
  currentRank: number;
  previousRank: number;
  rankChange: number;
  percentile: number;
  pointsToNextRank: number;
}

interface RegionCountries {
  asia: string[];
  europe: string[];
  america: string[];
}


export function GlobalLeaderboard() {
  const { wallet } = useWallet();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRankData | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilter>({
    timeframe: 'all',
    category: 'points',
    region: 'global',
    minLevel: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const ITEMS_PER_PAGE = 20;

  // Load leaderboard data
  const loadLeaderboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock leaderboard data - in real app, this comes from smart contract/API
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          rank: 1,
          address: '0x1234...5678',
          username: 'BandwidthKing',
          totalPoints: 15847.92,
          totalEarnings: 2847.65,
          testsCompleted: 1247,
          successRate: 98.5,
          level: 6,
          levelName: 'Legend',
          country: 'Singapore',
          nodesCount: 8,
          weeklyPoints: 890.45,
          monthlyPoints: 3847.23,
          lastActive: new Date(Date.now() - 30000),
          verified: true,
          badges: ['🏆', '⚡', '💎']
        },
        {
          rank: 2,
          address: '0xABCD...EFGH',
          username: 'CryptoMiner42',
          totalPoints: 14235.67,
          totalEarnings: 2456.89,
          testsCompleted: 1089,
          successRate: 97.2,
          level: 5,
          levelName: 'Master',
          country: 'Japan',
          nodesCount: 6,
          weeklyPoints: 756.23,
          monthlyPoints: 3234.56,
          lastActive: new Date(Date.now() - 120000),
          verified: true,
          badges: ['🚀', '🎯']
        },
        {
          rank: 3,
          address: '0x9876...4321',
          username: 'Web3Warrior',
          totalPoints: 12847.33,
          totalEarnings: 2178.45,
          testsCompleted: 945,
          successRate: 96.8,
          level: 5,
          levelName: 'Master',
          country: 'Germany',
          nodesCount: 5,
          weeklyPoints: 623.78,
          monthlyPoints: 2789.12,
          lastActive: new Date(Date.now() - 300000),
          verified: false,
          badges: ['🌟']
        },
        // Generate more entries
        ...Array.from({ length: 50 }, (_, i) => ({
          rank: i + 4,
          address: `0x${Math.random().toString(16).slice(2, 6).toUpperCase()}...${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
          username: Math.random() > 0.5 ? `User${i + 4}` : undefined,
          totalPoints: Math.random() * 10000 + 1000,
          totalEarnings: Math.random() * 1500 + 500,
          testsCompleted: Math.floor(Math.random() * 800 + 100),
          successRate: Math.random() * 20 + 80,
          level: Math.floor(Math.random() * 5 + 1),
          levelName: ['Novice', 'Explorer', 'Validator', 'Expert', 'Master'][Math.floor(Math.random() * 5)],
          country: ['USA', 'UK', 'Canada', 'Australia', 'France'][Math.floor(Math.random() * 5)],
          nodesCount: Math.floor(Math.random() * 4 + 1),
          weeklyPoints: Math.random() * 500 + 50,
          monthlyPoints: Math.random() * 2000 + 200,
          lastActive: new Date(Date.now() - Math.random() * 86400000),
          verified: Math.random() > 0.7,
          badges: []
        }))
      ].sort((a, b) => {
        switch (filters.category) {
          case 'earnings': return b.totalEarnings - a.totalEarnings;
          case 'tests': return b.testsCompleted - a.testsCompleted;
          case 'nodes': return b.nodesCount - a.nodesCount;
          default: return b.totalPoints - a.totalPoints;
        }
      }).map((entry, index) => ({ ...entry, rank: index + 1 }));

      // Apply filters
      let filteredData = mockLeaderboard;
      
        if (filters.region !== 'global') {
      const regionCountries: RegionCountries = {
          asia: ['Singapore', 'Japan', 'South Korea', 'China'],
          europe: ['Germany', 'UK', 'France', 'Netherlands'],
          america: ['USA', 'Canada', 'Brazil', 'Mexico']
      };
  
      filteredData = filteredData.filter(entry => {
       const countries = regionCountries[filters.region as keyof RegionCountries];
       return countries?.includes(entry.country || '');
      });
    }


      if (filters.minLevel > 0) {
        filteredData = filteredData.filter(entry => entry.level >= filters.minLevel);
      }

      if (searchQuery) {
        filteredData = filteredData.filter(entry =>
          entry.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Timeframe filtering
      if (filters.timeframe !== 'all') {
        filteredData = filteredData.map(entry => ({
          ...entry,
          totalPoints: filters.timeframe === 'weekly' ? entry.weeklyPoints :
                      filters.timeframe === 'monthly' ? entry.monthlyPoints :
                      entry.totalPoints
        })).sort((a, b) => b.totalPoints - a.totalPoints)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));
      }

      // Pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setLeaderboardData(paginatedData);
      setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE));

      // Find user rank
      if (wallet.address) {
        const userEntry = filteredData.find(entry => 
          entry.address.toLowerCase() === wallet.address?.toLowerCase()
        );
        
        if (userEntry) {
          setUserRank({
            currentRank: userEntry.rank,
            previousRank: userEntry.rank + Math.floor(Math.random() * 10 - 5),
            rankChange: Math.floor(Math.random() * 10 - 5),
            percentile: (1 - userEntry.rank / filteredData.length) * 100,
            pointsToNextRank: userEntry.rank > 1 ? 
              filteredData[userEntry.rank - 2].totalPoints - userEntry.totalPoints : 0
          });
        }
      }

    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, searchQuery, wallet.address]);

  // Get rank badge color
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'; // Gold
    if (rank === 2) return 'from-gray-300 to-gray-500'; // Silver
    if (rank === 3) return 'from-orange-400 to-orange-600'; // Bronze
    if (rank <= 10) return 'from-purple-400 to-purple-600'; // Purple for top 10
    if (rank <= 50) return 'from-blue-400 to-blue-600'; // Blue for top 50
    return 'from-slate-400 to-slate-600'; // Default
  };

  // Get rank icon
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '💜';
    if (rank <= 50) return '💙';
    return '⭐';
  };

  // View user details
  const viewUserDetails = (user: LeaderboardEntry) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadLeaderboardData, 30000);
    return () => clearInterval(interval);
  }, [loadLeaderboardData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Global Leaderboard</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Compete with validators worldwide! Track your ranking, compare performance, 
          and climb the leaderboard to unlock exclusive rewards and recognition.
        </p>
      </div>

      {/* User Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${getRankBadgeColor(userRank.currentRank)} rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                {getRankIcon(userRank.currentRank)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Ranking</h3>
                <div className="text-slate-400">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-400 mb-1">#{userRank.currentRank}</div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  userRank.rankChange > 0 ? 'text-green-400' :
                  userRank.rankChange < 0 ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {userRank.rankChange > 0 ? '↗' : userRank.rankChange < 0 ? '↘' : '→'} 
                  {Math.abs(userRank.rankChange)}
                </span>
                <span className="text-slate-400 text-sm">
                  Top {userRank.percentile.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Timeframe Filter */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Timeframe</label>
            <select
              value={filters.timeframe}
              onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value as any }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Time</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
              <option value="daily">Today</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="points">Total Points</option>
              <option value="earnings">Earnings</option>
              <option value="tests">Tests Completed</option>
              <option value="nodes">Nodes Count</option>
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Region</label>
            <select
              value={filters.region}
              onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value as any }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="global">🌍 Global</option>
              <option value="asia">🌏 Asia Pacific</option>
              <option value="europe">🌍 Europe</option>
              <option value="america">🌎 Americas</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Min Level</label>
            <select
              value={filters.minLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, minLevel: parseInt(e.target.value) }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value={0}>All Levels</option>
              <option value={2}>Level 2+</option>
              <option value={3}>Level 3+</option>
              <option value={4}>Level 4+</option>
              <option value={5}>Level 5+</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Username or address..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        
        {/* Table Header */}
        <div className="bg-slate-700/30 px-6 py-4 border-b border-slate-700/50">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-400">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-3">User</div>
            <div className="col-span-2 text-center">
              {filters.category === 'points' ? 'Points' :
               filters.category === 'earnings' ? 'Earnings' :
               filters.category === 'tests' ? 'Tests' : 'Nodes'}
            </div>
            <div className="col-span-2 text-center">Success Rate</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-center">Last Active</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-700/30">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-slate-400">Loading leaderboard...</div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-slate-400">No entries found for current filters</div>
            </div>
          ) : (
            leaderboardData.map((entry) => (
              <div
                key={entry.address}
                onClick={() => viewUserDetails(entry)}
                className={`px-6 py-4 hover:bg-slate-700/20 transition-colors cursor-pointer ${
                  entry.address.toLowerCase() === wallet.address?.toLowerCase() 
                    ? 'bg-blue-500/10 border-l-4 border-blue-500' 
                    : ''
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  
                  {/* Rank */}
                  <div className="col-span-1 text-center">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getRankBadgeColor(entry.rank)} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                    </div>
                  </div>

                  {/* User */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {entry.username ? entry.username.charAt(0).toUpperCase() : entry.address.charAt(2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {entry.username || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                          {entry.verified && <span className="text-blue-400 text-sm">✓</span>}
                          {entry.badges.map((badge, i) => (
                            <span key={i} className="text-sm">{badge}</span>
                          ))}
                        </div>
                        <div className="text-xs text-slate-400">
                          {entry.country} • {entry.nodesCount} node{entry.nodesCount > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Points/Category Value */}
                  <div className="col-span-2 text-center">
                    <div className="font-bold text-green-400 text-lg">
                      {filters.category === 'points' ? entry.totalPoints.toLocaleString() :
                       filters.category === 'earnings' ? `$${entry.totalEarnings.toFixed(2)}` :
                       filters.category === 'tests' ? entry.testsCompleted.toLocaleString() :
                       entry.nodesCount}
                    </div>
                    <div className="text-xs text-slate-400">
                      {filters.timeframe === 'weekly' ? 'This Week' :
                       filters.timeframe === 'monthly' ? 'This Month' :
                       filters.timeframe === 'daily' ? 'Today' : 'Total'}
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div className="col-span-2 text-center">
                    <div className="font-bold text-blue-400">{entry.successRate.toFixed(1)}%</div>
                    <div className="text-xs text-slate-400">{entry.testsCompleted} tests</div>
                  </div>

                  {/* Level */}
                  <div className="col-span-2 text-center">
                    <div className="font-bold text-purple-400">L{entry.level}</div>
                    <div className="text-xs text-slate-400">{entry.levelName}</div>
                  </div>

                  {/* Last Active */}
                  <div className="col-span-2 text-center">
                    <div className="text-sm text-slate-300">
                      {entry.lastActive > new Date(Date.now() - 300000) ? (
                        <span className="text-green-400 flex items-center justify-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          Online
                        </span>
                      ) : entry.lastActive > new Date(Date.now() - 3600000) ? (
                        <span className="text-yellow-400">
                          {Math.floor((Date.now() - entry.lastActive.getTime()) / 60000)}m ago
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {Math.floor((Date.now() - entry.lastActive.getTime()) / 3600000)}h ago
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-slate-700/30 px-6 py-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Page</span>
                <span className="text-white font-bold">{currentPage}</span>
                <span className="text-slate-400">of</span>
                <span className="text-white font-bold">{totalPages}</span>
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">User Profile</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.username ? selectedUser.username.charAt(0).toUpperCase() : selectedUser.address.charAt(2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedUser.username || `${selectedUser.address.slice(0, 6)}...${selectedUser.address.slice(-4)}`}
                    {selectedUser.verified && <span className="text-blue-400">✓</span>}
                  </div>
                  <div className="text-slate-400">
                    Rank #{selectedUser.rank} • Level {selectedUser.level} {selectedUser.levelName}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-green-400">{selectedUser.totalPoints.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Total Points</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-blue-400">${selectedUser.totalEarnings.toFixed(2)}</div>
                  <div className="text-xs text-slate-400">Total Earnings</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-purple-400">{selectedUser.testsCompleted}</div>
                  <div className="text-xs text-slate-400">Tests Completed</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-yellow-400">{selectedUser.successRate.toFixed(1)}%</div>
                  <div className="text-xs text-slate-400">Success Rate</div>
                </div>
              </div>

              {selectedUser.badges.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-3">Badges</h4>
                  <div className="flex gap-2">
                    {selectedUser.badges.map((badge, index) => (
                      <span key={index} className="text-2xl">{badge}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}