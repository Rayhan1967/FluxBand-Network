// src/lib/constants.ts

// Network Configuration
export const NETWORK_CONFIG = {
  U2U_TESTNET: {
    chainId: 2484,
    chainName: 'U2U Testnet',
    rpcUrl: 'https://rpc-nebulas-testnet.uniultra.xyz',
    explorerUrl: 'https://testnet-explorer.uniultra.xyz',
    currency: {
      name: 'U2U',
      symbol: 'U2U',
      decimals: 18,
    },
  },
  U2U_MAINNET: {
    chainId: 39,
    chainName: 'U2U Network',
    rpcUrl: 'https://rpc-mainnet.uniultra.xyz',
    explorerUrl: 'https://explorer.uniultra.xyz',
    currency: {
      name: 'U2U',
      symbol: 'U2U',
      decimals: 18,
    },
  },
};

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  [NETWORK_CONFIG.U2U_TESTNET.chainId]: {
    BANDWIDTH_VALIDATOR: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x123722F0072126E1FD9f203b87AE8CCDfeec1aca',
    TOKEN: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
    GOVERNANCE: process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS || '0x0000000000000000000000000000000000000000',
  },
  [NETWORK_CONFIG.U2U_MAINNET.chainId]: {
    BANDWIDTH_VALIDATOR: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS || '',
    TOKEN: process.env.NEXT_PUBLIC_MAINNET_TOKEN_ADDRESS || '',
    GOVERNANCE: process.env.NEXT_PUBLIC_MAINNET_GOVERNANCE_ADDRESS || '',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  WEBSOCKET_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  USER: '/user',
  BANDWIDTH: '/bandwidth',
  NODES: '/nodes',
  REWARDS: '/rewards',
  REFERRALS: '/referrals',
  NETWORK: '/network',
  NOTIFICATIONS: '/notifications',
  ANALYTICS: '/analytics',
};

// Application Configuration
export const APP_CONFIG = {
  NAME: 'FluxBand Network',
  DESCRIPTION: 'Decentralized Physical Infrastructure Network for Bandwidth Validation',
  VERSION: '1.0.0',
  AUTHOR: 'FluxBand Team',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'https://fluxband.network',
  LOGO_URL: '/logo.png',
  FAVICON_URL: '/favicon.ico',
  THEME_COLOR: '#14b8a6',
  BACKGROUND_COLOR: '#0f172a',
};

// Feature Flags
export const FEATURES = {
  REFERRAL_SYSTEM: true,
  ANALYTICS: true,
  NOTIFICATIONS: true,
  GEOLOCATION: true,
  DARK_MODE: true,
  MULTILINGUAL: false,
  BETA_FEATURES: process.env.NODE_ENV === 'development',
  MAINTENANCE_MODE: false,
};

// Business Logic Constants
export const BUSINESS_RULES = {
  MIN_STAKE_AMOUNT: '50', // in tokens
  BASE_REWARD_AMOUNT: '1', // in tokens
  REFERRAL_BONUS_PERCENTAGE: 10,
  REFERRAL_REWARD_AMOUNT: 20, // in points
  MIN_BANDWIDTH_SPEED: 1, // Mbps
  MAX_BANDWIDTH_SPEED: 1000, // Mbps
  MIN_LATENCY: 1, // ms
  MAX_LATENCY: 1000, // ms
  MIN_UPTIME_PERCENTAGE: 50,
  MAX_UPTIME_PERCENTAGE: 100,
  TEST_COOLDOWN_MINUTES: 5,
  REWARD_CLAIM_COOLDOWN_HOURS: 24,
  MAX_NODES_PER_USER: 10,
  MIN_NODE_UPTIME_DAYS: 1,
};

// User Level System
export const USER_LEVELS = {
  BRONZE: {
    name: 'Bronze',
    minXP: 0,
    maxXP: 8000,
    boost: 0,
    color: '#cd7f32',
    benefits: ['Basic bandwidth testing', 'Standard rewards'],
  },
  SILVER: {
    name: 'Silver',
    minXP: 8000,
    maxXP: 20000,
    boost: 5,
    color: '#c0c0c0',
    benefits: ['5% bonus rewards', 'Priority support', 'Advanced analytics'],
  },
  GOLD: {
    name: 'Gold',
    minXP: 20000,
    maxXP: 50000,
    boost: 10,
    color: '#ffd700',
    benefits: ['10% bonus rewards', 'VIP support', 'Early feature access'],
  },
  PLATINUM: {
    name: 'Platinum',
    minXP: 50000,
    maxXP: 100000,
    boost: 15,
    color: '#e5e4e2',
    benefits: ['15% bonus rewards', 'Governance voting', 'Exclusive events'],
  },
  DIAMOND: {
    name: 'Diamond',
    minXP: 100000,
    maxXP: Infinity,
    boost: 25,
    color: '#b9f2ff',
    benefits: ['25% bonus rewards', 'Network governance', 'Revenue sharing'],
  },
};

// Node Types
export const NODE_TYPES = {
  VALIDATOR: {
    name: 'Validator',
    description: 'Validates bandwidth tests and network consensus',
    icon: '🔍',
    minStake: '100',
    expectedReward: '5-15',
  },
  STORAGE: {
    name: 'Storage',
    description: 'Provides decentralized storage capacity',
    icon: '💾',
    minStake: '50',
    expectedReward: '3-10',
  },
  COMPUTE: {
    name: 'Compute',
    description: 'Offers computational resources for network',
    icon: '⚡',
    minStake: '75',
    expectedReward: '4-12',
  },
  RELAY: {
    name: 'Relay',
    description: 'Relays network traffic and improves connectivity',
    icon: '📡',
    minStake: '25',
    expectedReward: '2-8',
  },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  REWARD: 'reward',
  SYSTEM: 'system',
  REFERRAL: 'referral',
  NODE: 'node',
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fluxband_auth_token',
  USER_PREFERENCES: 'fluxband_user_preferences',
  WALLET_ADDRESS: 'fluxband_wallet_address',
  THEME: 'fluxband_theme',
  LANGUAGE: 'fluxband_language',
  ONBOARDING_COMPLETED: 'fluxband_onboarding_completed',
  LAST_TEST_TIMESTAMP: 'fluxband_last_test_timestamp',
  CACHED_USER_DATA: 'fluxband_cached_user_data',
  REFERRAL_CODE: 'fluxband_referral_code',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  NETWORK_ERROR: 'Network error. Please check your connection',
  TRANSACTION_FAILED: 'Transaction failed. Please try again',
  INVALID_INPUT: 'Invalid input provided',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait and try again',
  MAINTENANCE_MODE: 'The service is currently under maintenance',
  FEATURE_NOT_AVAILABLE: 'This feature is not available yet',
  INVALID_NODE_ID: 'Invalid node ID provided',
  TEST_COOLDOWN_ACTIVE: 'Please wait before running another test',
  REWARDS_NOT_AVAILABLE: 'No rewards available to claim',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  TRANSACTION_SUCCESSFUL: 'Transaction completed successfully',
  TEST_COMPLETED: 'Bandwidth test completed successfully',
  REWARDS_CLAIMED: 'Rewards claimed successfully',
  NODE_REGISTERED: 'Node registered successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  REFERRAL_SENT: 'Referral invitation sent successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  NODE_NAME: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s_-]+$/,
  },
  WALLET_ADDRESS: {
    pattern: /^0x[a-fA-F0-9]{40}$/,
  },
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/fluxbandnetwork',
  DISCORD: 'https://discord.gg/fluxband',
  TELEGRAM: 'https://t.me/fluxbandnetwork',
  GITHUB: 'https://github.com/fluxband-network',
  MEDIUM: 'https://medium.com/@fluxbandnetwork',
  DOCS: 'https://docs.fluxband.network',
} as const;

// Default Values
export const DEFAULTS = {
  PAGINATION_LIMIT: 20,
  CHART_REFRESH_INTERVAL: 30000, // 30 seconds
  NOTIFICATION_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  WEBSOCKET_RECONNECT_DELAY: 5000, // 5 seconds
  CACHE_DURATION: 300000, // 5 minutes
} as const;