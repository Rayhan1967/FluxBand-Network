'use client';

import { useState, useEffect } from 'react';
import { CharacterSelector } from '../app/CharacterSelector';
import { ZoneExploration } from '../app/ZoneExploration';
import { ProofGallery } from '../app/ProofGallery';
import { GlobalLeaderboard } from '../app/GlobalLeaderboard';
import { NetworkStats } from '../app/NetworkStats';

interface UserStats {
  totalScore: number;
  shards: number;
  rank: number;
  u2uEarned: number;
  character: string;
  level: number;
}

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('hunt');
  const [userStats, setUserStats] = useState<UserStats>({
    totalScore: 0,
    shards: 5,
    rank: 1275,
    u2uEarned: 0,
    character: 'Bandwidth Seeker 3y3',
    level: 42
  });

  const [networkStats] = useState({
    totalValidators: 1247,
    activeBandwidth: '15.6 TB',
    proofShards: 8924,
    networkUptime: '99.7%'
  });

  return (
    <div className="min-h-screen bg-dark text-text-primary">
      {/* Header */}
      <header className="border-b border-surface-light bg-surface/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-text">FLUXBAND NETWORK</h1>
              <p className="text-primary font-medium">PROOF HUNT</p>
            </div>
            
            <nav className="flex gap-6">
              {[
                { id: 'hunt', label: 'Hunt', icon: '🎯' },
                { id: 'character', label: 'Character', icon: '👾' },
                { id: 'zones', label: 'Zones', icon: '🗺️' },
                { id: 'gallery', label: 'Gallery', icon: '🖼️' },
                { id: 'leaderboard', label: 'Rankings', icon: '🏆' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === item.id 
                      ? 'bg-primary text-dark' 
                      : 'hover:bg-surface-light'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {currentView === 'hunt' && (
          <div>
            <div className="text-center mb-8">
              <p className="text-lg text-text-secondary mb-4">
                Embark on a digital journey through decentralized bandwidth validation. 
                Collect proof shards, climb global rankings, and build your legend!
              </p>
              <h2 className="text-2xl font-bold mb-2">Welcome, {userStats.character}!</h2>
            </div>

            <NetworkStats stats={networkStats} userStats={userStats} />
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <button className="card p-6 text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-primary mb-2">Start Bandwidth Hunt</h3>
                <p className="text-text-secondary">Begin your proof hunt adventure</p>
              </button>
              
              <button className="card p-6 text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-primary mb-2">View Analytics</h3>
                <p className="text-text-secondary">Check your network performance</p>
              </button>
              
              <button className="card p-6 text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold text-primary mb-2">Global Leaderboard</h3>
                <p className="text-text-secondary">See top bandwidth hunters</p>
              </button>
            </div>
          </div>
        )}

        {currentView === 'character' && <CharacterSelector />}
        {currentView === 'zones' && <ZoneExploration />}
        {currentView === 'gallery' && <ProofGallery />}
        {currentView === 'leaderboard' && <GlobalLeaderboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-light bg-surface/30 backdrop-blur-md mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-text-secondary">
              Built for U2U Network Hackathon 2025 • FluxBand Network Team
            </div>
            <div className="flex gap-4">
              <span className="text-sm">🚀 More Features Coming Soon</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
