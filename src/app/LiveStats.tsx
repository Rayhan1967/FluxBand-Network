'use client';

import { useState, useEffect } from 'react';

interface LiveData {
  activeNodes: number;
  totalBandwidth: number;
  recentTests: number;
  avgLatency: number;
  topPerformers: Array<{
    name: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  networkActivity: Array<{
    time: string;
    tests: number;
    rewards: number;
  }>;
}

export function LiveStats() {
  const [liveData, setLiveData] = useState<LiveData>({
    activeNodes: 1247,
    totalBandwidth: 15.6,
    recentTests: 892,
    avgLatency: 28,
    topPerformers: [
      { name: 'DataSeeker3y3', score: 34230, trend: 'up' },
      { name: 'QuantumHunter', score: 31150, trend: 'up' },
      { name: 'ProofMaster', score: 28900, trend: 'down' },
      { name: 'BandwidthKing', score: 25670, trend: 'stable' },
      { name: 'ShardCollector', score: 23440, trend: 'up' }
    ],
    networkActivity: []
  });

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        activeNodes: prev.activeNodes + Math.floor(Math.random() * 3) - 1,
        totalBandwidth: prev.totalBandwidth + (Math.random() - 0.5) * 0.1,
        recentTests: prev.recentTests + Math.floor(Math.random() * 5),
        avgLatency: Math.max(20, prev.avgLatency + Math.floor(Math.random() * 6) - 3),
        topPerformers: prev.topPerformers.map(p => ({
          ...p,
          score: p.score + Math.floor(Math.random() * 100) - 20,
          trend: Math.random() > 0.7 ? 
            (Math.random() > 0.5 ? 'up' : 'down') : p.trend
        }))
      }));
      setIsLive(true);
      setTimeout(() => setIsLive(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary">📊 Network Pulse</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400' : 'bg-green-600'} animate-pulse`} />
          <span className="text-sm text-green-400">Live</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="text-2xl font-bold text-primary">{liveData.activeNodes.toLocaleString()}</div>
          <div className="text-sm text-text-secondary">Active Nodes</div>
          <div className="text-xs text-green-400 mt-1">+12 today</div>
        </div>
        
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="text-2xl font-bold text-accent">{liveData.totalBandwidth.toFixed(1)} TB</div>
          <div className="text-sm text-text-secondary">Total Bandwidth</div>
          <div className="text-xs text-green-400 mt-1">+2.3% today</div>
        </div>
        
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="text-2xl font-bold text-yellow-400">{liveData.recentTests.toLocaleString()}</div>
          <div className="text-sm text-text-secondary">Tests (24h)</div>
          <div className="text-xs text-green-400 mt-1">+5 mins ago</div>
        </div>
        
        <div className="card p-4 text-center hover:scale-105 transition-transform">
          <div className="text-2xl font-bold text-purple-400">{liveData.avgLatency}ms</div>
          <div className="text-sm text-text-secondary">Avg Latency</div>
          <div className="text-xs text-red-400 mt-1">+2ms today</div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card p-6">
        <h4 className="text-xl font-bold text-primary mb-4">🏆 Top Performers</h4>
        <div className="space-y-3">
          {liveData.topPerformers.map((performer, index) => (
            <div key={performer.name} className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-medium">{performer.name}</div>
                  <div className="text-sm text-text-secondary">
                    {performer.score.toLocaleString()} points
                  </div>
                </div>
              </div>
              <div className="text-right">
                {performer.trend === 'up' && <span className="text-green-400">📈 +125</span>}
                {performer.trend === 'down' && <span className="text-red-400">📉 -67</span>}
                {performer.trend === 'stable' && <span className="text-yellow-400">➡️ +5</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h5 className="font-bold text-accent mb-2">⚡ Recent Activity</h5>
          <div className="text-sm text-text-secondary space-y-1">
            <div>• ProofHunter_X completed test: +2.5 U2U</div>
            <div>• New validator registered: NodeMaster99</div>
            <div>• Zone 3 unlocked by CryptoSeeker</div>
          </div>
        </div>
        
        <div className="card p-4">
          <h5 className="font-bold text-yellow-400 mb-2">🎯 Daily Challenges</h5>
          <div className="text-sm text-text-secondary space-y-1">
            <div>• Complete 10 tests: 7/10 ✅</div>
            <div>• Achieve  30ms latency: ❌</div>
            <div>• Discover rare shard: ❌</div>
          </div>
        </div>
        
        <div className="card p-4">
          <h5 className="font-bold text-purple-400 mb-2">🌟 Network Health</h5>
          <div className="text-sm text-text-secondary space-y-1">
            <div>• Uptime: 99.7% 🟢</div>
            <div>• Success Rate: 98.2% 🟢</div>
            <div>• Response Time: 24ms 🟢</div>
          </div>
        </div>
      </div>
    </div>
  );
}
