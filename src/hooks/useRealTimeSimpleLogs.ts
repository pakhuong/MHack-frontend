import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  generateBurstSimpleLogs,
  generateRandomSimpleLog,
} from '../services/mockData';
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

export function useRealTimeSimpleLogs(options?: {
  initialBurst?: number;
  intervalMs?: number;
}) {
  const { initialBurst = 50, intervalMs = 1200 } = options ?? {};
  const [logs, setLogs] = useState<SimpleLogEntry[]>(() =>
    generateBurstSimpleLogs(initialBurst)
  );
  const [isPaused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // start timer
    timerRef.current = window.setInterval(() => {
      if (isPaused) return;
      // Generate 1-3 logs randomly for more activity
      const count = Math.floor(Math.random() * 3) + 1;
      const newLogs = Array.from({ length: count }, () =>
        generateRandomSimpleLog()
      );
      setLogs((prev) => [...prev, ...newLogs].slice(-5000)); // cap to 5k lines
    }, intervalMs);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [intervalMs, isPaused]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);
  const clear = useCallback(() => setLogs([]), []);

  const controls: LogStreamControls = { pause, resume, clear, isPaused };

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
          let re: RegExp | null = null;
          try {
            re = new RegExp(q, 'i');
          } catch {
            // invalid regex -> fallback to substring
            re = null;
          }
          if (re) {
            result = result.filter((l) => re!.test(l.content));
          } else {
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

  return {
    logs,
    controls,
    filterLogs,
    latestTimestamp,
  };
}
