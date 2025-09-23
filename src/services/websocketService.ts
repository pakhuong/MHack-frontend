import { io, Socket } from 'socket.io-client';
import type { SimpleLogEntry } from '../types/observability';

export interface WebSocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

class WebSocketService {
  private socket: Socket | null = null;
  private connectionState: WebSocketConnectionState = {
    isConnected: false,
    isConnecting: false,
    error: null,
  };
  private connectionStateCallbacks: ((
    state: WebSocketConnectionState
  ) => void)[] = [];

  connect(serverUrl = 'ws://localhost:3000') {
    if (this.socket?.connected) {
      return;
    }

    this.updateConnectionState({
      isConnected: false,
      isConnecting: true,
      error: null,
    });

    try {
      this.socket = io(`${serverUrl}/ws/log-metrics`, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected to log-metrics namespace');
        this.updateConnectionState({
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        this.updateConnectionState({
          isConnected: false,
          isConnecting: false,
          error: `Disconnected: ${reason}`,
        });
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.updateConnectionState({
          isConnected: false,
          isConnecting: false,
          error: `Connection failed: ${error.message}`,
        });
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('WebSocket reconnected after', attemptNumber, 'attempts');
        this.updateConnectionState({
          isConnected: true,
          isConnecting: false,
          error: null,
        });
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('WebSocket reconnection error:', error);
        this.updateConnectionState({
          isConnected: false,
          isConnecting: false,
          error: `Reconnection failed: ${error.message}`,
        });
      });
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.updateConnectionState({
        isConnected: false,
        isConnecting: false,
        error: `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.updateConnectionState({
        isConnected: false,
        isConnecting: false,
        error: null,
      });
    }
  }

  sendLog(log: SimpleLogEntry) {
    if (this.socket?.connected) {
      this.socket.emit('sendLog', log);
    } else {
      console.warn('Cannot send log: WebSocket not connected');
    }
  }

  sendMetric(metric: Record<string, unknown>) {
    if (this.socket?.connected) {
      this.socket.emit('sendMetric', metric);
    } else {
      console.warn('Cannot send metric: WebSocket not connected');
    }
  }

  getConnectionState(): WebSocketConnectionState {
    return { ...this.connectionState };
  }

  onConnectionStateChange(callback: (state: WebSocketConnectionState) => void) {
    this.connectionStateCallbacks.push(callback);

    // Return cleanup function
    return () => {
      const index = this.connectionStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionStateCallbacks.splice(index, 1);
      }
    };
  }

  private updateConnectionState(newState: WebSocketConnectionState) {
    this.connectionState = { ...newState };
    this.connectionStateCallbacks.forEach((callback) =>
      callback(this.connectionState)
    );
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();
export default websocketService;
