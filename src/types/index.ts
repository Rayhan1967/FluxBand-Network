// src/types/index.ts

export interface User {
  id: string;
  address: string;
  username?: string;
  email?: string;
  avatar?: string;
  level: UserLevel;
  stats: UserStats;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLevel {
  current: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  currentXP: number;
  requiredXP: number;
  boost: number;
  benefits: string[];
}

export interface UserStats {
  totalPoints: number;
  todayPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  referralCount: number;
  testsCompleted: number;
  uptime: number;
  streak: number;
  rank: number;
  totalEarnings: number;
  pendingRewards: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    rewards: boolean;
    system: boolean;
  };
  privacy: {
    showProfile: boolean;
    showStats: boolean;
    showRank: boolean;
  };
}

export interface BandwidthTest {
  id: string;
  nodeId: string;
  userId: string;
  uploadSpeed: number;
  downloadSpeed: number;
  latency: number;
  uptime: number;
  timestamp: Date;
  proofHash: string;
  status: 'pending' | 'validated' | 'failed';
  rewards: number;
  location?: GeolocationCoordinates;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'validator' | 'storage' | 'compute' | 'relay';
  owner: string;
  status: NodeStatus;
  location: NodeLocation;
  performance: NodePerformance;
  hardware: HardwareSpec;
  earnings: NodeEarnings;
  createdAt: Date;
  lastSeen: Date;
}

export interface NodeStatus {
  online: boolean;
  health: 'healthy' | 'warning' | 'critical' | 'offline';
  uptime: number;
  version: string;
  synchronizing: boolean;
  connectedPeers: number;
}

export interface NodeLocation {
  country: string;
  region: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
}

export interface NodePerformance {
  bandwidth: {
    upload: number;
    download: number;
  };
  latency: number;
  reliability: number;
  score: number;
  rank: number;
  testsCompleted: number;
  lastTestAt: Date;
}

export interface HardwareSpec {
  cpu: string;
  memory: number;
  storage: number;
  network: string;
  gpu?: string;
  os: string;
}

export interface NodeEarnings {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
  pending: number;
  lastPayout: Date;
}

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  totalBandwidth: string;
  avgLatency: number;
  uptime: number;
  totalTests: number;
  totalRewards: string;
  activeUsers: number;
  coverage: {
    countries: number;
    cities: number;
  };
}

export interface Reward {
  id: string;
  userId: string;
  type: 'bandwidth_test' | 'referral' | 'staking' | 'bonus' | 'achievement';
  amount: number;
  token: string;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
  createdAt: Date;
  claimedAt?: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  code: string;
  status: 'pending' | 'qualified' | 'active' | 'inactive';
  rewards: {
    referrer: number;
    referee: number;
  };
  createdAt: Date;
  qualifiedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  type: 'reward' | 'stake' | 'unstake' | 'claim' | 'transfer';
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: number;
  gasPrice?: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

export interface DashboardData {
  user: User;
  stats: NetworkStats;
  recentTests: BandwidthTest[];
  notifications: Notification[];
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  nodes: NetworkNode[];
}

// Web3 specific types
export interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: any;
  signer: any;
}

export interface ContractConfig {
  address: string;
  abi: any[];
  chainId: number;
}

export interface Web3Config {
  rpcUrl: string;
  chainId: number;
  chainName: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  explorerUrl: string;
  contracts: {
    validator: ContractConfig;
    token: ContractConfig;
    governance: ContractConfig;
  };
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends ComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ErrorProps extends ComponentProps {
  error: Error | string;
  retry?: () => void;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

// Form types
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
  options?: Array<{ value: string; label: string }>;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Event types
export type EventHandler<T = any> = (data: T) => void;

export interface EventBus {
  on: (event: string, handler: EventHandler) => void;
  off: (event: string, handler: EventHandler) => void;
  emit: (event: string, data?: any) => void;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;