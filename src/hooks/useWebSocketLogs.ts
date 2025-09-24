import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  generateBurstSimpleLogs,
  generateRandomSimpleLog,
} from '../services/mockData';
import websocketService, {
  type WebSocketConnectionState,
} from '../services/websocketService';
import type { SimpleLogEntry, TimeRange } from '../types/observability';

export interface LogStreamControls {
  pause: () => void;
  resume: () => void;
  clear: () => void;
  isPaused: boolean;
}

export interface SimpleLogFilters {
  text?: string;
  regex?: boolean;
  timeRange?: TimeRange;
}

export interface WebSocketLogStreamOptions {
  initialBurst?: number;
  intervalMs?: number; // interval generate log
  serverUrl?: string;
  autoConnect?: boolean;
}

export function useWebSocketLogs(options?: WebSocketLogStreamOptions) {
  const {
    initialBurst = 50,
    intervalMs = 2000, // generate log mỗi 2s
    serverUrl = 'ws://localhost:3000',
    autoConnect = true,
  } = options ?? {};

  const [logs, setLogs] = useState<SimpleLogEntry[]>(() =>
    generateBurstSimpleLogs(initialBurst)
  );
  const [isPaused, setPaused] = useState(false);
  const [connectionState, setConnectionState] =
    useState<WebSocketConnectionState>(() =>
      websocketService.getConnectionState()
    );

  const timerRef = useRef<number | null>(null);
  const bufferRef = useRef<SimpleLogEntry[]>([]); // buffer để gom log

  // WebSocket connection
  useEffect(() => {
    if (autoConnect) {
      websocketService.connect(serverUrl);
    }
    const unsubscribe =
      websocketService.onConnectionStateChange(setConnectionState);
    return () => {
      unsubscribe();
      if (!autoConnect) {
        websocketService.disconnect();
      }
    };
  }, [serverUrl, autoConnect]);

  // Send initial burst logs ngay sau khi connect
  useEffect(() => {
    if (connectionState.isConnected && logs.length > 0) {
      websocketService.sendLogList?.(logs); // BE cần hỗ trợ bulk
      bufferRef.current = [];
    }
  }, [connectionState.isConnected]);

  // Generate log mỗi interval (ví dụ 2s), chỉ add vào buffer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      if (isPaused) return;

      const count = Math.floor(Math.random() * 3) + 1;
      const newLogs = Array.from({ length: count }, () =>
        generateRandomSimpleLog()
      );

      // Thêm vào buffer chờ flush
      bufferRef.current.push(...newLogs);

      // Update local state (UI hiển thị realtime)
      setLogs((prev) => [...prev, ...newLogs].slice(-5000));
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [intervalMs, isPaused]);

  // Flush buffer mỗi 30s
  useEffect(() => {
    const flushTimer = window.setInterval(() => {
      if (connectionState.isConnected && bufferRef.current.length > 0) {
        websocketService.sendLogList?.(bufferRef.current);
        bufferRef.current = [];
      }
    }, 60000);

    return () => clearInterval(flushTimer);
  }, [connectionState.isConnected]);

  // Controls
  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);
  const clear = useCallback(() => {
    setLogs([]);
    bufferRef.current = [];
  }, []);
  const controls: LogStreamControls = { pause, resume, clear, isPaused };

  // Filtering
  const filterLogs = useCallback(
    (filters?: SimpleLogFilters) => {
      if (!filters) return logs;
      const { text, regex, timeRange } = filters;

      let result = logs;

      if (timeRange?.from || timeRange?.to) {
        result = result.filter((l) => {
          const t = dayjs(l.timestamp);
          if (timeRange.from && t.isBefore(dayjs(timeRange.from))) return false;
          if (timeRange.to && t.isAfter(dayjs(timeRange.to))) return false;
          return true;
        });
      }

      if (text && text.trim().length > 0) {
        const q = text.trim();
        if (regex) {
          try {
            const re = new RegExp(q, 'i');
            result = result.filter((l) => re.test(l.content));
          } catch {
            result = result.filter((l) =>
              l.content.toLowerCase().includes(q.toLowerCase())
            );
          }
        } else {
          result = result.filter((l) =>
            l.content.toLowerCase().includes(q.toLowerCase())
          );
        }
      }

      return result;
    },
    [logs]
  );

  const latestTimestamp = useMemo(
    () => (logs.length ? logs[logs.length - 1].timestamp : null),
    [logs]
  );

  // reconnect/disconnect
  const reconnect = useCallback(() => {
    websocketService.disconnect();
    setTimeout(() => {
      websocketService.connect(serverUrl);
    }, 1000);
  }, [serverUrl]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  const incidentTemplates: SimpleLogEntry[][] = [
    [
      {
        id: `incident_${Date.now()}_1`,
        timestamp: new Date().toISOString(),
        content: 'INCIDENT: Database connection timeout detected',
      },
      {
        id: `incident_${Date.now()}_2`,
        timestamp: new Date().toISOString(),
        content: 'ERROR: Query execution exceeded 30s timeout',
      },
      {
        id: `incident_${Date.now()}_3`,
        timestamp: new Date().toISOString(),
        content: 'ERROR: Service API-Gateway failed to fetch user data',
      },
    ],
    [
      {
        id: `incident_${Date.now()}_1`,
        timestamp: new Date().toISOString(),
        content: 'ERROR: Memory usage exceeded 95% on node-7',
      },
      {
        id: `incident_${Date.now()}_2`,
        timestamp: new Date().toISOString(),
        content: 'WARN: GC overhead limit reached, application slowdown',
      },
      {
        id: `incident_${Date.now()}_3`,
        timestamp: new Date().toISOString(),
        content: 'ERROR: Node-7 marked unhealthy, removing from load balancer',
      },
    ],
    [
      {
        id: `incident_${Date.now()}_1`,
        timestamp: new Date().toISOString(),
        content: 'ERROR: Unauthorized access attempt detected',
      },
      {
        id: `incident_${Date.now()}_2`,
        timestamp: new Date().toISOString(),
        content: 'WARN: Multiple failed login attempts from IP 192.168.10.45',
      },
      {
        id: `incident_${Date.now()}_3`,
        timestamp: new Date().toISOString(),
        content: 'ALERT: Account locked due to suspicious activity',
      },
    ],
  ];

  const generateIncidentLog = useCallback(() => {
    const idx = Math.floor(Math.random() * incidentTemplates.length);
    const incidentLogs = incidentTemplates[idx].map((l) => ({
      ...l,
      id: `${l.id}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    }));

    // 👇 thêm incident vào buffer
    bufferRef.current.push(...incidentLogs);

    // và update local state để UI thấy ngay
    setLogs((prev) => [...prev, ...incidentLogs].slice(-5000));
  }, []);

  return {
    logs,
    controls,
    filterLogs,
    latestTimestamp,
    connectionState,
    reconnect,
    disconnect,
    generateIncidentLog,
  };
}
