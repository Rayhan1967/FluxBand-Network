// src/hooks/useApi.ts

import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, PaginationParams } from '../types';
import { apiClient } from '../lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { immediate = true, onSuccess, onError } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<T>(endpoint);
      setData(response.data || null);
      onSuccess?.(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Specialized hook for paginated data
export function usePaginatedApi<T>(
  endpoint: string,
  params: PaginationParams = {},
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { immediate = true, onSuccess, onError } = options;

  const fetchData = useCallback(async (newParams?: PaginationParams) => {
    setLoading(true);
    setError(null);

    const queryParams = { ...params, ...newParams };

    try {
      const response = await apiClient.get<T[]>(endpoint, { params: queryParams });
      
      if (response.success && response.data) {
        setData(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        onSuccess?.(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, params, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      fetchData({ page: pagination.page + 1 });
    }
  }, [pagination, fetchData]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      fetchData({ page: pagination.page - 1 });
    }
  }, [pagination, fetchData]);

  const goToPage = useCallback((page: number) => {
    fetchData({ page });
  }, [fetchData]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch: fetchData,
    nextPage,
    prevPage,
    goToPage,
  };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: {
    onSuccess?: (data: TData) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(variables);
      if (response.success && response.data) {
        options.onSuccess?.(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Mutation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options]);

  return {
    mutate,
    loading,
    error,
  };
}