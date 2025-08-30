// src/hooks/index.ts

export { useWallet } from './useWallet';
export { useApi } from './useApi';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useInterval } from './useInterval';
export { useWebSocket } from './useWebSocket';
export { useNotifications } from './useNotifications';
export { useAnalytics } from './useAnalytics';
export { useForm } from './useForm';
export { useModal } from './useModal';
export { useTheme } from './useTheme';
export { useGeolocation } from './useGeolocation';
export { useBandwidthTest } from './useBandwidthTest';
export { useNetworkStats } from './useNetworkStats';
export { useRewards } from './useRewards';
export { useReferrals } from './useReferrals';

// Re-export types
export type * from '../types';