'use client';

import { useState, useEffect } from 'react';

interface NodeStats {
  name: string;
  ip: string;
  status: 'Connected' | 'Disconnected' | 'Unsupported';
  uptime: { hours: number; minutes: number };
  taps: number;
  rewards: number;
  seasonPoints: number;
}

export function AdvancedStats() {
  const [timeFilter, setTimeFilter] = useState('daily');
  const [nodes] = useState<NodeStats[]>([
    {
      name: 'Indefatigable Table',
      ip: '190.254.78.195',
      status: 'Disconnected',
      uptime: { hours: 0, minutes: 0 },
      taps: 0,
      rewards: 0,
      seasonPoints: 1625.15
    },
    {
      name: 'Majestic Starling',
      ip: '208.76.40.197',
      status: 'Unsupported',
      uptime: { hours: 0, minutes: 0 },
      taps: 0,
      rewards: 0,
      seasonPoints: 0
    },
    {
      name: 'Infatigable Gown',
      ip: '140.213.134.171',
      status: 'Disconnected',
      uptime: { hours: 0, minutes: 0 },
      taps: 0,
      rewards: 0,
      seasonPoints: 0
    }
  ]);

  const [rewardHistory, setRewardHistory] = useState([
    { date: '2025-08-21', network: 12, referrals: 0, boost: 5, bonus: 8 },
    { date: '2025-08-20', network: 15, referrals: 3, boost: 7, bonus: 12 },
    { date: '2025-08-19', network: 8, referrals: 2, boost: 3, bonus: 6 },
  ]);

  const totalRewards = rewardHistory.reduce((sum, day) => 
    sum + day.network + day.referrals + day.boost + day.bonus, 0);

  return (
    <div className="space-y-8">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Network Statistics</h2>
        <div className="flex gap-2">
          {['Daily', 'Weekly', 'Monthly'].map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-sm ${
                timeFilter === filter.toLowerCase() 
                  ? 'bg-primary text-dark' 
                  : 'bg-surface-light hover:bg-surface'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Reward Statistics Chart */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-6">Reward Stats</h3>
        
        {/* Legend */}
        <div className="flex gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Network</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Referrals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Boost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Bonus</span>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="flex items-end gap-4 h-48">
          {rewardHistory.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex flex-col-reverse w-full max-w-12">
                <div 
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${(day.network / 20) * 100}%` }}
                />
                <div 
                  className="bg-purple-500"
                  style={{ height: `${(day.referrals / 20) * 100}%` }}
                />
                <div 
                  className="bg-yellow-500"
                  style={{ height: `${(day.boost / 20) * 100}%` }}
                />
                <div 
                  className="bg-green-500 rounded-t"
                  style={{ height: `${(day.bonus / 20) * 100}%` }}
                />
              </div>
              <div className="text-xs text-text-secondary mt-2">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nodes Overview */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-surface-light">
          <h3 className="text-xl font-bold">My Nodes</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-light">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Name</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Today's Uptime</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Today's Taps</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Today's Rewards</th>
                <th className="text-left p-4 text-sm font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node, index) => (
                <tr key={index} className="border-b border-surface-light">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        node.status === 'Connected' ? 'bg-green-400' :
                        node.status === 'Disconnected' ? 'bg-red-400' : 'bg-yellow-400'
                      }`} />
                      <div>
                        <div className="font-medium">{node.name}</div>
                        <div className="text-sm text-text-secondary">{node.ip}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      node.status === 'Connected' ? 'bg-green-500/20 text-green-400' :
                      node.status === 'Disconnected' ? 'bg-red-500/20 text-red-400' : 
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {node.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {node.uptime.hours} hr, {node.uptime.minutes} min
                  </td>
                  <td className="p-4 text-sm">{node.taps}</td>
                  <td className="p-4">
                    <div className="text-sm">
                      <span className="text-primary font-medium">+{node.rewards}</span>
                      <div className="text-text-secondary text-xs">
                        Season 1: {node.seasonPoints} pt
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="p-2 text-text-secondary hover:text-text-primary">
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{totalRewards}</div>
          <div className="text-sm text-text-secondary">Total Rewards (7 days)</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {nodes.filter(n => n.status === 'Connected').length}
          </div>
          <div className="text-sm text-text-secondary">Active Nodes</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">99.2%</div>
          <div className="text-sm text-text-secondary">Network Uptime</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-accent mb-2">1625.15</div>
          <div className="text-sm text-text-secondary">Season Points</div>
        </div>
      </div>
    </div>
  );
}
