'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '../context/walletcontext';

interface TestResult {
  uploadSpeed: number;
  downloadSpeed: number;
  latency: number;
  uptime: number;
  timestamp: number;
}

export function BandwidthTester() {
  const { wallet, submitTest } = useWallet();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [results, setResults] = useState<TestResult | null>(null);
  const [nodeId, setNodeId] = useState('node-' + Math.random().toString(36).substr(2, 9));

  const runBandwidthTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentTest('Initializing...');

    const steps = [
      { name: 'Preparing test environment', duration: 1000 },
      { name: 'Testing upload speed', duration: 3000 },
      { name: 'Testing download speed', duration: 3000 },
      { name: 'Measuring latency', duration: 2000 },
      { name: 'Calculating uptime', duration: 1000 },
      { name: 'Generating proof', duration: 1500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentTest(steps[i].name);
      
      await new Promise(resolve => {
        const interval = setInterval(() => {
          setProgress(prev => {
            const newProgress = ((i * 100) + (prev % 100) + 2) / steps.length;
            if (newProgress >= ((i + 1) * 100) / steps.length) {
              clearInterval(interval);
              resolve(void 0);
            }
            return Math.min(newProgress, ((i + 1) * 100) / steps.length);
          });
        }, steps[i].duration / 50);
      });
    }

    // Simulate realistic test results
    const testResults: TestResult = {
      uploadSpeed: Math.floor(Math.random() * 100) + 50, // 50-150 Mbps
      downloadSpeed: Math.floor(Math.random() * 150) + 100, // 100-250 Mbps
      latency: Math.floor(Math.random() * 30) + 10, // 10-40 ms
      uptime: 95 + Math.floor(Math.random() * 5), // 95-100%
      timestamp: Date.now()
    };

    setResults(testResults);
    setCurrentTest('Test completed!');
    setProgress(100);
    setIsRunning(false);
  };

  const submitToBlockchain = async () => {
    if (!results || !wallet.isConnected) return;

    try {
      setCurrentTest('Submitting to blockchain...');
      const tx = await submitTest(
        nodeId,
        results.uploadSpeed,
        results.downloadSpeed,
        results.latency,
        results.uptime
      );
      
      alert(`Test submitted! TX: ${tx.hash}`);
      await tx.wait();
      alert('Test confirmed on blockchain! 🎉');
      
      // Reset for next test
      setResults(null);
      setNodeId('node-' + Math.random().toString(36).substr(2, 9));
    } catch (error: any) {
      alert(`Submission failed: ${error.message}`);
    }
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-2">🎯 Bandwidth Hunt</h3>
        <p className="text-text-secondary">Run bandwidth tests to earn proof shards and U2U rewards</p>
      </div>

      {/* Node ID Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Node ID</label>
        <input
          type="text"
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          disabled={isRunning}
          className="w-full px-4 py-2 bg-surface-light border border-surface rounded-lg focus:border-primary focus:outline-none"
        />
      </div>

      {/* Test Progress */}
      {isRunning && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-medium text-primary">{currentTest}</div>
            <div className="text-sm text-text-secondary mt-1">{progress.toFixed(1)}% Complete</div>
          </div>
          
          <div className="w-full bg-surface-light rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Test Results */}
      {results && !isRunning && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-surface-light rounded-lg">
            <div className="text-2xl font-bold text-primary">{results.uploadSpeed}</div>
            <div className="text-sm text-text-secondary">Upload Mbps</div>
          </div>
          <div className="text-center p-4 bg-surface-light rounded-lg">
            <div className="text-2xl font-bold text-accent">{results.downloadSpeed}</div>
            <div className="text-sm text-text-secondary">Download Mbps</div>
          </div>
          <div className="text-center p-4 bg-surface-light rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{results.latency}</div>
            <div className="text-sm text-text-secondary">Latency ms</div>
          </div>
          <div className="text-center p-4 bg-surface-light rounded-lg">
            <div className="text-2xl font-bold text-green-400">{results.uptime}%</div>
            <div className="text-sm text-text-secondary">Uptime</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!results ? (
          <button
            onClick={runBandwidthTest}
            disabled={isRunning || !wallet.isConnected}
            className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? '⏳ Testing...' : '🚀 Start Bandwidth Test'}
          </button>
        ) : (
          <>
            <button
              onClick={submitToBlockchain}
              className="flex-1 btn-primary py-3"
            >
              📤 Submit to Blockchain
            </button>
            <button
              onClick={() => setResults(null)}
              className="px-6 py-3 bg-surface-light hover:bg-surface rounded-lg transition-all"
            >
              🔄 New Test
            </button>
          </>
        )}
      </div>

      {!wallet.isConnected && (
        <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400">Connect your wallet to start bandwidth testing</p>
        </div>
      )}
    </div>
  );
}
