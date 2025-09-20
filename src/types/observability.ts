export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogContext {
  requestUrl?: string;
  requestBody?: unknown;
  response?: unknown;
  userId?: string;
  sessionId?: string;
  traceId?: string;
  spanId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  id: string;
  timestamp: string; // ISO string
  serviceName: string; // e.g., 'api-gateway', 'user-service'
  level: LogLevel;
  message: string;
  context: LogContext;
}

export type ServiceStatus = 'healthy' | 'warning' | 'critical';

export interface HealthMetricsPoint {
  timestamp: string; // ISO string
  cpuUsage: number; // 0..100 (%)
  memoryUsage: number; // 0..100 (%)
  responseTime: number; // ms
  errorRate: number; // 0..100 (%)
}

export interface HealthMetricsSeries {
  serviceName: string;
  points: HealthMetricsPoint[];
  status: ServiceStatus;
}

export const DEFAULT_SERVICES = [
  'api-gateway',
  'user-service',
  'payment-service',
  'notification-service',
] as const;

export type ServiceName = (typeof DEFAULT_SERVICES)[number];

export interface TimeRange {
  from: string; // ISO
  to: string; // ISO
}
