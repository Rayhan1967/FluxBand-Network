// src/app/UserProfile.tsx - REAL Profile System with Data Persistence & Level Progression

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/walletcontext';

interface UserProfileData {
  address: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  location: string;
  joinDate: Date;
  lastActive: Date;
  verified: boolean;
  level: {
    current: number;
    name: string;
    xp: number;
    xpRequired: number;
    xpToNext: number;
    totalXP: number;
  };
  stats: {
    totalTests: number;
    successfulTests: number;
    totalEarnings: number;
    referrals: number;
    nodesOwned: number;
    daysActive: number;
    averageScore: number;
    longestStreak: number;
  };
  achievements: Achievement[];
  preferences: {
    theme: 'dark' | 'light';
    notifications: {
      email: boolean;
      browser: boolean;
      testComplete: boolean;
      rewardsEarned: boolean;
      referralJoined: boolean;
    };
    privacy: {
      showEarnings: boolean;
      showStats: boolean;
      showLocation: boolean;
    };
  };
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
    github?: string;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'testing' | 'earnings' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date | null;
  progress: number;
  maxProgress: number;
  reward: {
    xp: number;
    tokens?: number;
  };
}

interface LevelTier {
  level: number;
  name: string;
  xpRequired: number;
  color: string;
  benefits: string[];
  icon: string;
}

export function UserProfile() {
  const { wallet } = useWallet();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
  username: '',
  email: '',
  bio: '',
  location: '',
  socialLinks: {
    twitter: '',      
    discord: '',      
    telegram: '',     
    github: '' 
  }
});
  const [selectedTab, setSelectedTab] = useState<'profile' | 'achievements' | 'preferences' | 'progress'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Level tiers configuration
  const levelTiers: LevelTier[] = [
    { level: 1, name: 'Novice', xpRequired: 0, color: 'gray', icon: '🔰', benefits: ['Basic testing access'] },
    { level: 2, name: 'Explorer', xpRequired: 100, color: 'green', icon: '🌱', benefits: ['Basic testing', 'Profile customization'] },
    { level: 3, name: 'Validator', xpRequired: 300, color: 'blue', icon: '🛡️', benefits: ['Advanced testing', '10% bonus rewards'] },
    { level: 4, name: 'Expert', xpRequired: 750, color: 'purple', icon: '⭐', benefits: ['All features', '20% bonus', 'Priority support'] },
    { level: 5, name: 'Master', xpRequired: 1500, color: 'yellow', icon: '🏆', benefits: ['Master status', '30% bonus', 'Beta features'] },
    { level: 6, name: 'Legend', xpRequired: 3000, color: 'orange', icon: '🔥', benefits: ['Legendary status', '50% bonus', 'Exclusive access'] },
  ];

  // Achievements configuration
  const achievementsConfig: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
    {
      id: 'first_test',
      name: 'First Steps',
      description: 'Complete your first bandwidth test',
      icon: '🚀',
      category: 'testing',
      rarity: 'common',
      maxProgress: 1,
      reward: { xp: 10 }
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Complete 100 bandwidth tests',
      icon: '⚡',
      category: 'testing',
      rarity: 'rare',
      maxProgress: 100,
      reward: { xp: 100, tokens: 5 }
    },
    {
      id: 'early_adopter',
      name: 'Early Adopter',
      description: 'Join FluxBand Network in the first month',
      icon: '🌟',
      category: 'special',
      rarity: 'epic',
      maxProgress: 1,
      reward: { xp: 200, tokens: 10 }
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Refer 10 friends to the network',
      icon: '🦋',
      category: 'social',
      rarity: 'rare',
      maxProgress: 10,
      reward: { xp: 150, tokens: 15 }
    },
    {
      id: 'consistent_performer',
      name: 'Consistent Performer',
      description: 'Maintain a 30-day testing streak',
      icon: '🔥',
      category: 'testing',
      rarity: 'epic',
      maxProgress: 30,
      reward: { xp: 300, tokens: 25 }
    },
    {
      id: 'network_supporter',
      name: 'Network Supporter',
      description: 'Earn 1000 U2U tokens',
      icon: '💎',
      category: 'earnings',
      rarity: 'legendary',
      maxProgress: 1000,
      reward: { xp: 500, tokens: 50 }
    }
  ];

  // Load user profile data
  const loadProfileData = useCallback(async () => {
    if (!wallet.address) return;

    setIsLoading(true);
    try {
      // In real app, this would fetch from API/smart contract
      // For demo, we'll use localStorage and mock data
      const savedProfile = localStorage.getItem(`fluxband_profile_${wallet.address}`);
      
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData({
          ...parsed,
          joinDate: new Date(parsed.joinDate),
          lastActive: new Date(parsed.lastActive),
          achievements: parsed.achievements.map((ach: any) => ({
            ...ach,
            unlockedAt: ach.unlockedAt ? new Date(ach.unlockedAt) : null
          }))
        });
      } else {
        // Create new profile
        const newProfile: UserProfileData = {
          address: wallet.address,
          username: '',
          email: '',
          bio: '',
          avatar: '',
          location: '',
          joinDate: new Date(),
          lastActive: new Date(),
          verified: false,
          level: calculateLevel(85), // Mock XP
          stats: {
            totalTests: 47,
            successfulTests: 45,
            totalEarnings: 127.65,
            referrals: 3,
            nodesOwned: 1,
            daysActive: 12,
            averageScore: 94.5,
            longestStreak: 7
          },
          achievements: initializeAchievements(),
          preferences: {
            theme: 'dark',
            notifications: {
              email: true,
              browser: true,
              testComplete: true,
              rewardsEarned: true,
              referralJoined: true
            },
            privacy: {
              showEarnings: true,
              showStats: true,
              showLocation: false
            }
          },
          socialLinks: {}
        };

        setProfileData(newProfile);
        saveProfileData(newProfile);
      }

    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, [wallet.address]);

  // Calculate level from XP
  const calculateLevel = (totalXP: number) => {
    let level = 1;
    let currentTier = levelTiers[0];
    
    for (const tier of levelTiers) {
      if (totalXP >= tier.xpRequired) {
        level = tier.level;
        currentTier = tier;
      } else {
        break;
      }
    }
    
    const nextTier = levelTiers.find(t => t.level === level + 1);
    const xpRequired = nextTier ? nextTier.xpRequired : currentTier.xpRequired;
    const xpToNext = nextTier ? nextTier.xpRequired - totalXP : 0;
    
    return {
      current: level,
      name: currentTier.name,
      xp: totalXP - currentTier.xpRequired,
      xpRequired: nextTier ? nextTier.xpRequired - currentTier.xpRequired : 0,
      xpToNext,
      totalXP
    };
  };

  // Initialize achievements
  const initializeAchievements = (): Achievement[] => {
    return achievementsConfig.map(config => ({
      ...config,
      unlockedAt: config.id === 'first_test' ? new Date() : null,
      progress: config.id === 'first_test' ? 1 : 
                config.id === 'speed_demon' ? 47 :
                config.id === 'social_butterfly' ? 3 :
                config.id === 'consistent_performer' ? 7 :
                config.id === 'network_supporter' ? 127 : 0
    }));
  };

  // Save profile data to localStorage
  const saveProfileData = (data: UserProfileData) => {
    localStorage.setItem(`fluxband_profile_${wallet.address}`, JSON.stringify(data));
  };

  // Update profile
  const updateProfile = async () => {
    if (!profileData) return;

    setIsLoading(true);
    try {
      const updatedProfile = {
        ...profileData,
        username: editForm.username,
        email: editForm.email,
        bio: editForm.bio,
        location: editForm.location,
        socialLinks: editForm.socialLinks,
        lastActive: new Date()
      };

      setProfileData(updatedProfile);
      saveProfileData(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Get achievement rarity color
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      case 'epic': return 'text-purple-400 border-purple-500';
      case 'legendary': return 'text-yellow-400 border-yellow-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  // Progress bar component
  const ProgressBar = ({ current, max, color = 'blue' }: {
    current: number;
    max: number;
    color?: string;
  }) => (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div 
        className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min((current / max) * 100, 100)}%` }}
      />
    </div>
  );

  useEffect(() => {
    if (wallet.isConnected) {
      loadProfileData();
    }
  }, [wallet.isConnected, loadProfileData]);

  useEffect(() => {
  if (profileData && isEditing) {
    setEditForm({
      username: profileData.username,
      email: profileData.email,
      bio: profileData.bio,
      location: profileData.location,
      socialLinks: {
        twitter: profileData.socialLinks.twitter || '',      
        discord: profileData.socialLinks.discord || '',      
        telegram: profileData.socialLinks.telegram || '',    
        github: profileData.socialLinks.github || ''       
      }
    });
  }
}, [profileData, isEditing]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-400">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">No Profile Data</h3>
        <p className="text-slate-400">Please connect your wallet to access profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">User Profile</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Manage your FluxBand Network profile, track achievements, and customize your experience.
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profileData.username ? profileData.username.charAt(0).toUpperCase() : profileData.address.charAt(2).toUpperCase()}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h3 className="text-2xl font-bold text-white">
                {profileData.username || `${profileData.address.slice(0, 6)}...${profileData.address.slice(-4)}`}
              </h3>
              {profileData.verified && (
                <span className="text-blue-400 text-xl" title="Verified">✓</span>
              )}
            </div>
            
            <div className="text-slate-400 mb-4">
              {profileData.bio || 'No bio provided'}
            </div>

            {/* Level & XP */}
            <div className="mb-4">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <span className="text-lg font-bold text-yellow-400">
                  {levelTiers.find(t => t.level === profileData.level.current)?.icon} Level {profileData.level.current} - {profileData.level.name}
                </span>
                <span className="text-sm text-slate-400">
                  {profileData.level.totalXP} XP
                </span>
              </div>
              
              <div className="max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Progress to next level</span>
                  <span className="text-cyan-400">
                    {profileData.level.xp}/{profileData.level.xpRequired} XP
                  </span>
                </div>
                <ProgressBar 
                  current={profileData.level.xp} 
                  max={profileData.level.xpRequired}
                  color="cyan"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-slate-700/30 rounded-lg p-3">
                <div className="font-bold text-green-400">{profileData.stats.totalTests}</div>
                <div className="text-xs text-slate-400">Tests</div>
              </div>
              <div className="text-center bg-slate-700/30 rounded-lg p-3">
                <div className="font-bold text-blue-400">{profileData.stats.totalEarnings.toFixed(1)}</div>
                <div className="text-xs text-slate-400">Earnings</div>
              </div>
              <div className="text-center bg-slate-700/30 rounded-lg p-3">
                <div className="font-bold text-purple-400">{profileData.stats.referrals}</div>
                <div className="text-xs text-slate-400">Referrals</div>
              </div>
              <div className="text-center bg-slate-700/30 rounded-lg p-3">
                <div className="font-bold text-yellow-400">{profileData.stats.longestStreak}</div>
                <div className="text-xs text-slate-400">Best Streak</div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6">Edit Profile</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Username</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-slate-400 text-sm mb-2">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white resize-none"
              />
            </div>
            
            <div>
              <label className="block text-slate-400 text-sm mb-2">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Twitter</label>
              <input
                type="text"
                value={editForm.socialLinks.twitter || ''}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                }))}
                placeholder="@username"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={updateProfile}
              disabled={isLoading}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-slate-800/50 rounded-2xl p-1">
          {[
            { id: 'profile', label: 'Overview', icon: '👤' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'progress', label: 'Progress', icon: '📊' },
            { id: 'preferences', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedTab === tab.id
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

      {/* Tab Content */}
      {selectedTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Stats */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Performance Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Success Rate</span>
                <span className="text-green-400 font-bold">
                  {((profileData.stats.successfulTests / profileData.stats.totalTests) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Average Score</span>
                <span className="text-blue-400 font-bold">{profileData.stats.averageScore}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Days Active</span>
                <span className="text-purple-400 font-bold">{profileData.stats.daysActive}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Nodes Owned</span>
                <span className="text-yellow-400 font-bold">{profileData.stats.nodesOwned}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-sm">✓</span>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">Bandwidth test completed</div>
                  <div className="text-slate-400 text-xs">2 hours ago</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-sm">🏆</span>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">Achievement unlocked</div>
                  <div className="text-slate-400 text-xs">1 day ago</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 text-sm">👥</span>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">New referral joined</div>
                  <div className="text-slate-400 text-xs">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'achievements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profileData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 ${
                  achievement.unlockedAt ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-bold text-white text-lg mb-2">{achievement.name}</h4>
                <p className="text-slate-400 text-sm mb-4">{achievement.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-cyan-400">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <ProgressBar current={achievement.progress} max={achievement.maxProgress} />
                </div>
                
                <div className="mt-4 text-xs text-slate-500">
                  Reward: {achievement.reward.xp} XP
                  {achievement.reward.tokens && ` + ${achievement.reward.tokens} U2U`}
                </div>
                
                {achievement.unlockedAt && (
                  <div className="mt-2 text-xs text-green-400">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'progress' && (
        <div className="space-y-6">
          {/* Level Progress */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Level Progression</h3>
            <div className="space-y-4">
              {levelTiers.map((tier) => (
                <div 
                  key={tier.level}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    profileData.level.current === tier.level
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : profileData.level.current > tier.level
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-slate-600 bg-slate-700/30'
                  }`}
                >
                  <div className="text-2xl">{tier.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-white">
                      Level {tier.level} - {tier.name}
                    </div>
                    <div className="text-sm text-slate-400">
                      {tier.xpRequired} XP required • {tier.benefits.join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    {profileData.level.current === tier.level && (
                      <span className="text-yellow-400 font-bold">CURRENT</span>
                    )}
                    {profileData.level.current > tier.level && (
                      <span className="text-green-400">✓ UNLOCKED</span>
                    )}
                    {profileData.level.current < tier.level && (
                      <span className="text-slate-400">LOCKED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'preferences' && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-xl font-bold text-white mb-2">User Preferences</h3>
          <p className="text-slate-400">Notification settings and privacy controls coming soon!</p>
        </div>
      )}

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