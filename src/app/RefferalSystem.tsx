'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/context/walletcontext';

interface ReferralStats {
  totalReferred: number;
  todaysReferred: number;
  qualified: number;
  pending: number;
  referralCode: string;
  totalEarnings: number;
  bonusMultiplier: number;
}

export function ReferralSystem() {
  const { wallet } = useWallet();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferred: 0,
    todaysReferred: 0,
    qualified: 0,
    pending: 0,
    referralCode: '',
    totalEarnings: 0,
    bonusMultiplier: 10
  });

  useEffect(() => {
    if (wallet.address) {
      generateReferralCode();
      loadReferralStats();
    }
  }, [wallet.address]);

  const generateReferralCode = () => {
    const code = wallet.address?.slice(-6).toUpperCase() || 'FLUX01';
    setStats(prev => ({ ...prev, referralCode: code }));
  };

  const loadReferralStats = async () => {
    // Simulate loading referral data
    setStats(prev => ({
      ...prev,
      totalReferred: 0,
      qualified: 0,
      pending: 0,
      totalEarnings: 0
    }));
  };

  const copyReferralLink = () => {
    const link = `https://fluxband.network/signup?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(link);
    alert('Referral link copied!');
  };

  const shareOnTwitter = () => {
    const text = `Join me on FluxBand Network and earn U2U tokens by validating bandwidth! Use my referral code ${stats.referralCode}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://fluxband.network/signup?ref=${stats.referralCode}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Referral Program</h2>
        <p className="text-text-secondary">
          Invite friends and earn together! Get bonus rewards for every successful referral.
        </p>
      </div>

      {/* Referral Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-purple-400">{stats.totalReferred}</div>
          <div className="text-sm text-text-secondary">Total</div>
          <div className="text-sm text-text-secondary">Points</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.todaysReferred}</div>
          <div className="text-sm text-text-secondary">Today</div>
          <div className="text-sm text-text-secondary">Points</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-400">{stats.qualified}</div>
          <div className="text-sm text-text-secondary">Qualified</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-text-secondary">Pending</div>
        </div>
      </div>

      {/* Referral Rewards Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Get Points Section */}
        <div className="card p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Get 20 Points</h3>
          <p className="text-lg text-primary mb-6">+10% Bonus Rewards</p>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Friend's Email Address"
              className="w-full px-4 py-3 bg-surface-light border border-surface rounded-lg"
            />
            <button className="w-full btn-primary py-3">
              Send Invitation
            </button>
          </div>
        </div>

        {/* Referral Info */}
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-bold text-accent mb-4">🎁 Referrals</h4>
            <div className="bg-surface-light rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold">Referral Code:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-surface px-3 py-1 rounded text-primary font-mono">
                    {stats.referralCode}
                  </code>
                  <button
                    onClick={copyReferralLink}
                    className="px-3 py-1 bg-primary text-dark rounded text-sm hover:opacity-80"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary mb-4">
                Both parties get <span className="text-primary font-bold">20 points</span> for every
                qualified referral & The referrer earns{' '}
                <span className="text-accent font-bold">a perpetual 10% bonus</span> from all referees' rewards.
              </p>
              
              <p className="text-xs text-text-secondary mb-4">
                Drop your friend's email on the left and we're happy to invite them with your unique referral code.
              </p>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="space-y-4">
            <h5 className="font-bold">Share Your Referral Link:</h5>
            <div className="flex gap-4">
              <button
                onClick={shareOnTwitter}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                🐦 Tweet Your Referral
              </button>
              <button
                onClick={copyReferralLink}
                className="px-6 py-3 bg-surface-light hover:bg-surface rounded-lg transition-colors"
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
