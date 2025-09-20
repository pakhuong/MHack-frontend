import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { generateBurstLogs, generateRandomLog } from '../services/mockData';
import type {
  LogEntry,
  LogLevel,
  ServiceName,
  TimeRange,
} from '../types/observability';

export interface LogStreamControls {
  pause: () => void;
  resume: () => void;
  clear: () => void;
  isPaused: boolean;
}

export interface LogFilters {
  services?: ServiceName[];
  levels?: LogLevel[];
  text?: string;
  regex?: boolean;
  timeRange?: TimeRange;
}

export function useRealTimeLogs(options?: {
  initialBurst?: number;
  intervalMs?: number;
}) {
  const { initialBurst = 50, intervalMs = 1200 } = options ?? {};
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    generateBurstLogs(initialBurst)
  );
  const [isPaused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // start timer
    timerRef.current = window.setInterval(() => {
      if (isPaused) return;
      // Generate 1-3 logs randomly for more activity
      const count = Math.floor(Math.random() * 3) + 1;
      const newLogs = Array.from({ length: count }, () => generateRandomLog());
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
    (filters?: LogFilters) => {
      if (!filters) return logs;
      const { services, levels, text, regex, timeRange } = filters;

      let result = logs;

      if (timeRange?.from || timeRange?.to) {
        result = result.filter((l) => {
          const t = dayjs(l.timestamp);
          if (timeRange.from && t.isBefore(dayjs(timeRange.from))) return false;
          if (timeRange.to && t.isAfter(dayjs(timeRange.to))) return false;
          return true;
        });
      }

      if (services && services.length) {
        const set = new Set(services);
        result = result.filter((l) => set.has(l.serviceName as ServiceName));
      }

      if (levels && levels.length) {
        const set = new Set(levels);
        result = result.filter((l) => set.has(l.level));
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
            result = result.filter((l) => {
              const ctx = JSON.stringify(l.context ?? {});
              return (
                re!.test(l.message) ||
                re!.test(l.serviceName) ||
                re!.test(l.level) ||
                re!.test(ctx)
              );
            });
          } else {
            result = result.filter((l) => {
              const ctx = JSON.stringify(l.context ?? {});
              return (
                l.message.toLowerCase().includes(q.toLowerCase()) ||
                l.serviceName.toLowerCase().includes(q.toLowerCase()) ||
                l.level.toLowerCase().includes(q.toLowerCase()) ||
                ctx.toLowerCase().includes(q.toLowerCase())
              );
            });
          }
        } else {
          result = result.filter((l) => {
            const ctx = JSON.stringify(l.context ?? {});
            return (
              l.message.toLowerCase().includes(q.toLowerCase()) ||
              l.serviceName.toLowerCase().includes(q.toLowerCase()) ||
              l.level.toLowerCase().includes(q.toLowerCase()) ||
              ctx.toLowerCase().includes(q.toLowerCase())
            );
          });
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
