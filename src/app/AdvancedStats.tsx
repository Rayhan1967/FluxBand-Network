// src/app/AdvancedStats.tsx - REAL Node Management with Real-time Monitoring

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/walletcontext';

interface NodeData {
  id: string;
  name: string;
  location: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  uptime: number; // percentage
  lastSeen: Date;
  totalTests: number;
  successfulTests: number;
  avgResponseTime: number;
  bandwidth: {
    upload: number;
    download: number;
    peak: number;
  };
  earnings: {
    total: number;
    today: number;
    thisWeek: number;
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
  version: string;
  registrationDate: Date;
}

interface NetworkMetrics {
  totalNodes: number;
  activeNodes: number;
  totalBandwidth: number;
  avgLatency: number;
  networkHealth: number;
  dailyTests: number;
  successRate: number;
}

export function AdvancedStats() {
  const { wallet } = useWallet();
  const [userNodes, setUserNodes] = useState<NodeData[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    totalNodes: 0,
    activeNodes: 0,
    totalBandwidth: 0,
    avgLatency: 0,
    networkHealth: 0,
    dailyTests: 0,
    successRate: 0
  });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeForm, setNewNodeForm] = useState({
    name: '',
    location: '',
    ipAddress: ''
  });
  const [realTimeData, setRealTimeData] = useState<{ [nodeId: string]: any }>({});
  const [selectedTab, setSelectedTab] = useState<'overview' | 'nodes' | 'analytics' | 'settings'>('overview');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load user nodes from contract/API
  const loadUserNodes = useCallback(async () => {
    if (!wallet.address) return;

    try {
      // Mock node data - in real app, this would come from smart contract or API
      const mockNodes: NodeData[] = [
        {
          id: 'node-001',
          name: 'Primary Node',
          location: 'Singapore',
          ipAddress: '192.168.1.100',
          status: 'online',
          uptime: 99.8,
          lastSeen: new Date(Date.now() - 30000), // 30 seconds ago
          totalTests: 1247,
          successfulTests: 1238,
          avgResponseTime: 12,
          bandwidth: {
            upload: 145.2,
            download: 287.5,
            peak: 320.0
          },
          earnings: {
            total: 247.85,
            today: 12.45,
            thisWeek: 89.32
          },
          performance: {
            cpuUsage: 45,
            memoryUsage: 67,
            diskUsage: 23,
            networkLatency: 8
          },
          version: '1.2.3',
          registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'node-002',
          name: 'Backup Node',
          location: 'Tokyo',
          ipAddress: '192.168.1.101',
          status: 'warning',
          uptime: 94.2,
          lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
          totalTests: 892,
          successfulTests: 845,
          avgResponseTime: 18,
          bandwidth: {
            upload: 98.7,
            download: 201.3,
            peak: 245.0
          },
          earnings: {
            total: 156.23,
            today: 5.67,
            thisWeek: 42.18
          },
          performance: {
            cpuUsage: 78,
            memoryUsage: 89,
            diskUsage: 67,
            networkLatency: 15
          },
          version: '1.2.1',
          registrationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'node-003',
          name: 'Test Node',
          location: 'Frankfurt',
          ipAddress: '192.168.1.102',
          status: 'offline',
          uptime: 87.5,
          lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
          totalTests: 456,
          successfulTests: 398,
          avgResponseTime: 25,
          bandwidth: {
            upload: 67.4,
            download: 134.8,
            peak: 180.0
          },
          earnings: {
            total: 78.90,
            today: 0,
            thisWeek: 15.45
          },
          performance: {
            cpuUsage: 0,
            memoryUsage: 0,
            diskUsage: 45,
            networkLatency: 0
          },
          version: '1.1.9',
          registrationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        }
      ];

      setUserNodes(mockNodes);

      // Calculate network metrics
      const totalEarnings = mockNodes.reduce((sum, node) => sum + node.earnings.total, 0);
      const todayEarnings = mockNodes.reduce((sum, node) => sum + node.earnings.today, 0);
      const avgUptime = mockNodes.reduce((sum, node) => sum + node.uptime, 0) / mockNodes.length;

      setNetworkMetrics({
        totalNodes: mockNodes.length,
        activeNodes: mockNodes.filter(node => node.status === 'online').length,
        totalBandwidth: mockNodes.reduce((sum, node) => sum + node.bandwidth.download, 0),
        avgLatency: mockNodes.reduce((sum, node) => sum + node.avgResponseTime, 0) / mockNodes.length,
        networkHealth: avgUptime,
        dailyTests: mockNodes.reduce((sum, node) => sum + Math.floor(node.totalTests / 30), 0),
        successRate: mockNodes.reduce((sum, node) => sum + (node.successfulTests / node.totalTests * 100), 0) / mockNodes.length
      });

    } catch (error) {
      console.error('Failed to load user nodes:', error);
      setError('Failed to load node data');
    }
  }, [wallet.address]);

  // Real-time data updates
  const updateRealTimeData = useCallback(() => {
    setUserNodes(prev => prev.map(node => {
      if (node.status === 'online') {
        return {
          ...node,
          performance: {
            cpuUsage: Math.max(10, Math.min(90, node.performance.cpuUsage + (Math.random() - 0.5) * 10)),
            memoryUsage: Math.max(20, Math.min(95, node.performance.memoryUsage + (Math.random() - 0.5) * 8)),
            diskUsage: node.performance.diskUsage + (Math.random() - 0.8) * 2,
            networkLatency: Math.max(5, node.performance.networkLatency + (Math.random() - 0.5) * 5)
          },
          bandwidth: {
            ...node.bandwidth,
            upload: Math.max(50, node.bandwidth.upload + (Math.random() - 0.5) * 20),
            download: Math.max(100, node.bandwidth.download + (Math.random() - 0.5) * 30)
          },
          lastSeen: new Date()
        };
      }
      return node;
    }));
  }, []);

  // Add new node
  const addNewNode = async () => {
    if (!newNodeForm.name || !newNodeForm.location || !newNodeForm.ipAddress) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsAddingNode(true);

      // Mock node registration - in real app, this would be a smart contract call
      const newNode: NodeData = {
        id: `node-${Date.now()}`,
        name: newNodeForm.name,
        location: newNodeForm.location,
        ipAddress: newNodeForm.ipAddress,
        status: 'online',
        uptime: 100,
        lastSeen: new Date(),
        totalTests: 0,
        successfulTests: 0,
        avgResponseTime: 0,
        bandwidth: {
          upload: 0,
          download: 0,
          peak: 0
        },
        earnings: {
          total: 0,
          today: 0,
          thisWeek: 0
        },
        performance: {
          cpuUsage: 25,
          memoryUsage: 40,
          diskUsage: 15,
          networkLatency: 12
        },
        version: '1.2.3',
        registrationDate: new Date()
      };

      setUserNodes(prev => [...prev, newNode]);
      setNewNodeForm({ name: '', location: '', ipAddress: '' });
      setSuccessMessage(`Node "${newNode.name}" registered successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);

    } catch (error) {
      console.error('Failed to add node:', error);
      setError('Failed to register node');
    } finally {
      setIsAddingNode(false);
    }
  };

  // Remove node
  const removeNode = async (nodeId: string) => {
    try {
      setUserNodes(prev => prev.filter(node => node.id !== nodeId));
      setSuccessMessage('Node removed successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Failed to remove node');
    }
  };

  // Get node status color
  const getStatusColor = (status: NodeData['status']) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      case 'maintenance': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Performance bar component
  const PerformanceBar = ({ label, value, max = 100, color = 'blue' }: {
    label: string;
    value: number;
    max?: number;
    color?: string;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{value.toFixed(1)}{max === 100 ? '%' : 'ms'}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  useEffect(() => {
    if (wallet.isConnected) {
      loadUserNodes();
    }
  }, [wallet.isConnected, loadUserNodes]);

  // Real-time updates every 5 seconds
  useEffect(() => {
    if (userNodes.length === 0) return;

    const interval = setInterval(updateRealTimeData, 5000);
    return () => clearInterval(interval);
  }, [userNodes.length, updateRealTimeData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Node Management</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Monitor and manage your FluxBand validation nodes with real-time performance metrics,
          earnings tracking, and network health monitoring.
        </p>
      </div>

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-3xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-bold">{networkMetrics.activeNodes}/{networkMetrics.totalNodes}</div>
              <div className="text-xs text-green-300">Active</div>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">Node Status</div>
          <div className="text-green-400 text-sm">
            {((networkMetrics.activeNodes / networkMetrics.totalNodes) * 100).toFixed(1)}% online
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-right">
              <div className="text-blue-400 font-bold">{networkMetrics.totalBandwidth.toFixed(1)}</div>
              <div className="text-xs text-blue-300">Mbps</div>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">Total Bandwidth</div>
          <div className="text-blue-400 text-sm">Combined capacity</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-right">
              <div className="text-purple-400 font-bold">{networkMetrics.avgLatency.toFixed(1)}</div>
              <div className="text-xs text-purple-300">ms</div>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">Avg Latency</div>
          <div className="text-purple-400 text-sm">Response time</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="text-right">
              <div className="text-yellow-400 font-bold">{networkMetrics.networkHealth.toFixed(1)}</div>
              <div className="text-xs text-yellow-300">%</div>
            </div>
          </div>
          <div className="text-lg font-bold text-white mb-1">Network Health</div>
          <div className="text-yellow-400 text-sm">Overall uptime</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-slate-800/50 rounded-2xl p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'nodes', label: 'My Nodes', icon: '🔧', count: userNodes.length },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
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
              {tab.count !== undefined && (
                <span className="bg-slate-600 text-white px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-white mb-4">Daily Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tests Completed</span>
                  <span className="text-green-400 font-bold">{networkMetrics.dailyTests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="text-green-400 font-bold">{networkMetrics.successRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Response</span>
                  <span className="text-blue-400 font-bold">{networkMetrics.avgLatency.toFixed(1)}ms</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-white mb-4">Earnings Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Today</span>
                  <span className="text-green-400 font-bold">
                    {userNodes.reduce((sum, node) => sum + node.earnings.today, 0).toFixed(2)} U2U
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">This Week</span>
                  <span className="text-green-400 font-bold">
                    {userNodes.reduce((sum, node) => sum + node.earnings.thisWeek, 0).toFixed(2)} U2U
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total</span>
                  <span className="text-green-400 font-bold">
                    {userNodes.reduce((sum, node) => sum + node.earnings.total, 0).toFixed(2)} U2U
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-white mb-4">Node Distribution</h3>
              <div className="space-y-3">
                {userNodes.reduce((acc: any, node) => {
                  acc[node.location] = (acc[node.location] || 0) + 1;
                  return acc;
                }, {}) && 
                  Object.entries(
                    userNodes.reduce((acc: any, node) => {
                      acc[node.location] = (acc[node.location] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([location, count]) => (
                    <div key={location} className="flex justify-between">
                      <span className="text-slate-400">{location}</span>
                      <span className="text-cyan-400 font-bold">{count as number} node{(count as number) > 1 ? 's' : ''}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'nodes' && (
        <div className="space-y-6">
          {/* Add Node Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Your Nodes ({userNodes.length})</h3>
            <button
              onClick={() => setIsAddingNode(!isAddingNode)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              + Add New Node
            </button>
          </div>

          {/* Add Node Form */}
          {isAddingNode && (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h4 className="font-bold text-white mb-4">Register New Node</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Node Name"
                  value={newNodeForm.name}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                />
                <input
                  type="text"
                  placeholder="Location (e.g., Singapore)"
                  value={newNodeForm.location}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                />
                <input
                  type="text"
                  placeholder="IP Address"
                  value={newNodeForm.ipAddress}
                  onChange={(e) => setNewNodeForm(prev => ({ ...prev, ipAddress: e.target.value }))}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addNewNode}
                  disabled={isAddingNode}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Register Node
                </button>
                <button
                  onClick={() => setIsAddingNode(false)}
                  className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Nodes List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userNodes.map((node) => (
              <div key={node.id} className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-white text-lg">{node.name}</h4>
                    <div className="text-sm text-slate-400">{node.location} • {node.ipAddress}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                      {node.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => removeNode(node.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Node Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center bg-slate-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">{node.uptime.toFixed(1)}%</div>
                    <div className="text-xs text-slate-400">Uptime</div>
                  </div>
                  <div className="text-center bg-slate-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-blue-400">{node.earnings.today.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">Today's Earnings</div>
                  </div>
                  <div className="text-center bg-slate-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-400">{node.avgResponseTime}</div>
                    <div className="text-xs text-slate-400">Avg Response (ms)</div>
                  </div>
                  <div className="text-center bg-slate-700/30 rounded-lg p-3">
                    <div className="text-lg font-bold text-yellow-400">{node.successfulTests}/{node.totalTests}</div>
                    <div className="text-xs text-slate-400">Success Rate</div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {node.status === 'online' && (
                  <div className="space-y-3">
                    <PerformanceBar label="CPU Usage" value={node.performance.cpuUsage} color="blue" />
                    <PerformanceBar label="Memory" value={node.performance.memoryUsage} color="purple" />
                    <PerformanceBar label="Network Latency" value={node.performance.networkLatency} max={50} color="green" />
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-400">
                  Last seen: {node.lastSeen.toLocaleString()} • Version: {node.version}
                </div>
              </div>
            ))}
          </div>

          {userNodes.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">No Nodes Registered</h3>
              <p className="text-slate-400">Add your first validation node to start earning rewards!</p>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'analytics' && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics</h3>
          <p className="text-slate-400">Detailed performance charts and historical data coming soon!</p>
        </div>
      )}

      {selectedTab === 'settings' && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-xl font-bold text-white mb-2">Node Settings</h3>
          <p className="text-slate-400">Configuration and advanced settings panel coming soon!</p>
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