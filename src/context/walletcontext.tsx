'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Import contract ABIs
const FLUXBAND_ABI = [
  // User Profile Functions
  "function getUserProfile(address _user) external view returns (tuple(string username, string bio, string avatar, uint256 level, uint256 totalXP, uint256 joinTimestamp, uint256 totalEarnings, uint256 totalTests, uint256 successfulTests, uint256 referralCount, bool verified, bytes32[] achievements, uint256 globalRank, uint256 monthlyRank))",
  "function updateProfile(string calldata _username, string calldata _bio) external",
  
  // Bandwidth Testing
  "function submitBandwidthTest(uint256 _uploadSpeed, uint256 _downloadSpeed, uint256 _latency, bytes32 _proofHash) external",
  "function getUserTests(address _user) external view returns (tuple(address validator, uint256 uploadSpeed, uint256 downloadSpeed, uint256 latency, uint256 timestamp, bytes32 proofHash, uint256 rewardAmount, bool verified)[])",
  
  // Referral System
  "function generateReferralCode(string calldata _code) external",
  "function joinWithReferral(string calldata _referralCode) external",
  "function getUserReferrals(address _user) external view returns (address[])",
  "function userReferralCodes(address) external view returns (string)",
  
  // Staking
  "function stakeTokens(uint256 _amount) external",
  "function unstakeTokens(uint256 _amount) external",
  "function getStakingInfo(address _user) external view returns (tuple(uint256 stakedAmount, uint256 stakingTimestamp, uint256 lockEndTime, uint256 rewardsEarned, uint256 lastClaimTime, bool isStaking))",
  
  // Rewards
  "function claimReward(bytes32 _proofHash) external",
  "function claimAllRewards() external",
  "function getPendingRewards(address _user) external view returns (uint256)",
  "function getUserPendingRewards(address _user) external view returns (tuple(uint256 amount, uint256 timestamp, bytes32 proofHash, uint8 rewardType, bool claimed)[])",
  
  // Node Management
  "function registerNode(string calldata _name, string calldata _location, string calldata _ipAddress) external",
  "function getUserNodes(address _user) external view returns (tuple(string name, string location, string ipAddress, uint256 registrationTime, uint256 uptime, uint256 totalTests, uint256 successfulTests, uint256 totalEarnings, bool active, address owner)[])",
  
  // Achievements
  "function getUserAchievements(address _user) external view returns (bytes32[])",
  "function getAchievement(bytes32 _achievementId) external view returns (tuple(string name, string description, uint256 xpReward, uint256 tokenReward, uint8 category, uint8 rarity, bool exists))",
  
  // Leaderboard
  "function getTopLeaderboard(uint256 _count) external view returns (tuple(address user, uint256 points, uint256 earnings, uint256 tests, uint256 lastUpdate)[])",
  "function userRanks(address) external view returns (uint256)",
  
  // Events
  "event BandwidthTestSubmitted(address indexed validator, bytes32 indexed proofHash, uint256 rewardAmount, uint256 timestamp)",
  "event RewardClaimed(address indexed user, uint256 amount, uint8 rewardType, uint256 timestamp)",
  "event AchievementUnlocked(address indexed user, bytes32 indexed achievementId, uint256 xpReward, uint256 tokenReward)"
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

// ✅ FIXED: Add wallet object interface
interface WalletInfo {
  address: string | null;
  balance: string;
  isConnected: boolean;
}

interface WalletContextType {
  // ✅ ADDED: wallet object property
  wallet: WalletInfo;
  disconnect: () => void;

  
  // Wallet State
  isConnected: boolean;
  address: string | null;
  balance: string;
  signer: ethers.Signer | null;
  provider: ethers.Provider | null;
  
  // Token Balances
  u2uBalance: string;
  fluxBalance: string;
  
  // Smart Contract Integration
  fluxBandContract: ethers.Contract | null;
  u2uTokenContract: ethers.Contract | null;
  fluxTokenContract: ethers.Contract | null;
  
  // Contract Functions
  getUserProfile: () => Promise<any>;
  submitBandwidthTest: (uploadSpeed: number, downloadSpeed: number, latency: number) => Promise<string>;
  generateReferralCode: (code: string) => Promise<void>;
  joinWithReferral: (code: string) => Promise<void>;
  stakeTokens: (amount: string) => Promise<void>;
  claimAllRewards: () => Promise<void>;
  registerNode: (name: string, location: string, ipAddress: string) => Promise<void>;
  
  // Utility Functions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToU2UNetwork: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  
  // Loading States
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const U2U_TESTNET_CONFIG = {
  chainId: '0x9B4', // 2484 in hex
  chainName: 'U2U Testnet',
  nativeCurrency: {
    name: 'U2U',
    symbol: 'U2U',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-nebulas-testnet.uniultra.xyz'],
  blockExplorerUrls: ['https://testnet-explorer.uniultra.xyz'],
};

export function WalletProvider({ children }: { children: ReactNode }) {
  // Basic wallet state
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  
  // Token balances
  const [u2uBalance, setU2uBalance] = useState('0');
  const [fluxBalance, setFluxBalance] = useState('0');
  
  // Smart contracts
  const [fluxBandContract, setFluxBandContract] = useState<ethers.Contract | null>(null);
  const [u2uTokenContract, setU2uTokenContract] = useState<ethers.Contract | null>(null);
  const [fluxTokenContract, setFluxTokenContract] = useState<ethers.Contract | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contract addresses from environment
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const U2U_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_U2U_TOKEN_ADDRESS;
  const FLUX_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_FLUX_TOKEN_ADDRESS;

  // ✅ ADDED: Create wallet object
  const wallet: WalletInfo = {
    address,
    balance,
    isConnected
  };

  // Initialize contracts when signer is available
  useEffect(() => {
    if (signer && CONTRACT_ADDRESS && U2U_TOKEN_ADDRESS && FLUX_TOKEN_ADDRESS) {
      const fluxBand = new ethers.Contract(CONTRACT_ADDRESS, FLUXBAND_ABI, signer);
      const u2uToken = new ethers.Contract(U2U_TOKEN_ADDRESS, ERC20_ABI, signer);
      const fluxToken = new ethers.Contract(FLUX_TOKEN_ADDRESS, ERC20_ABI, signer);
      
      setFluxBandContract(fluxBand);
      setU2uTokenContract(u2uToken);
      setFluxTokenContract(fluxToken);
    }
  }, [signer, CONTRACT_ADDRESS, U2U_TOKEN_ADDRESS, FLUX_TOKEN_ADDRESS]);

  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
    // Handle disconnection
          const disconnect = () => {
              setIsConnected(false);
              setAddress(null);
              setBalance('0');
              setSigner(null);
              setProvider(null);
              setU2uBalance('0');
              setFluxBalance('0');
              setFluxBandContract(null);
              setU2uTokenContract(null);
              setFluxTokenContract(null);
              setError(null);
            };


      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const userAddress = await web3Signer.getAddress();
      
      // Get balance
      const userBalance = await web3Provider.getBalance(userAddress);
      
      setProvider(web3Provider);
      setSigner(web3Signer);
      setAddress(userAddress);
      setBalance(ethers.formatEther(userBalance));
      setIsConnected(true);
      
      // Switch to U2U network if needed
      await switchToU2UNetwork();
      
      // Refresh token balances
      await refreshBalances();
      
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to U2U Network
  const switchToU2UNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: U2U_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [U2U_TESTNET_CONFIG],
          });
        } catch (addError) {
          console.error('Failed to add U2U network:', addError);
        }
      }
    }
  };

  // Refresh token balances
  const refreshBalances = async () => {
    if (!address || !u2uTokenContract || !fluxTokenContract) return;

    try {
      const [u2uBal, fluxBal] = await Promise.all([
        u2uTokenContract.balanceOf(address),
        fluxTokenContract.balanceOf(address)
      ]);
      
      setU2uBalance(ethers.formatEther(u2uBal));
      setFluxBalance(ethers.formatEther(fluxBal));
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  // Smart contract functions
  const getUserProfile = async () => {
    if (!fluxBandContract || !address) throw new Error('Contract not initialized');
    
    try {
      const profile = await fluxBandContract.getUserProfile(address);
      return {
        username: profile.username,
        bio: profile.bio,
        avatar: profile.avatar,
        level: Number(profile.level),
        totalXP: Number(profile.totalXP),
        joinTimestamp: Number(profile.joinTimestamp),
        totalEarnings: ethers.formatEther(profile.totalEarnings),
        totalTests: Number(profile.totalTests),
        successfulTests: Number(profile.successfulTests),
        referralCount: Number(profile.referralCount),
        verified: profile.verified,
        globalRank: Number(profile.globalRank),
        monthlyRank: Number(profile.monthlyRank)
      };
    } catch (error: any) {
      console.error('Failed to get user profile:', error);
      throw new Error(error.message || 'Failed to get user profile');
    }
  };

  const submitBandwidthTest = async (uploadSpeed: number, downloadSpeed: number, latency: number) => {
    if (!fluxBandContract) throw new Error('Contract not initialized');
    
    try {
      // Generate unique proof hash
      const proofData = `${address}-${uploadSpeed}-${downloadSpeed}-${latency}-${Date.now()}`;
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes(proofData));
      
      const tx = await fluxBandContract.submitBandwidthTest(uploadSpeed, downloadSpeed, latency, proofHash);
      await tx.wait();
      
      await refreshBalances(); // Refresh balances after test
      return tx.hash;
    } catch (error: any) {
      console.error('Failed to submit bandwidth test:', error);
      throw new Error(error.message || 'Failed to submit bandwidth test');
    }
  };

  const generateReferralCode = async (code: string) => {
    if (!fluxBandContract) throw new Error('Contract not initialized');
    
    try {
      const tx = await fluxBandContract.generateReferralCode(code);
      await tx.wait();
    } catch (error: any) {
      console.error('Failed to generate referral code:', error);
      throw new Error(error.message || 'Failed to generate referral code');
    }
  };

  const joinWithReferral = async (code: string) => {
    if (!fluxBandContract) throw new Error('Contract not initialized');
    
    try {
      const tx = await fluxBandContract.joinWithReferral(code);
      await tx.wait();
    } catch (error: any) {
      console.error('Failed to join with referral:', error);
      throw new Error(error.message || 'Failed to join with referral');
    }
  };

  const stakeTokens = async (amount: string) => {
    if (!fluxBandContract || !u2uTokenContract) throw new Error('Contract not initialized');
    
    try {
      const amountWei = ethers.parseEther(amount);
      
      // First approve the FluxBand contract to spend tokens
      const approveTx = await u2uTokenContract.approve(CONTRACT_ADDRESS, amountWei);
      await approveTx.wait();
      
      // Then stake the tokens
      const stakeTx = await fluxBandContract.stakeTokens(amountWei);
      await stakeTx.wait();
      
      await refreshBalances(); // Refresh balances after staking
    } catch (error: any) {
      console.error('Failed to stake tokens:', error);
      throw new Error(error.message || 'Failed to stake tokens');
    }
  };

  const claimAllRewards = async () => {
    if (!fluxBandContract) throw new Error('Contract not initialized');
    
    try {
      const tx = await fluxBandContract.claimAllRewards();
      await tx.wait();
      
      await refreshBalances(); // Refresh balances after claiming
    } catch (error: any) {
      console.error('Failed to claim rewards:', error);
      throw new Error(error.message || 'Failed to claim rewards');
    }
  };

  const registerNode = async (name: string, location: string, ipAddress: string) => {
    if (!fluxBandContract) throw new Error('Contract not initialized');
    
    try {
      const tx = await fluxBandContract.registerNode(name, location, ipAddress);
      await tx.wait();
    } catch (error: any) {
      console.error('Failed to register node:', error);
      throw new Error(error.message || 'Failed to register node');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance('0');
    setSigner(null);
    setProvider(null);
    setU2uBalance('0');
    setFluxBalance('0');
    setFluxBandContract(null);
    setU2uTokenContract(null);
    setFluxTokenContract(null);
    setError(null);
  };

  // Auto-refresh balances every 30 seconds
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(refreshBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, u2uTokenContract, fluxTokenContract, address]);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== address) {
          connectWallet(); // Reconnect with new account
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, [address]);

  const value: WalletContextType = {
    wallet,
    
    // Wallet State
    isConnected,
    address,
    balance,
    signer,
    provider,
    
    // Token Balances
    u2uBalance,
    fluxBalance,
    
    // Smart Contract Integration
    fluxBandContract,
    u2uTokenContract,
    fluxTokenContract,
    
    // Contract Functions
    getUserProfile,
    submitBandwidthTest,
    generateReferralCode,
    joinWithReferral,
    stakeTokens,
    claimAllRewards,
    registerNode,
    
    // Utility Functions
    connectWallet,
    disconnectWallet,
    switchToU2UNetwork,
    refreshBalances,
    disconnect() {},
    // Loading States
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};