import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { DEFAULT_SERVICES } from '../types/observability';
import type { HealthMetricsSeries, ServiceName } from '../types/observability';
import {
  OBS_DEFAULT_WINDOW_MINUTES,
  OBS_METRIC_STEP_SECONDS,
  advanceMetricsSeries,
  initMetricsSeries,
} from '../services/mockData';

export interface UseRealTimeMetricsOptions {
  services?: ServiceName[];
  windowMinutes?: number;
  stepSeconds?: number;
  intervalMs?: number; // default: stepSeconds * 1000
}

export interface MetricsControls {
  setWindowMinutes: (minutes: number) => void;
  resetSeries: () => void;
}

type SeriesByService = Record<ServiceName, HealthMetricsSeries>;

export function useRealTimeMetrics(options?: UseRealTimeMetricsOptions): {
  seriesByService: SeriesByService;
  services: ServiceName[];
  latestTimestamp: string | null;
  windowMinutes: number;
  stepSeconds: number;
  controls: MetricsControls;
} {
  const services = (options?.services ?? [
    ...DEFAULT_SERVICES,
  ]) as ServiceName[];
  const [windowMinutes, setWindowMinutes] = useState<number>(
    options?.windowMinutes ?? OBS_DEFAULT_WINDOW_MINUTES
  );
  const stepSeconds = options?.stepSeconds ?? OBS_METRIC_STEP_SECONDS;
  const intervalMs = options?.intervalMs ?? stepSeconds * 1000;

  const buildInitial = useCallback((): SeriesByService => {
    const obj = {} as Partial<SeriesByService>;
    for (const s of services) {
      obj[s] = initMetricsSeries(s, windowMinutes, stepSeconds);
    }
    return obj as SeriesByService;
  }, [services, windowMinutes, stepSeconds]);

  const [seriesByService, setSeriesByService] =
    useState<SeriesByService>(buildInitial);
  const timerRef = useRef<number | null>(null);

  // Advance series on interval
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSeriesByService((prev) => {
        const next: Partial<SeriesByService> = {};
        for (const s of services) {
          next[s] = advanceMetricsSeries(prev[s], stepSeconds);
        }
        return next as SeriesByService;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [intervalMs, services, stepSeconds]);

  // Rebuild when windowMinutes changes
  useEffect(() => {
    setSeriesByService(buildInitial());
  }, [buildInitial]);

  const latestTimestamp = useMemo(() => {
    let latest: string | null = null;
    for (const s of services) {
      const pts = seriesByService[s]?.points ?? [];
      if (pts.length) {
        const ts = pts[pts.length - 1].timestamp;
        if (!latest || dayjs(ts).isAfter(dayjs(latest))) {
          latest = ts;
        }
      }
    }
    return latest;
  }, [seriesByService, services]);

  const controls: MetricsControls = {
    setWindowMinutes: (m: number) => setWindowMinutes(m),
    resetSeries: () => setSeriesByService(buildInitial()),
  };

  return {
    seriesByService,
    services,
    latestTimestamp,
    windowMinutes,
    stepSeconds,
    controls,
  };
}
