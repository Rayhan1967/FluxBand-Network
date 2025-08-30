import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

interface BandwidthTestResult {
  uploadSpeed: number;
  downloadSpeed: number;
  latency: number;
  timestamp: Date;
  nodeId: string;
}

interface UseBandwidthTestReturn {
  isTestingBandwidth: boolean;
  testResult: BandwidthTestResult | null;
  error: string | null;
  startBandwidthTest: (nodeId: string) => Promise<BandwidthTestResult | null>;
  resetTest: () => void;
}

export function useBandwidthTest(): UseBandwidthTestReturn {
  const [isTestingBandwidth, setIsTestingBandwidth] = useState(false);
  const [testResult, setTestResult] = useState<BandwidthTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startBandwidthTest = useCallback(async (nodeId: string): Promise<BandwidthTestResult | null> => {
    setIsTestingBandwidth(true);
    setError(null);
    setTestResult(null);

    try {
      // Simulate bandwidth testing
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second test

      // Generate realistic test results
      const uploadSpeed = Math.floor(Math.random() * 100) + 50; // 50-150 Mbps
      const downloadSpeed = Math.floor(Math.random() * 200) + 100; // 100-300 Mbps
      const latency = Math.floor(Math.random() * 50) + 10; // 10-60 ms

      const result: BandwidthTestResult = {
        uploadSpeed,
        downloadSpeed,
        latency,
        timestamp: new Date(),
        nodeId,
      };

      setTestResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bandwidth test failed';
      setError(errorMessage);
      console.error('Bandwidth test error:', err);
      return null;
    } finally {
      setIsTestingBandwidth(false);
    }
  }, []);

  const resetTest = useCallback(() => {
    setTestResult(null);
    setError(null);
    setIsTestingBandwidth(false);
  }, []);

  return {
    isTestingBandwidth,
    testResult,
    error,
    startBandwidthTest,
    resetTest,
  };
}

export default useBandwidthTest;