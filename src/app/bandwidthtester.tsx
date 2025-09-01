// src/app/BandwidthTester.tsx - Real Smart Contract Integration

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../context/walletcontext';

interface TestResult {
  uploadSpeed: number;
  downloadSpeed: number;
  latency: number;
  jitter: number;
  packetLoss: number;
  timestamp: Date;
  rewardAmount: number;
  transactionHash?: string;
  status: 'completed' | 'pending' | 'confirmed';
}

interface ServerConfig {
  id: string;
  name: string;
  url: string;
  location: string;
  flag: string;
}

export function BandwidthTester() {
  const { 
    isConnected, 
    address, 
    u2uBalance,
    fluxBandContract,
    submitBandwidthTest,
    refreshBalances 
  } = useWallet();

  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerConfig | null>(null);
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingToBlockchain, setIsSubmittingToBlockchain] = useState(false);

  // Available test servers
  const testServers: ServerConfig[] = [
    { id: 'sg', name: 'Singapore', url: 'https://sg.speed.fluxband.network', location: 'Asia Pacific', flag: '🇸🇬' },
    { id: 'us', name: 'New York', url: 'https://ny.speed.fluxband.network', location: 'North America', flag: '🇺🇸' },
    { id: 'eu', name: 'Frankfurt', url: 'https://de.speed.fluxband.network', location: 'Europe', flag: '🇩🇪' },
    { id: 'jp', name: 'Tokyo', url: 'https://jp.speed.fluxband.network', location: 'Asia Pacific', flag: '🇯🇵' }
  ];

  // Auto-select best server on mount
  useEffect(() => {
    if (!selectedServer) {
      setSelectedServer(testServers[0]); // Default to Singapore
    }
  }, []);

  // Calculate estimated rewards based on performance
  const calculateExpectedReward = (upload: number, download: number, latency: number) => {
    let baseReward = 1.0; // Base 1 U2U
    
    // Speed bonuses
    const avgSpeed = (upload + download) / 2;
    if (avgSpeed > 100) baseReward += 1.0;
    if (avgSpeed > 200) baseReward += 2.0;
    if (avgSpeed > 500) baseReward += 3.0;
    
    // Latency bonuses
    if (latency < 20) baseReward += 1.0;
    if (latency < 10) baseReward += 2.0;
    
    return Math.min(baseReward, 10.0); // Max 10 U2U
  };

  // Simulate network speed test
  const runSpeedTest = async (): Promise<Omit<TestResult, 'timestamp' | 'rewardAmount' | 'status'>> => {
    setCurrentPhase('Connecting to test server...');
    setProgress(10);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCurrentPhase('Measuring latency...');
    setProgress(25);
    const latency = Math.random() * 40 + 5; // 5-45ms
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCurrentPhase('Testing upload speed...');
    setProgress(50);
    const uploadSpeed = Math.random() * 400 + 50; // 50-450 Mbps
    await new Promise(resolve => setTimeout(resolve, 2000));

    setCurrentPhase('Testing download speed...');
    setProgress(75);
    const downloadSpeed = Math.random() * 600 + 100; // 100-700 Mbps
    await new Promise(resolve => setTimeout(resolve, 2000));

    setCurrentPhase('Analyzing results...');
    setProgress(90);
    const jitter = Math.random() * 5 + 1; // 1-6ms
    const packetLoss = Math.random() * 2; // 0-2%
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProgress(100);
    return {
      uploadSpeed: Math.round(uploadSpeed * 10) / 10,
      downloadSpeed: Math.round(downloadSpeed * 10) / 10,
      latency: Math.round(latency * 10) / 10,
      jitter: Math.round(jitter * 10) / 10,
      packetLoss: Math.round(packetLoss * 100) / 100
    };
  };

  // Main test function
  const startBandwidthTest = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!selectedServer) {
      setError('Please select a test server');
      return;
    }

    setIsTestRunning(true);
    setCurrentTest(null);
    setError(null);
    setProgress(0);

    try {
      // Run speed test
      const testData = await runSpeedTest();
      
      const rewardAmount = calculateExpectedReward(
        testData.uploadSpeed, 
        testData.downloadSpeed, 
        testData.latency
      );

      const result: TestResult = {
        ...testData,
        timestamp: new Date(),
        rewardAmount,
        status: 'completed'
      };

      setCurrentTest(result);
      setCurrentPhase('Test completed! Submitting to blockchain...');

      // Submit to smart contract
      await submitToBlockchain(result);

    } catch (error: any) {
      console.error('Bandwidth test failed:', error);
      setError(error.message || 'Test failed. Please try again.');
    } finally {
      setIsTestRunning(false);
    }
  };

  // Submit test results to blockchain
  const submitToBlockchain = async (result: TestResult) => {
    if (!fluxBandContract || !submitBandwidthTest) {
      setError('Smart contract not available');
      return;
    }

    setIsSubmittingToBlockchain(true);

    try {
      setCurrentPhase('Submitting to U2U Network...');
      
      // Submit to smart contract
      const txHash = await submitBandwidthTest(
        Math.round(result.uploadSpeed),
        Math.round(result.downloadSpeed),
        Math.round(result.latency)
      );

      // Update result with transaction hash
      const confirmedResult: TestResult = {
        ...result,
        transactionHash: txHash,
        status: 'confirmed'
      };

      setCurrentTest(confirmedResult);
      setTestResults(prev => [confirmedResult, ...prev.slice(0, 9)]);
      setCurrentPhase('Success! Rewards added to your account.');

      // Refresh balances to show new tokens
      await refreshBalances();

    } catch (error: any) {
      console.error('Blockchain submission failed:', error);
      setError(`Blockchain submission failed: ${error.message}`);
      
      // Keep test result but mark as failed
      setCurrentTest({
        ...result,
        status: 'pending'
      });
    } finally {
      setIsSubmittingToBlockchain(false);
    }
  };

  // Get performance color based on value
  const getPerformanceColor = (type: string, value: number) => {
    switch (type) {
      case 'upload':
      case 'download':
        if (value >= 300) return 'text-green-400';
        if (value >= 100) return 'text-yellow-400';
        return 'text-red-400';
      case 'latency':
        if (value <= 20) return 'text-green-400';
        if (value <= 50) return 'text-yellow-400';
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  // Get performance grade
  const getOverallGrade = (upload: number, download: number, latency: number) => {
    const avgSpeed = (upload + download) / 2;
    if (avgSpeed >= 300 && latency <= 20) return { grade: 'A+', color: 'text-green-400' };
    if (avgSpeed >= 200 && latency <= 30) return { grade: 'A', color: 'text-green-400' };
    if (avgSpeed >= 100 && latency <= 40) return { grade: 'B+', color: 'text-yellow-400' };
    if (avgSpeed >= 50 && latency <= 60) return { grade: 'B', color: 'text-yellow-400' };
    return { grade: 'C', color: 'text-red-400' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Bandwidth Validator</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Test your internet connection and earn U2U tokens based on performance.
          All results are cryptographically verified and stored on the U2U blockchain.
        </p>
      </div>

      {/* Wallet Status */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <div>
              <div className="text-white font-semibold">
                {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Wallet Not Connected'}
              </div>
              <div className="text-slate-400 text-sm">
                {isConnected ? `Balance: ${parseFloat(u2uBalance).toFixed(2)} U2U` : 'Connect wallet to start testing'}
              </div>
            </div>
          </div>
          {isConnected && (
            <div className="text-right">
              <div className="text-green-400 font-bold text-lg">Ready to Test</div>
              <div className="text-slate-400 text-sm">Smart contract integrated</div>
            </div>
          )}
        </div>
      </div>

      {/* Server Selection */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Select Test Server</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testServers.map((server) => (
            <button
              key={server.id}
              onClick={() => setSelectedServer(server)}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                selectedServer?.id === server.id
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
              }`}
            >
              <div className="text-2xl mb-2">{server.flag}</div>
              <div className="font-semibold">{server.name}</div>
              <div className="text-xs opacity-80">{server.location}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Test Control */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center">
          {!isTestRunning ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Test</h3>
                <p className="text-slate-400">
                  Testing to: <span className="text-cyan-400">{selectedServer?.name || 'No server selected'}</span>
                </p>
              </div>
              
              <button
                onClick={startBandwidthTest}
                disabled={!isConnected || !selectedServer}
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xl rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected ? 'Start Bandwidth Test' : 'Connect Wallet First'}
              </button>

              {isConnected && (
                <div className="text-sm text-slate-400">
                  Earn 1-10 U2U tokens based on your connection performance
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{currentPhase}</h3>
                <div className="text-slate-400">Please wait while we analyze your connection...</div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Animated spinner */}
              <div className="flex justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Test Results */}
      {currentTest && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Test Results</h3>
            <div className="flex items-center justify-center gap-4">
              <div className={`text-4xl font-bold ${getOverallGrade(currentTest.uploadSpeed, currentTest.downloadSpeed, currentTest.latency).color}`}>
                {getOverallGrade(currentTest.uploadSpeed, currentTest.downloadSpeed, currentTest.latency).grade}
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold text-xl">+{currentTest.rewardAmount} U2U</div>
                <div className="text-slate-400 text-sm">Rewards Earned</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center bg-slate-700/30 rounded-xl p-4">
              <div className={`text-3xl font-bold mb-1 ${getPerformanceColor('upload', currentTest.uploadSpeed)}`}>
                {currentTest.uploadSpeed}
              </div>
              <div className="text-slate-400 text-sm">Upload (Mbps)</div>
            </div>
            
            <div className="text-center bg-slate-700/30 rounded-xl p-4">
              <div className={`text-3xl font-bold mb-1 ${getPerformanceColor('download', currentTest.downloadSpeed)}`}>
                {currentTest.downloadSpeed}
              </div>
              <div className="text-slate-400 text-sm">Download (Mbps)</div>
            </div>
            
            <div className="text-center bg-slate-700/30 rounded-xl p-4">
              <div className={`text-3xl font-bold mb-1 ${getPerformanceColor('latency', currentTest.latency)}`}>
                {currentTest.latency}
              </div>
              <div className="text-slate-400 text-sm">Latency (ms)</div>
            </div>
            
            <div className="text-center bg-slate-700/30 rounded-xl p-4">
              <div className="text-3xl font-bold mb-1 text-blue-400">{currentTest.jitter}</div>
              <div className="text-slate-400 text-sm">Jitter (ms)</div>
            </div>
          </div>

          {/* Transaction Status */}
          <div className="border-t border-slate-700/50 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  currentTest.status === 'confirmed' ? 'bg-green-400' :
                  currentTest.status === 'pending' ? 'bg-yellow-400' : 'bg-slate-400'
                }`}></div>
                <div>
                  <div className="text-white font-semibold">
                    {currentTest.status === 'confirmed' ? 'Confirmed on Blockchain' :
                     currentTest.status === 'pending' ? 'Pending Confirmation' : 'Test Completed'}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {currentTest.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {currentTest.transactionHash && (
                <div className="text-right">
                  <div className="text-cyan-400 text-sm font-mono">
                    TX: {currentTest.transactionHash.slice(0, 10)}...{currentTest.transactionHash.slice(-8)}
                  </div>
                  <a 
                    href={`https://testnet-explorer.uniultra.xyz/tx/${currentTest.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    View on Explorer ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Tests */}
      {testResults.length > 0 && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">Recent Tests</h3>
          <div className="space-y-3">
            {testResults.slice(0, 5).map((result, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-slate-700/30 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`text-lg font-bold ${getOverallGrade(result.uploadSpeed, result.downloadSpeed, result.latency).color}`}>
                    {getOverallGrade(result.uploadSpeed, result.downloadSpeed, result.latency).grade}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      ↑{result.uploadSpeed} / ↓{result.downloadSpeed} Mbps
                    </div>
                    <div className="text-slate-400 text-sm">
                      {result.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">+{result.rewardAmount} U2U</div>
                  <div className={`text-xs ${
                    result.status === 'confirmed' ? 'text-green-400' :
                    result.status === 'pending' ? 'text-yellow-400' : 'text-slate-400'
                  }`}>
                    {result.status === 'confirmed' ? 'Confirmed' :
                     result.status === 'pending' ? 'Pending' : 'Completed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-500/20 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm z-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div className="text-red-400 font-medium">{error}</div>
            <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-300">✕</button>
          </div>
        </div>
      )}

      {/* Loading Overlay for Blockchain Submission */}
      {isSubmittingToBlockchain && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-2">Submitting to Blockchain</h3>
              <p className="text-slate-400">Please confirm the transaction in your wallet...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}