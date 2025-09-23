import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_SERVICES } from '../types/observability';
import type {
  HealthMetricsPoint,
  HealthMetricsSeries,
  LogEntry,
  LogLevel,
  ServiceName,
  ServiceStatus,
  SimpleLogEntry,
} from '../types/observability';
import { logsSet1, logsSet2, logsSet3 } from './mockLog';

export const LOG_LEVELS: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

const LEVEL_WEIGHTS: Record<LogLevel, number> = {
  DEBUG: 0.35,
  INFO: 0.45,
  WARN: 0.12,
  ERROR: 0.08,
};

function weightedRandomLevel(): LogLevel {
  const r = Math.random();
  let acc = 0;
  for (const level of LOG_LEVELS) {
    acc += LEVEL_WEIGHTS[level];
    if (r <= acc) return level;
  }
  return 'INFO';
}

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildRequestUrl(service: ServiceName): string {
  const base =
    service === 'api-gateway'
      ? '/api'
      : service === 'user-service'
        ? '/users'
        : service === 'payment-service'
          ? '/payments'
          : '/notifications';
  const paths = [
    '/',
    '/list',
    '/detail',
    '/create',
    '/update',
    '/delete',
    '/search',
  ];
  const qs = [`page=${randomInt(1, 5)}`, `limit=${randomInt(10, 50)}`];
  return `${base}${randomFrom(paths)}?${qs.join('&')}`;
}

function generateRandomMessage(service: ServiceName, level: LogLevel): string {
  const msgs = {
    DEBUG: [
      'Entering handler',
      'DB query executed',
      'Cache miss, fetching from DB',
      'Start processing request',
      'Computed derived fields',
    ],
    INFO: [
      'Request completed successfully',
      'Resource created',
      'User authenticated',
      'Payment processed',
      'Notification sent',
    ],
    WARN: [
      'Retrying external API call',
      'Slow response detected',
      'Deprecated endpoint used',
      'High memory usage detected',
      'Circuit breaker half-open',
    ],
    ERROR: [
      'Unhandled exception occurred',
      'Failed to process request',
      'External service timeout',
      'Database connection error',
      'Message queue publish failed',
    ],
  } as const;
  return `${service}: ${randomFrom(msgs[level])}`;
}

function buildContext(service: ServiceName, level: LogLevel) {
  const userId = randomId('user');
  const sessionId = randomId('sess');
  const requestBody =
    service === 'payment-service'
      ? { amount: randomInt(5, 500), currency: 'USD', method: 'card', userId }
      : service === 'user-service'
        ? { name: 'John Doe', email: 'john@example.com' }
        : { query: 'q=test' };
  const response =
    level === 'ERROR'
      ? { status: 500, error: 'Internal Server Error' }
      : { status: 200, result: 'ok' };

  return {
    requestUrl: buildRequestUrl(service),
    requestBody,
    response,
    userId,
    sessionId,
    traceId: uuidv4(),
    spanId: uuidv4().slice(0, 16),
  };
}

export function generateRandomLog(
  service?: ServiceName,
  level?: LogLevel,
  timestampISO?: string
): LogEntry {
  const svc = service ?? randomFrom(DEFAULT_SERVICES);
  const lvl = level ?? weightedRandomLevel();
  const ts = timestampISO ?? dayjs().toISOString();
  return {
    id: uuidv4(),
    timestamp: ts,
    serviceName: svc,
    level: lvl,
    message: generateRandomMessage(svc, lvl),
    context: buildContext(svc, lvl),
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function nextValue(
  prev: number,
  volatility: number,
  spikeChance = 0.03,
  spikeMagnitude = 20
) {
  let delta = (Math.random() - 0.5) * volatility;
  if (Math.random() < spikeChance) {
    delta += (Math.random() < 0.5 ? -1 : 1) * spikeMagnitude;
  }
  return clamp(prev + delta, 0, 100);
}

export function computeStatus(point: HealthMetricsPoint): ServiceStatus {
  if (point.errorRate > 10 || point.responseTime > 1000 || point.cpuUsage > 95)
    return 'critical';
  if (point.errorRate > 3 || point.responseTime > 500 || point.cpuUsage > 85)
    return 'warning';
  return 'healthy';
}

export function initMetricsSeries(
  service: ServiceName,
  windowMinutes = 15,
  stepSeconds = 30
): HealthMetricsSeries {
  const points: HealthMetricsPoint[] = [];
  const now = dayjs();
  const steps = Math.floor((windowMinutes * 60) / stepSeconds);

  // Seed values per service to diversify
  let cpu = 30 + Math.random() * 20;
  let mem = 40 + Math.random() * 20;
  let rt = 120 + Math.random() * 80; // ms
  let err = Math.random() * 2;
  let rps = 50 + Math.random() * 100; // requests per second

  for (let i = steps - 1; i >= 0; i--) {
    const t = now.subtract(i * stepSeconds, 'second').toISOString();
    cpu = nextValue(cpu, 8, 0.02, 10);
    mem = nextValue(mem, 5, 0.01, 8);
    rt = clamp(rt + (Math.random() - 0.5) * 40, 50, 2000);
    err = clamp(err + (Math.random() - 0.5) * 0.8, 0, 100);
    rps = clamp(rps + (Math.random() - 0.5) * 20, 0, 500);

    points.push({
      timestamp: t,
      cpuUsage: Math.round(cpu * 10) / 10,
      memoryUsage: Math.round(mem * 10) / 10,
      responseTime: Math.round(rt),
      errorRate: Math.round(err * 10) / 10,
      requestsPerSecond: Math.round(rps * 10) / 10,
    });
  }

  const last = points[points.length - 1];
  return {
    serviceName: service,
    points,
    status: computeStatus(last),
  };
}

export function advanceMetricsSeries(
  series: HealthMetricsSeries,
  stepSeconds = 30,
  nowISO?: string
): HealthMetricsSeries {
  const last = series.points[series.points.length - 1];
  const nextTs =
    nowISO ?? dayjs(last.timestamp).add(stepSeconds, 'second').toISOString();

  const nextPoint: HealthMetricsPoint = {
    timestamp: nextTs,
    cpuUsage: nextValue(last.cpuUsage, 8, 0.02, 12),
    memoryUsage: nextValue(last.memoryUsage, 5, 0.01, 8),
    responseTime: clamp(
      last.responseTime + (Math.random() - 0.5) * 60,
      50,
      2500
    ),
    errorRate: clamp(last.errorRate + (Math.random() - 0.5) * 1.2, 0, 100),
    requestsPerSecond:
      Math.round(
        clamp(last.requestsPerSecond + (Math.random() - 0.5) * 20, 0, 500) * 10
      ) / 10,
  };

  const points = [...series.points.slice(1), nextPoint];
  return {
    serviceName: series.serviceName,
    points,
    status: computeStatus(nextPoint),
  };
}

export function generateBurstLogs(count: number, atISO?: string): LogEntry[] {
  const arr: LogEntry[] = [];
  for (let i = 0; i < count; i++) {
    const svc = randomFrom(DEFAULT_SERVICES);
    const lvl = weightedRandomLevel();
    arr.push(generateRandomLog(svc, lvl, atISO ?? dayjs().toISOString()));
  }
  return arr;
}

export const OBS_DEFAULT_WINDOW_MINUTES = 15;
export const OBS_METRIC_STEP_SECONDS = 30;

// Simple log generation functions
function getAllLogEntries() {
  return [...logsSet1, ...logsSet2, ...logsSet3];
}

export function generateRandomSimpleLog(timestampISO?: string): SimpleLogEntry {
  const allLogs = getAllLogEntries();
  const randomLog = randomFrom(allLogs);
  const ts = timestampISO ?? dayjs().toISOString();

  return {
    id: uuidv4(),
    timestamp: ts,
    content: randomLog.content,
  };
}

export function generateBurstSimpleLogs(
  count: number,
  atISO?: string
): SimpleLogEntry[] {
  const arr: SimpleLogEntry[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(generateRandomSimpleLog(atISO ?? dayjs().toISOString()));
  }
  return arr;
}
