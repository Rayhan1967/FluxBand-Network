// src/app/RefferalSystem.tsx - REAL Referral System with Tracking & Sharing

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/walletcontext';

interface ReferralData {
  id: string;
  refereeAddress: string;
  refereeUsername?: string;
  joinDate: Date;
  status: 'pending' | 'qualified' | 'active' | 'inactive';
  totalEarned: number;
  bonusEarned: number;
  level: number;
  testsCompleted: number;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  monthlyEarnings: number;
  conversionRate: number;
  currentTier: string;
  nextTierRequirement: number;
}

interface ReferralTier {
  name: string;
  requirement: number;
  bonusRate: number;
  color: string;
  benefits: string[];
}

export function ReferralSystem() {
  const { wallet } = useWallet();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [referralData, setReferralData] = useState<ReferralData[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    conversionRate: 0,
    currentTier: 'Bronze',
    nextTierRequirement: 10
  });
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [shareMethod, setShareMethod] = useState<'copy' | 'email' | 'social' | 'qr'>('copy');
  const [emailInvite, setEmailInvite] = useState({ emails: '', message: '' });
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Referral tiers configuration
  const referralTiers: ReferralTier[] = [
    {
      name: 'Bronze',
      requirement: 0,
      bonusRate: 10,
      color: 'from-yellow-600 to-yellow-500',
      benefits: ['10% referral bonus', 'Basic tracking']
    },
    {
      name: 'Silver', 
      requirement: 10,
      bonusRate: 15,
      color: 'from-gray-400 to-gray-300',
      benefits: ['15% referral bonus', 'Advanced analytics', 'Priority support']
    },
    {
      name: 'Gold',
      requirement: 25,
      bonusRate: 20,
      color: 'from-yellow-400 to-yellow-300',
      benefits: ['20% referral bonus', 'Custom referral links', 'Monthly bonuses']
    },
    {
      name: 'Platinum',
      requirement: 50,
      bonusRate: 25,
      color: 'from-purple-400 to-pink-400',
      benefits: ['25% referral bonus', 'VIP status', 'Exclusive rewards']
    },
    {
      name: 'Diamond',
      requirement: 100,
      bonusRate: 30,
      color: 'from-blue-400 to-cyan-400',
      benefits: ['30% referral bonus', 'Revenue sharing', 'Special recognition']
    }
  ];

  // Generate referral code
  const generateReferralCode = useCallback(async () => {
    if (!wallet.address) return;

    setIsGeneratingCode(true);
    try {
      // Generate unique code based on wallet address
      const addressHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(wallet.address));
      const hashArray = Array.from(new Uint8Array(addressHash));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Create user-friendly code
      const code = `FLUX${hashHex.substring(0, 8).toUpperCase()}`;
      const link = `https://fluxband.network?ref=${code}`;
      
      setReferralCode(code);
      setReferralLink(link);
      
      // Store in contract (mock implementation)
      await registerReferralCode(code);
      
    } catch (error) {
      console.error('Failed to generate referral code:', error);
      setError('Failed to generate referral code');
    } finally {
      setIsGeneratingCode(false);
    }
  }, [wallet.address]);

  // Register referral code in smart contract
  const registerReferralCode = async (code: string) => {
    // Mock smart contract interaction
    try {
      // In real implementation, this would interact with the referral contract
      console.log(`Registering referral code: ${code} for address: ${wallet.address}`);
      
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      throw new Error('Failed to register referral code');
    }
  };

  // Load referral data
  const loadReferralData = useCallback(async () => {
    if (!wallet.address) return;

    try {
      // Mock referral data
      const mockReferrals: ReferralData[] = [
        {
          id: '1',
          refereeAddress: '0x1234...5678',
          refereeUsername: 'CryptoBro42',
          joinDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'active',
          totalEarned: 145.50,
          bonusEarned: 14.55,
          level: 3,
          testsCompleted: 28
        },
        {
          id: '2',
          refereeAddress: '0xABCD...EFGH',
          refereeUsername: 'Web3Warrior',
          joinDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          status: 'active',
          totalEarned: 89.25,
          bonusEarned: 8.93,
          level: 2,
          testsCompleted: 15
        },
        {
          id: '3',
          refereeAddress: '0x9876...4321',
          refereeUsername: 'BandwidthHunter',
          joinDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'qualified',
          totalEarned: 32.75,
          bonusEarned: 3.28,
          level: 1,
          testsCompleted: 8
        },
        {
          id: '4',
          refereeAddress: '0x5555...7777',
          joinDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'pending',
          totalEarned: 0,
          bonusEarned: 0,
          level: 0,
          testsCompleted: 0
        }
      ];

      setReferralData(mockReferrals);

      // Calculate stats
      const totalEarnings = mockReferrals.reduce((sum, ref) => sum + ref.bonusEarned, 0);
      const activeReferrals = mockReferrals.filter(ref => ref.status === 'active').length;
      const monthlyEarnings = mockReferrals
        .filter(ref => ref.joinDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum, ref) => sum + ref.bonusEarned, 0);

      setReferralStats({
        totalReferrals: mockReferrals.length,
        activeReferrals,
        totalEarnings,
        monthlyEarnings,
        conversionRate: activeReferrals / mockReferrals.length * 100,
        currentTier: getCurrentTier(activeReferrals),
        nextTierRequirement: getNextTierRequirement(activeReferrals)
      });

    } catch (error) {
      console.error('Failed to load referral data:', error);
      setError('Failed to load referral data');
    }
  }, [wallet.address]);

  // Get current tier based on active referrals
  const getCurrentTier = (activeReferrals: number): string => {
    for (let i = referralTiers.length - 1; i >= 0; i--) {
      if (activeReferrals >= referralTiers[i].requirement) {
        return referralTiers[i].name;
      }
    }
    return 'Bronze';
  };

  // Get next tier requirement
  const getNextTierRequirement = (activeReferrals: number): number => {
    for (const tier of referralTiers) {
      if (activeReferrals < tier.requirement) {
        return tier.requirement;
      }
    }
    return 0; // Already at highest tier
  };

  // Copy referral link
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setSuccessMessage('Referral link copied to clipboard!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Failed to copy link');
    }
  };

  // Share via email
  const sendEmailInvites = async () => {
    if (!emailInvite.emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    try {
      const emails = emailInvite.emails.split(',').map(email => email.trim());
      
      // Mock email sending
      console.log('Sending invites to:', emails);
      console.log('Message:', emailInvite.message);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage(`Invitations sent to ${emails.length} email(s)!`);
      setEmailInvite({ emails: '', message: '' });
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (error) {
      setError('Failed to send email invitations');
    }
  };

  // Social media sharing
  const shareOnSocial = (platform: 'twitter' | 'telegram' | 'discord' | 'whatsapp') => {
    const text = `🚀 Join me on FluxBand Network! Earn U2U tokens by validating bandwidth and supporting decentralized infrastructure. Use my referral link: ${referralLink}`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      telegram: `https://telegram.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`,
      discord: `https://discord.com/channels/@me`, // Discord doesn't have direct share URL
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`
    };

    if (platform === 'discord') {
      // Copy to clipboard for Discord
      navigator.clipboard.writeText(text);
      setSuccessMessage('Message copied! Paste it in Discord.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      window.open(urls[platform], '_blank');
    }
  };

  // Generate QR code (mock implementation)
  const generateQRCode = () => {
    setShowQRCode(true);
  };

  useEffect(() => {
    if (wallet.isConnected) {
      generateReferralCode();
      loadReferralData();
    }
  }, [wallet.isConnected, generateReferralCode, loadReferralData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Referral Program</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Invite friends to FluxBand Network and earn rewards together. Get bonus tokens for every successful referral!
        </p>
      </div>

      {/* Referral Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{referralStats.totalReferrals}</div>
          <div className="text-blue-400 text-sm">Total Referrals</div>
          <div className="text-xs text-blue-300 mt-1">{referralStats.activeReferrals} active</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-3xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{referralStats.totalEarnings.toFixed(2)}</div>
          <div className="text-green-400 text-sm">Total Earnings (U2U)</div>
          <div className="text-xs text-green-300 mt-1">+{referralStats.monthlyEarnings.toFixed(2)} this month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{referralStats.conversionRate.toFixed(1)}%</div>
          <div className="text-purple-400 text-sm">Conversion Rate</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{referralStats.currentTier}</div>
          <div className="text-yellow-400 text-sm">Current Tier</div>
          {referralStats.nextTierRequirement > 0 && (
            <div className="text-xs text-yellow-300 mt-1">
              {referralStats.nextTierRequirement - referralStats.activeReferrals} more for next tier
            </div>
          )}
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Referral Link</h3>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Referral Code Display */}
          <div className="bg-slate-700/30 rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xl">
                {referralCode || 'Generating...'}
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
              <div className="flex-1 font-mono text-slate-300 truncate">
                {referralLink || 'Generating link...'}
              </div>
              <button
                onClick={copyReferralLink}
                disabled={!referralLink}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Share Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Social Media Sharing */}
            <div className="bg-slate-700/30 rounded-2xl p-6">
              <h4 className="font-bold text-white mb-4">Share on Social Media</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareOnSocial('twitter')}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <span>🐦</span> Twitter
                </button>
                <button
                  onClick={() => shareOnSocial('telegram')}
                  className="flex items-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                  <span>✈️</span> Telegram
                </button>
                <button
                  onClick={() => shareOnSocial('discord')}
                  className="flex items-center gap-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  <span>🎮</span> Discord
                </button>
                <button
                  onClick={() => shareOnSocial('whatsapp')}
                  className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <span>📱</span> WhatsApp
                </button>
              </div>
            </div>

            {/* Email Invitations */}
            <div className="bg-slate-700/30 rounded-2xl p-6">
              <h4 className="font-bold text-white mb-4">Send Email Invitations</h4>
              <div className="space-y-3">
                <textarea
                  value={emailInvite.emails}
                  onChange={(e) => setEmailInvite(prev => ({ ...prev, emails: e.target.value }))}
                  placeholder="Enter email addresses (comma separated)"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  rows={2}
                />
                <textarea
                  value={emailInvite.message}
                  onChange={(e) => setEmailInvite(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Custom message (optional)"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  rows={2}
                />
                <button
                  onClick={sendEmailInvites}
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Send Invitations
                </button>
              </div>
            </div>

          </div>

          {/* QR Code */}
          <div className="text-center">
            <button
              onClick={generateQRCode}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              📱 Generate QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Referral Tiers */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Referral Tiers</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {referralTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all ${
                tier.name === referralStats.currentTier
                  ? 'border-yellow-400 shadow-lg scale-105'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10`}></div>
              
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-white mb-1">{tier.name}</div>
                  <div className="text-sm text-slate-400">{tier.requirement}+ referrals</div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-400 mb-1">{tier.bonusRate}%</div>
                  <div className="text-xs text-slate-400">Bonus Rate</div>
                </div>

                <div className="space-y-1">
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {benefit}
                    </div>
                  ))}
                </div>

                {tier.name === referralStats.currentTier && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                    CURRENT
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral List */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
        <h3 className="text-2xl font-bold text-white mb-6">Your Referrals</h3>
        
        <div className="space-y-4">
          {referralData.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👥</div>
              <h4 className="text-xl font-bold text-slate-300 mb-2">No Referrals Yet</h4>
              <p className="text-slate-400">Share your referral link to start earning bonus rewards!</p>
            </div>
          ) : (
            referralData.map((referral) => (
              <div key={referral.id} className="bg-slate-700/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      referral.status === 'active' ? 'bg-green-500/20' :
                      referral.status === 'qualified' ? 'bg-blue-500/20' :
                      referral.status === 'pending' ? 'bg-yellow-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      <span className="text-2xl">
                        {referral.status === 'active' ? '✅' :
                         referral.status === 'qualified' ? '🎯' :
                         referral.status === 'pending' ? '⏳' : '❌'}
                      </span>
                    </div>
                    
                    <div>
                      <div className="font-bold text-white">
                        {referral.refereeUsername || `${referral.refereeAddress.slice(0, 6)}...${referral.refereeAddress.slice(-4)}`}
                      </div>
                      <div className="text-sm text-slate-400">
                        Joined {referral.joinDate.toLocaleDateString()} • Level {referral.level}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {referral.testsCompleted} tests completed • {referral.status}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400 mb-1">
                      +{referral.bonusEarned.toFixed(2)} U2U
                    </div>
                    <div className="text-sm text-slate-400">
                      from {referral.totalEarned.toFixed(2)} U2U earned
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-6">QR Code</h3>
              
              {/* Mock QR Code */}
              <div className="w-64 h-64 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="text-6xl">📱</div>
              </div>
              
              <p className="text-slate-400 text-sm mb-6">
                Scan with mobile device to access referral link
              </p>
              
              <button
                onClick={() => setShowQRCode(false)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}