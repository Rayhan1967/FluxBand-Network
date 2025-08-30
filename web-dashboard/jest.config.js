// src/components/LiveNetworkStats.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { NetworkStats } from '../types';
import { LoadingSpinner, SkeletonLoader } from './common/ErrorBoundary';

interface LiveNetworkStatsProps {
  className?: string;
}

interface LiveUpdate {
  type: 'network_stats' | 'new_test' | 'node_status' | 'reward_claimed';
  data: any;
  timestamp: number;
}

export const LiveNetworkStats: React.FC<LiveNetworkStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<LiveUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, lastMessage, sendMessage } = useWebSocket('/api/ws/network');

  useEffect(() => {
    if (lastMessage) {
      const update: LiveUpdate = JSON.parse(lastMessage);
      
      switch (update.type) {
        case 'network_stats':
          setStats(update.data);
          setIsLoading(false);
          break;
        case 'new_test':
        case 'node_status':
        case 'reward_claimed':
          setRecentActivity(prev => [update, ...prev.slice(0, 9)]); // Keep last 10
          break;
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    // Request initial data
    if (isConnected) {
      sendMessage(JSON.stringify({ type: 'subscribe', channels: ['network_stats', 'activity'] }));
    }
  }, [isConnected, sendMessage]);

  if (isLoading) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Live Network Stats</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">Connecting...</span>
          </div>
        </div>
        <SkeletonLoader lines={4} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 ${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-slate-400">No network data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Live Network Stats</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-sm text-slate-400">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-slate-700/30 rounded-xl">
          <div className="text-2xl font-bold text-teal-400 mb-1">
            {stats.totalNodes.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Total Nodes</div>
          <div className="text-xs text-green-400 mt-1">
            {stats.activeNodes}/{stats.totalNodes} active
          </div>
        </div>

        <div className="text-center p-4 bg-slate-700/30 rounded-xl">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {stats.totalBandwidth}
          </div>
          <div className="text-xs text-slate-400">Total Bandwidth</div>
          <div className="text-xs text-green-400 mt-1">
            +2.3% from yesterday
          </div>
        </div>

        <div className="text-center p-4 bg-slate-700/30 rounded-xl">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {stats.avgLatency}ms
          </div>
          <div className="text-xs text-slate-400">Avg Latency</div>
          <div className="text-xs text-green-400 mt-1">
            -5ms from last hour
          </div>
        </div>

        <div className="text-center p-4 bg-slate-700/30 rounded-xl">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {stats.uptime}%
          </div>
          <div className="text-xs text-slate-400">Network Uptime</div>
          <div className="text-xs text-green-400 mt-1">
            ↗ 99.9% this month
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <ActivityItem key={`${activity.timestamp}-${index}`} activity={activity} />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">⏳</div>
              <p className="text-slate-400 text-sm">Waiting for network activity...</p>
            </div>
          )}
        </div>
      </div>

      {/* Network Health Indicators */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Network Health</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-slate-400">Consensus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-slate-400">P2P Network</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-xs text-slate-400">Storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ activity: LiveUpdate }> = ({ activity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_test': return '🧪';
      case 'node_status': return '📡';
      case 'reward_claimed': return '💰';
      default: return '📊';
    }
  };

  const getActivityMessage = (activity: LiveUpdate) => {
    switch (activity.type) {
      case 'new_test':
        return `Bandwidth test completed: ${activity.data.uploadSpeed}/${activity.data.downloadSpeed} Mbps`;
      case 'node_status':
        return `Node ${activity.data.nodeId.slice(0, 8)}... ${activity.data.online ? 'came online' : 'went offline'}`;
      case 'reward_claimed':
        return `${activity.data.amount} U2U tokens claimed by ${activity.data.user.slice(0, 8)}...`;
      default:
        return 'Network activity detected';
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg">
      <div className="text-lg">{getActivityIcon(activity.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 truncate">
          {getActivityMessage(activity)}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {timeAgo(activity.timestamp)}
        </p>
      </div>
    </div>
  );
};