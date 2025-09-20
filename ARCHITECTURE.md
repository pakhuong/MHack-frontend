# Observability UI: Log Explorer and Health Dashboard

This document records architecture decisions and an incremental implementation plan for adding:

1. A Log Explorer to display and explore log messages from backend services (mocked for now)
2. A System Health Dashboard to visualize service metrics similar to Grafana (mocked for now)

It will be updated as work progresses, with status checkboxes for each step.

## 1. Goals and Scope

- Real-time log streaming with pause/resume/clear
- Advanced search and filtering (keywords, regex, fields, time range, level)
- Readable formatting with syntax highlighting for structured JSON context
- Time-range selection and historical view (mocked)
- Log level filtering and contextual linking placeholders
- Copy and export (JSON/CSV)
- Real-time health metrics: CPU, Memory, Response Time, Error Rate, Service Status
- Separated pages: `/logs` and `/health`
- ECharts for charts, Ant Design UI components, Redux Toolkit + RTK Query for data handling
- Mock data now; designed for easy switch to real backends later (VictoriaLogs/Prometheus/Grafana)

## 2. Technology Choices and Rationale

- React + TypeScript: existing stack, type safety, DX.
- Redux Toolkit + RTK Query: existing store; RTK Query for data fetching and caching.
- Ant Design: existing component library for tables, forms, pickers.
- ECharts + echarts-for-react: powerful charting; supports large datasets and real-time updates.
- dayjs: lightweight date/time handling.
- uuid: unique IDs for mock entries.
- react-json-view: collapsible view for JSON log context.
- Tailwind + AntD: present; use AntD for heavy UI, Tailwind for utility spacing when handy.

## 3. High-level Architecture

- Pages
  - LogExplorerPage (`/logs`)
    - Toolbar: search input (text/regex), level multi-select, service multi-select, time range picker
    - Real-time controls: pause/resume, clear, export, copy selection
    - Log list: virtualized table/list with color-coded levels; expandable JSON context viewer
  - HealthDashboardPage (`/health`)
    - Charts: CPU, Memory, Response Time, Error Rate (ECharts line/area)
    - Service Status Grid: current status with thresholds
    - Time controls: presets (1h/6h/24h/7d) + custom

- Data
  - Mock generators produce:
    - Logs: 1–3s interval per service, randomized levels and context
    - Metrics: 10–30s interval, rolling time-series
  - Real-time: simulated via setInterval; designed to swap to WebSocket/SSE

- State management
  - RTK Query endpoints for logs and metrics (mocked base)
  - Local UI state for filters, time range, and controls
  - Derived selectors to filter/search efficiently

## 4. Data Contracts (TypeScript)

```ts
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogContext {
  requestUrl?: string;
  requestBody?: unknown;
  response?: unknown;
  userId?: string;
  sessionId?: string;
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
```

## 5. Mock Data Strategy

- Services: api-gateway, user-service, payment-service, notification-service
- Logs:
  - Levels distributed realistically (DEBUG/INFO heavy, occasional WARN/ERROR)
  - Context objects include request/response snippets and ids
  - Append new log entries every 1–3 seconds per service
- Metrics:
  - Rolling arrays with time window preserved (e.g., last N minutes)
  - Random walk with occasional spikes for realism
  - Update every 10–30 seconds per service

## 6. Real-time Update Strategy

- Initial: setInterval-based emitters wrapped in custom hooks:
  - useRealTimeLogs: returns live stream; supports pause/resume/clear
  - useRealTimeMetrics: returns time-series per service; supports time window change
- Abstraction designed to replace interval sources with WebSocket/SSE without UI changes
- Performance:
  - Virtualized rendering for large log lists
  - Batching appends; requestAnimationFrame where needed
  - Debounced search/filter; memoized derived data

## 7. UI Composition

- Log Explorer
  - Filters: AntD Form, Select, DatePicker.RangePicker, Switch/Checkbox for regex
  - Table: AntD Table or virtualized list; expandable rows for JSON context (react-json-view)
  - Toolbar: Buttons for Pause/Resume, Clear, Export (CSV/JSON), Copy selected
  - Color coding: level badges; monospace body for messages

- Health Dashboard
  - ECharts line/area charts with smooth transitions
  - Status Grid: cards with colored status indicators
  - Time range presets and custom picker
  - Legend and tooltips; threshold lines for warning/critical

## 8. Routing and Navigation

- Add routes:
  - /logs -> LogExplorerPage
  - /health -> HealthDashboardPage
- Add navigation links from Home and/or a simple header

## 9. Error Handling & Edge Cases

- Empty states for no logs or metrics
- Graceful handling on pause (buffering disabled) and resume
- Time zone and clock skew considerations (dayjs)
- Export sanitization; limit export size or paginate

## 10. Future Backend Integration

- Logs:
  - Replace mock with VictoriaLogs/Elasticsearch/Kibana-like APIs
  - Use fielded queries and server-side filtering where possible
  - Prefer SSE or WebSocket for real-time tail
- Metrics:
  - Replace mock with Prometheus/Grafana datasources (PromQL queries)
  - Server-side rollups for larger time ranges

## 11. Testing Strategy

- Unit tests for data generators and selectors
- Component tests for filters, table rendering, and chart options
- Performance sanity checks with large log volumes

---

# Implementation Plan and Progress

This checklist is updated as work proceeds.

- [x] Create architecture documentation file
- [x] Install required dependencies (echarts, echarts-for-react, uuid, dayjs)
- [x] Create TypeScript interfaces for logs and health metrics
- [x] Build mock data generators for realistic log and health data
- [x] Create real-time logs hook
- [x] Create real-time metrics hook
- [x] Create Log Explorer page with advanced filtering and search
- [x] Implement real-time log streaming with pause/resume controls
- [x] Build Health Dashboard with ECharts integration
- [x] Add routing for new pages and update navigation
- [x] Implement header, sidebar, breadcrumb for navigation
- [x] Implement export/copy functionality for logs
- [ ] Test real-time performance and polish UI/UX

## Milestone Acceptance Criteria

- Logs page shows live stream, allows filtering by time range, service, level, text/regex; supports pause/resume/clear; supports copy and export; JSON context expandable.
- Health page shows live-updating charts for CPU, memory, response time, error rate, with service status grid and time range presets.

## Update Log

- v0.1: Created architecture document with decisions, data contracts, and plan.
