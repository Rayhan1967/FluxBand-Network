// src/components/common/ErrorBoundary.tsx

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorProps } from '../../types';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error || new Error('Unknown error')}
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<ErrorProps> = ({ error, retry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
      <p className="text-slate-400 mb-6 max-w-md">
        {typeof error === 'string' ? error : error.message}
      </p>
      <div className="space-y-4">
        {retry && (
          <button
            onClick={retry}
            className="btn-primary px-6 py-3"
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="block px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;

// Loading Components
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]} ${className}`} />
  );
};

export const LoadingOverlay: React.FC<{ loading: boolean; children: ReactNode }> = ({ 
  loading, 
  children 
}) => {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="text-white font-medium mt-4">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const SkeletonLoader: React.FC<{ 
  lines?: number; 
  className?: string;
  avatar?: boolean;
}> = ({ 
  lines = 3, 
  className = '',
  avatar = false
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="w-12 h-12 bg-slate-700 rounded-full mb-4"></div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={`h-4 bg-slate-700 rounded mb-3 ${
            i === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ icon = '📭', title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-slate-300 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-400 mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary px-6 py-3"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};