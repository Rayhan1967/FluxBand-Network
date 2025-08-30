// src/lib/api.ts

import { ApiResponse, PaginationParams, BandwidthTest, NetworkNode, User, Reward } from '../types';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, params } = config;
    
    const url = this.buildURL(endpoint, params);
    
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken() {
    localStorage.removeItem('auth_token');
  }
}

export const apiClient = new ApiClient();

// Specific API services
export const userService = {
  getProfile: () => apiClient.get<User>('/user/profile'),
  updateProfile: (data: Partial<User>) => apiClient.put<User>('/user/profile', data),
  getStats: () => apiClient.get<User['stats']>('/user/stats'),
  updatePreferences: (preferences: User['preferences']) => 
    apiClient.patch<User>('/user/preferences', preferences),
};

export const bandwidthService = {
  submitTest: (test: Omit<BandwidthTest, 'id' | 'timestamp' | 'status'>) =>
    apiClient.post<BandwidthTest>('/bandwidth/test', test),
  getTests: (params?: PaginationParams) =>
    apiClient.get<BandwidthTest[]>('/bandwidth/tests', { params }),
  getTestById: (id: string) =>
    apiClient.get<BandwidthTest>(`/bandwidth/tests/${id}`),
  getNodeTests: (nodeId: string, params?: PaginationParams) =>
    apiClient.get<BandwidthTest[]>(`/bandwidth/nodes/${nodeId}/tests`, { params }),
};

export const nodeService = {
  getNodes: (params?: PaginationParams) =>
    apiClient.get<NetworkNode[]>('/nodes', { params }),
  getNodeById: (id: string) =>
    apiClient.get<NetworkNode>(`/nodes/${id}`),
  createNode: (node: Omit<NetworkNode, 'id' | 'createdAt' | 'lastSeen'>) =>
    apiClient.post<NetworkNode>('/nodes', node),
  updateNode: (id: string, updates: Partial<NetworkNode>) =>
    apiClient.patch<NetworkNode>(`/nodes/${id}`, updates),
  deleteNode: (id: string) =>
    apiClient.delete(`/nodes/${id}`),
  getNodeStats: (id: string) =>
    apiClient.get<NetworkNode['performance']>(`/nodes/${id}/stats`),
  getMyNodes: () =>
    apiClient.get<NetworkNode[]>('/nodes/my'),
};

export const rewardService = {
  getRewards: (params?: PaginationParams) =>
    apiClient.get<Reward[]>('/rewards', { params }),
  claimReward: (rewardId: string) =>
    apiClient.post<Reward>(`/rewards/${rewardId}/claim`),
  claimAllRewards: () =>
    apiClient.post<Reward[]>('/rewards/claim-all'),
  getEarnings: () =>
    apiClient.get<{ total: number; pending: number; claimed: number }>('/rewards/earnings'),
};

export const referralService = {
  getReferralCode: () =>
    apiClient.get<{ code: string }>('/referrals/code'),
  generateReferralCode: () =>
    apiClient.post<{ code: string }>('/referrals/generate'),
  getReferrals: (params?: PaginationParams) =>
    apiClient.get<any[]>('/referrals', { params }),
  getReferralStats: () =>
    apiClient.get<{ total: number; qualified: number; earnings: number }>('/referrals/stats'),
  sendInvitation: (email: string) =>
    apiClient.post('/referrals/invite', { email }),
};

export const networkService = {
  getStats: () =>
    apiClient.get<any>('/network/stats'),
  getHealth: () =>
    apiClient.get<{ status: string; uptime: number; services: any[] }>('/network/health'),
  getTopPerformers: (limit?: number) =>
    apiClient.get<any[]>('/network/leaderboard', { params: { limit } }),
  getNetworkMap: () =>
    apiClient.get<any>('/network/map'),
};

export const notificationService = {
  getNotifications: (params?: PaginationParams) =>
    apiClient.get<any[]>('/notifications', { params }),
  markAsRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () =>
    apiClient.patch('/notifications/read-all'),
  deleteNotification: (id: string) =>
    apiClient.delete(`/notifications/${id}`),
  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/notifications/unread-count'),
};

export const analyticsService = {
  track: (event: string, properties?: Record<string, any>) =>
    apiClient.post('/analytics/track', { event, properties }),
  identify: (userId: string, traits?: Record<string, any>) =>
    apiClient.post('/analytics/identify', { userId, traits }),
  page: (name: string, properties?: Record<string, any>) =>
    apiClient.post('/analytics/page', { name, properties }),
};