interface NetworkStatsProps {
  stats: {
    totalValidators: number;
    activeBandwidth: string;
    proofShards: number;
    networkUptime: string;
  };
  userStats: {
    totalScore: number;
    shards: number;
    rank: number;
    u2uEarned: number;
  };
}

export function NetworkStats({ stats, userStats }: NetworkStatsProps) {
  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="stats-grid">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-primary">{userStats.totalScore}</div>
          <div className="text-sm text-text-secondary">Total Score</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-accent">{userStats.shards}</div>
          <div className="text-sm text-text-secondary">Shards</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">#{userStats.rank}</div>
          <div className="text-sm text-text-secondary">Rank</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{userStats.u2uEarned}</div>
          <div className="text-sm text-text-secondary">U2U Earned</div>
        </div>
      </div>

      {/* Network Stats */}
      <div>
        <h3 className="text-xl font-bold mb-4">Network Statistics</h3>
        <div className="stats-grid">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalValidators}</div>
            <div className="text-sm text-text-secondary">Total Validators</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.activeBandwidth}</div>
            <div className="text-sm text-text-secondary">Active Bandwidth</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.proofShards}</div>
            <div className="text-sm text-text-secondary">Proof Shards</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.networkUptime}</div>
            <div className="text-sm text-text-secondary">Network Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}
