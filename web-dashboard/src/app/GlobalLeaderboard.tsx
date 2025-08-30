'use client';

import { useState } from 'react';

const leaderboardData = [
  {
    rank: 1,
    username: 'Data Seeker 3y3!',
    character: 'Nova',
    score: 34230,
    shards: 15,
    lastSeen: '2025-08-29',
    country: '🇮🇩',
    badge: '👑'
  },
  {
    rank: 2,
    username: 'QuantumHunter_L',
    character: 'Spectre', 
    score: 31150,
    shards: 12,
    lastSeen: '2025-08-29',
    country: '🇺🇸',
    badge: '🥈'
  },
  {
    rank: 3,
    username: 'ProofSeeker Alpha',
    character: 'Pulse',
    score: 28900,
    shards: 11,
    lastSeen: '2025-08-28',
    country: '🇯🇵',
    badge: '🥉'
  },
  {
    rank: 4,
    username: 'CryptoValidator',
    character: 'Nova',
    score: 25670,
    shards: 10,
    lastSeen: '2025-08-28',
    country: '🇬🇧',
    badge: '🏅'
  },
  {
    rank: 5,
    username: 'ShardMaster99',
    character: 'Spectre',
    score: 23440,
    shards: 9,
    lastSeen: '2025-08-27',
    country: '🇨🇦',
    badge: '🏅'
  }
];

export function GlobalLeaderboard() {
  const [timeFilter, setTimeFilter] = useState('all-time');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold neon-text mb-4">GLOBAL LEADERBOARD</h2>
        <p className="text-lg text-text-secondary">
          The elite ranks of the Irys Network. Leaderboard resets every Sunday at 00:00 GMT.
          Top performers get accelerated Seasons passes and exclusive rewards.
        </p>
      </div>

      {/* Top Champions Banner */}
      <div className="card p-6 text-center bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4">🏆 TOP 10 CHAMPIONS 🏆</h3>
        <p className="text-sm text-text-secondary">
          The elite rank seekers of the Irys Network
          Solution source energy unlock - Real world achievements
        </p>
      </div>

      {/* Time Filters */}
      <div className="flex justify-center gap-4">
        {['all-time', 'weekly', 'monthly'].map(filter => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeFilter === filter
                ? 'bg-primary text-dark'
                : 'bg-surface-light hover:bg-surface'
            }`}
          >
            {filter.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Current User Rank */}
      <div className="card p-4 bg-primary/10 border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              👾
            </div>
            <div>
              <div className="font-bold">Your Position</div>
              <div className="text-sm text-text-secondary">Bandwidth Seeker 3y3</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">#1275</div>
            <div className="text-sm text-text-secondary">0 points</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-light">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">RANK</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">HUNTER</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">CHARACTER</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">SCORE</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">SHARDS</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">LAST SEEN</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((player, index) => (
                <tr 
                  key={player.rank}
                  className={`border-b border-surface-light hover:bg-surface-light/50 transition-all ${
                    player.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{player.badge}</span>
                      <span className="font-bold text-lg">#{player.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        {player.character === 'Nova' ? '👾' : player.character === 'Spectre' ? '👻' : '⚡'}
                      </div>
                      <div>
                        <div className="font-medium">{player.username}</div>
                        <div className="text-sm text-text-secondary">{player.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-accent/20 text-accent rounded text-sm">
                      {player.character}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary text-lg">
                      {player.score.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">💎</span>
                      <span className="font-medium">{player.shards}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {player.lastSeen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back to Menu Button */}
      <div className="text-center">
        <button className="btn-primary px-8 py-3">
          🎯 BACK TO MENU
        </button>
      </div>
    </div>
  );
}
