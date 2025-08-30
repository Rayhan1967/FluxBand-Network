import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: string | null;
  sendMessage: (message: string) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export function useWebSocket(
  url: string, 
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const { reconnectAttempts = 5, reconnectInterval = 3000 } = options;

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      setConnectionStatus('connecting');
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectCount.current = 0;
      };

      ws.current.onmessage = (event) => {
        setLastMessage(event.data);
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Auto reconnect
        if (reconnectCount.current < reconnectAttempts) {
          setTimeout(() => {
            reconnectCount.current += 1;
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = () => {
        setConnectionStatus('error');
        setIsConnected(false);
      };
    } catch (error) {
      setConnectionStatus('error');
      console.error('WebSocket connection error:', error);
    }
  }, [url, reconnectAttempts, reconnectInterval]);

  const sendMessage = useCallback((message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connectionStatus,
  };
}
