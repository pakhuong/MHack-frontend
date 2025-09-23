import {
  Card,
  Col,
  Row,
  Segmented,
  Space,
  Statistic,
  Tag,
  Button,
  Tabs,
  Alert,
  Badge,
  Table,
  Avatar,
} from 'antd';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRealTimeMetrics } from '../hooks/useRealTimeMetrics';
import { Bell, AlertTriangle, ChevronDown, Clock, User } from 'lucide-react';
import type {
  ServiceName,
  ServiceStatus,
  HealthMetricsSeries,
  HealthMetricsPoint,
} from '../types/observability';

function statusColor(status: ServiceStatus) {
  switch (status) {
    case 'healthy':
      return 'green';
    case 'warning':
      return 'orange';
    case 'critical':
      return 'red';
    default:
      return 'default';
  }
}

type MetricKey =
  | 'cpuUsage'
  | 'memoryUsage'
  | 'responseTime'
  | 'errorRate'
  | 'requestsPerSecond';

function buildLineOptions(
  title: string,
  services: ServiceName[],
  seriesByService: Record<ServiceName, HealthMetricsSeries>,
  key: MetricKey,
  thresholds?: { warn?: number; critical?: number; yMax?: number }
) {
  // Define vibrant colors for better dark mode visibility
  const lineColors = [
    '#60a5fa', // Blue
    '#34d399', // Emerald
    '#fbbf24', // Amber
    '#f87171', // Red
    '#a78bfa', // Purple
    '#fb7185', // Pink
    '#4ade80', // Green
    '#38bdf8', // Sky
  ];

  const series = services.map((s, index) => ({
    name: s,
    type: 'line',
    smooth: true as const,
    showSymbol: false,
    lineStyle: {
      width: 2,
      color: lineColors[index % lineColors.length],
    },
    itemStyle: {
      color: lineColors[index % lineColors.length],
    },
    data: (seriesByService[s]?.points ?? []).map((p) => [p.timestamp, p[key]]),
  }));

  const yAxisName =
    key === 'cpuUsage'
      ? 'CPU (%)'
      : key === 'memoryUsage'
        ? 'Memory (%)'
        : key === 'responseTime'
          ? 'Latency (ms)'
          : key === 'requestsPerSecond'
            ? 'Requests/sec'
            : 'Failure Rate (%)';

  const markLineData: {
    yAxis: number;
    lineStyle: { color: string; width: number; type: string };
    label: {
      formatter: string;
      color: string;
      backgroundColor: string;
      borderColor: string;
      borderRadius: number;
      padding: number[];
    };
  }[] = [];
  if (thresholds?.warn != null) {
    markLineData.push({
      yAxis: thresholds.warn,
      lineStyle: { color: '#faad14', width: 2, type: 'dashed' },
      label: {
        formatter: 'warn',
        color: '#1f2937',
        backgroundColor: '#faad14',
        borderColor: '#f59e0b',
        borderRadius: 4,
        padding: [4, 8],
      },
    });
  }
  if (thresholds?.critical != null) {
    markLineData.push({
      yAxis: thresholds.critical,
      lineStyle: { color: '#ff4d4f', width: 2, type: 'dashed' },
      label: {
        formatter: 'critical',
        color: '#ffffff',
        backgroundColor: '#ff4d4f',
        borderColor: '#ef4444',
        borderRadius: 4,
        padding: [4, 8],
      },
    });
  }

  return {
    backgroundColor: 'transparent',
    title: {
      text: title,
      left: 'center',
      top: 8,
      textStyle: {
        fontSize: 14,
        color: '#f5f5f5',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: '#374151',
      borderWidth: 1,
      textStyle: {
        color: '#f5f5f5',
        fontSize: 12,
      },
      axisPointer: {
        lineStyle: {
          color: '#6b7280',
        },
      },
    },
    legend: {
      top: 28,
      textStyle: {
        color: '#d1d5db',
        fontSize: 12,
      },
      itemGap: 20,
    },
    grid: {
      top: 56,
      left: 48,
      right: 16,
      bottom: 32,
      borderColor: '#374151',
      backgroundColor: 'transparent',
    },
    xAxis: {
      type: 'time' as const,
      axisLabel: {
        formatter: (v: string) => dayjs(v).format('HH:mm'),
        color: '#9ca3af',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#4b5563',
        },
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value' as const,
      name: yAxisName,
      nameTextStyle: {
        color: '#9ca3af',
        fontSize: 11,
      },
      max: thresholds?.yMax,
      axisLabel: {
        color: '#9ca3af',
        fontSize: 11,
      },
      axisLine: {
        lineStyle: {
          color: '#4b5563',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#4b5563',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#374151',
          type: 'solid',
          opacity: 0.3,
        },
      },
    },
    series,
    markLine:
      markLineData.length > 0
        ? {
            symbol: 'none',
            data: markLineData,
            silent: true,
          }
        : undefined,
  };
}

// Status Dashboard Component
function StatusDashboard() {
  const [activeTab, setActiveTab] = useState('status');

  // Mock incident data
  const incidents = [
    {
      id: 'INC-001',
      service: 'PayontheGo Financial Services',
      problem:
        '[Synthetics] Datadog has detected a problem with Payment Web API - critical',
      impactedService: 'Web - Backend for Frontend Server',
      priority: 'P2',
      priorityColor: 'orange',
      subscribed: true,
      status: 'investigating',
      statusColor: 'orange',
      assignee: {
        name: 'John Smith',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      },
      createdAt: '2025-01-20 14:30:00',
      updatedAt: '2025-01-20 15:45:00',
      duration: '1h 15m',
    },
    {
      id: 'INC-002',
      service: 'Mobile Services',
      problem:
        'prod-mobile Request Response Time is High - (95th percentile > 250 ms on average during the last 10m)',
      impactedService: 'Mobile - Backend for Frontend Server',
      priority: 'P3',
      priorityColor: 'blue',
      subscribed: false,
      status: 'monitoring',
      statusColor: 'blue',
      assignee: {
        name: 'Sarah Johnson',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      },
      createdAt: '2025-01-20 13:15:00',
      updatedAt: '2025-01-20 14:20:00',
      duration: '2h 5m',
    },
    {
      id: 'INC-003',
      service: 'Payment Services',
      problem: 'Elevated response times in payment mobile in prod-mobile',
      impactedService: 'Mobile - Backend for Frontend Server',
      priority: 'P3',
      priorityColor: 'blue',
      subscribed: false,
      status: 'resolved',
      statusColor: 'green',
      assignee: {
        name: 'Mike Chen',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      },
      createdAt: '2025-01-20 12:00:00',
      updatedAt: '2025-01-20 13:30:00',
      duration: '1h 30m',
    },
    {
      id: 'INC-004',
      service: 'Database Services',
      problem: 'High CPU usage detected on primary database server',
      impactedService: 'Database - Primary Server',
      priority: 'P1',
      priorityColor: 'red',
      subscribed: true,
      status: 'investigating',
      statusColor: 'red',
      assignee: {
        name: 'Alex Rodriguez',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      },
      createdAt: '2025-01-20 16:00:00',
      updatedAt: '2025-01-20 16:15:00',
      duration: '15m',
    },
    {
      id: 'INC-005',
      service: 'API Gateway',
      problem: 'Rate limiting errors affecting multiple endpoints',
      impactedService: 'API Gateway - Load Balancer',
      priority: 'P2',
      priorityColor: 'orange',
      subscribed: false,
      status: 'monitoring',
      statusColor: 'blue',
      assignee: {
        name: 'Emma Wilson',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      },
      createdAt: '2025-01-20 15:30:00',
      updatedAt: '2025-01-20 15:45:00',
      duration: '15m',
    },
  ];

  const tabItems = [
    {
      key: 'incidents',
      label: 'Incidents',
    },
    {
      key: 'status',
      label: (
        <Space>
          Status Dashboard
          <AlertTriangle size={12} color="red" />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: '100%' }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      {activeTab === 'status' && (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {/* Alert Banner */}
          <Alert
            message={
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}
                >
                  PayontheGo Operations
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {incidents.filter((i) => i.status !== 'resolved').length}{' '}
                  disrupted business service
                  {incidents.filter((i) => i.status !== 'resolved').length !== 1
                    ? 's'
                    : ''}
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}
                >
                  Last updated a few seconds ago
                </div>
              </Space>
            }
            type="error"
            style={{
              backgroundColor: '#ff4d4f',
              border: 'none',
              color: 'white',
            }}
          />

          {/* Incident Cards */}
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {incidents.map((incident) => (
              <Card
                key={incident.id}
                size="small"
                style={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                }}
                bodyStyle={{ padding: '12px' }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Space>
                      <AlertTriangle size={16} color="red" />
                      <span style={{ fontWeight: 'bold', color: '#f4f4f5' }}>
                        {incident.service}
                      </span>
                    </Space>
                    <Space>
                      <Badge
                        count={incident.priority}
                        style={{
                          backgroundColor: incident.priorityColor,
                          color: 'white',
                        }}
                      />
                      <ChevronDown size={16} color="#a1a1aa" />
                    </Space>
                  </div>

                  {/* Problem Description */}
                  <div style={{ color: '#60a5fa', fontSize: '14px' }}>
                    {incident.problem}
                  </div>

                  {/* Impacted Service */}
                  <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
                    Impacted Service: {incident.impactedService}
                  </div>

                  {/* Status and Priority */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Space>
                      <Tag
                        color={incident.statusColor}
                        style={{ fontSize: '10px' }}
                      >
                        {incident.status.toUpperCase()}
                      </Tag>
                      <span style={{ color: '#a1a1aa', fontSize: '12px' }}>
                        Priority: {incident.priority}
                      </span>
                    </Space>
                    <Space>
                      <Clock size={12} color="#a1a1aa" />
                      <span style={{ color: '#a1a1aa', fontSize: '11px' }}>
                        {incident.duration}
                      </span>
                    </Space>
                  </div>

                  {/* Assignee */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <User size={12} color="#a1a1aa" />
                    <Avatar size={16} src={incident.assignee.avatar}>
                      {incident.assignee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Avatar>
                    <span style={{ color: '#a1a1aa', fontSize: '11px' }}>
                      {incident.assignee.name}
                    </span>
                  </div>

                  {/* Subscription Status */}
                  {incident.subscribed && (
                    <div
                      style={{
                        color: '#4ade80',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Bell size={12} style={{ marginRight: '4px' }} />
                      You are subscribed to this incident.
                    </div>
                  )}
                </Space>
              </Card>
            ))}
          </Space>

          {/* Related Business Services */}
          <Card
            size="small"
            style={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
            }}
          >
            <div style={{ color: '#a1a1aa', fontSize: '12px' }}>
              Related business services
            </div>
          </Card>
        </Space>
      )}

      {activeTab === 'incidents' && (
        <div style={{ width: '100%' }}>
          <Table
            dataSource={incidents}
            pagination={false}
            size="small"
            rowKey="id"
            columns={[
              {
                title: 'Incident',
                key: 'incident',
                render: (_, record) => (
                  <Space direction="vertical" size={4}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <AlertTriangle size={14} color="red" />
                      <span
                        style={{
                          fontWeight: 'bold',
                          fontSize: '13px',
                          color: '#f4f4f5',
                        }}
                      >
                        {record.service}
                      </span>
                    </div>
                    <div
                      style={{
                        color: '#60a5fa',
                        fontSize: '12px',
                        marginLeft: '22px',
                      }}
                    >
                      {record.problem}
                    </div>
                  </Space>
                ),
              },
              {
                title: 'Status',
                key: 'status',
                width: 100,
                render: (_, record) => (
                  <Tag color={record.statusColor} style={{ fontSize: '11px' }}>
                    {record.status.toUpperCase()}
                  </Tag>
                ),
              },
              {
                title: 'Priority',
                key: 'priority',
                width: 80,
                render: (_, record) => (
                  <Badge
                    count={record.priority}
                    style={{
                      backgroundColor: record.priorityColor,
                      color: 'white',
                      fontSize: '10px',
                    }}
                  />
                ),
              },
              {
                title: 'Assignee',
                key: 'assignee',
                width: 120,
                render: (_, record) => (
                  <Space size={4}>
                    <Avatar size={20} src={record.assignee.avatar}>
                      {record.assignee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Avatar>
                    <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
                      {record.assignee.name}
                    </span>
                  </Space>
                ),
              },
              {
                title: 'Duration',
                key: 'duration',
                width: 80,
                render: (_, record) => (
                  <Space size={4}>
                    <Clock size={12} color="#a1a1aa" />
                    <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
                      {record.duration}
                    </span>
                  </Space>
                ),
              },
            ]}
            style={{ backgroundColor: '#18181b' }}
          />
        </div>
      )}
    </div>
  );
}

export default function HealthDashboard() {
  const [searchParams] = useSearchParams();
  type Preset = '15m' | '1h' | '6h' | '24h';
  const [preset, setPreset] = useState<Preset>('15m');

  const presetToMinutes: Record<Preset, number> = {
    '15m': 15,
    '1h': 60,
    '6h': 360,
    '24h': 1440,
  };

  const initialService = (searchParams.get('service') ?? undefined) as
    | ServiceName
    | undefined;

  const {
    seriesByService,
    services,
    latestTimestamp,
    windowMinutes,
    controls,
  } = useRealTimeMetrics({
    services: initialService ? [initialService] : undefined,
    windowMinutes: presetToMinutes[preset],
  });

  // Adjust window when preset changes
  useEffect(() => {
    const minutes = presetToMinutes[preset];
    if (minutes !== windowMinutes) {
      controls.setWindowMinutes(minutes);
    }
  }, [preset, windowMinutes, controls]);

  const visibleServices = useMemo<ServiceName[]>(() => services, [services]);

  const lastByService = useMemo(() => {
    const obj: Record<ServiceName, HealthMetricsPoint | null> = {} as Record<
      ServiceName,
      HealthMetricsPoint | null
    >;
    for (const s of visibleServices) {
      const pts = seriesByService[s]?.points ?? [];
      obj[s] = pts.length ? pts[pts.length - 1] : null;
    }
    return obj;
  }, [seriesByService, visibleServices]);

  const cpuOptions = buildLineOptions(
    'CPU Usage',
    visibleServices,
    seriesByService,
    'cpuUsage',
    { warn: 85, critical: 95, yMax: 100 }
  );

  const memOptions = buildLineOptions(
    'Memory Usage',
    visibleServices,
    seriesByService,
    'memoryUsage',
    { warn: 85, critical: 95, yMax: 100 }
  );

  const rtOptions = buildLineOptions(
    'Latency',
    visibleServices,
    seriesByService,
    'responseTime',
    { warn: 500, critical: 1000 }
  );

  const errOptions = buildLineOptions(
    'Failure Rate',
    visibleServices,
    seriesByService,
    'errorRate',
    { warn: 3, critical: 10 }
  );

  const rpsOptions = buildLineOptions(
    'Requests per Second',
    visibleServices,
    seriesByService,
    'requestsPerSecond'
  );

  return (
    <Row gutter={[24, 16]} style={{ height: '100%' }}>
      {/* Left Column - Health Dashboard */}
      <Col xs={24} lg={24}>
        <Space
          direction="vertical"
          size={16}
          style={{ display: 'flex', height: '100%' }}
        >
          <Card>
            <Space align="center" wrap>
              <h4 style={{ margin: 0 }}>System Health</h4>
              <Segmented
                options={[
                  { label: '15m', value: '15m' },
                  { label: '1h', value: '1h' },
                  { label: '6h', value: '6h' },
                  { label: '24h', value: '24h' },
                ]}
                value={preset}
                onChange={(v) => setPreset(v as Preset)}
              />
              {latestTimestamp && (
                <span style={{ color: '#6b7280' }}>
                  Updated:{' '}
                  {dayjs(latestTimestamp).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              )}
              <Button onClick={() => controls.resetSeries()}>Reset</Button>
            </Space>
          </Card>

          <Row
            gutter={[16, 16]}
            style={{ justifyContent: 'stretch', alignItems: 'stretch' }}
          >
            {visibleServices.map((s) => {
              const last = lastByService[s];
              const status =
                seriesByService[s]?.status ?? ('healthy' as ServiceStatus);
              return (
                <Col key={s} xs={24} md={12} lg={6}>
                  <Card>
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: '100%' }}
                    >
                      <Space align="center">
                        <h5 style={{ margin: 0 }}>{s}</h5>
                        <Tag color={statusColor(status)}>{status}</Tag>
                      </Space>
                      <Space size={16} wrap>
                        <Statistic
                          title="CPU"
                          value={last?.cpuUsage ?? 0}
                          suffix="%"
                          precision={1}
                        />
                        <Statistic
                          title="Mem"
                          value={last?.memoryUsage ?? 0}
                          suffix="%"
                          precision={1}
                        />
                        <Statistic
                          title="RT"
                          value={Math.round(last?.responseTime ?? 0)}
                          suffix="ms"
                          style={{
                            wordBreak: 'break-word',
                          }}
                        />
                        <Statistic
                          title="RPS"
                          value={Math.round(last?.requestsPerSecond ?? 0)}
                          suffix="req/s"
                          precision={1}
                          style={{
                            wordBreak: 'break-word',
                          }}
                        />
                        <Statistic
                          title="Error"
                          value={last?.errorRate ?? 0}
                          suffix="%"
                          precision={1}
                          valueStyle={{
                            color:
                              (last?.errorRate ?? 0) > 10
                                ? '#ff4d4f'
                                : (last?.errorRate ?? 0) > 3
                                  ? '#fa8c16'
                                  : undefined,
                          }}
                        />
                      </Space>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card>
                <ReactECharts
                  notMerge
                  lazyUpdate
                  option={cpuOptions}
                  style={{ height: 300 }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card>
                <ReactECharts
                  notMerge
                  lazyUpdate
                  option={memOptions}
                  style={{ height: 300 }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card>
                <ReactECharts
                  notMerge
                  lazyUpdate
                  option={rtOptions}
                  style={{ height: 300 }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card>
                <ReactECharts
                  notMerge
                  lazyUpdate
                  option={errOptions}
                  style={{ height: 300 }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card>
                <ReactECharts
                  notMerge
                  lazyUpdate
                  option={rpsOptions}
                  style={{ height: 300 }}
                />
              </Card>
            </Col>
          </Row>

          <Card>
            <Space direction="vertical">
              <strong>Notes</strong>
              <ul style={{ marginLeft: 18 }}>
                <li>
                  Threshold lines indicate warning/critical levels. Hover lines
                  to see point values.
                </li>
                <li>
                  Use the Logs page to investigate anomalies. Click a service
                  name in Logs to deep-link here.
                </li>
              </ul>
            </Space>
          </Card>
        </Space>
      </Col>

      {/* Right Column - Status Dashboard */}
      {/* <Col xs={24} lg={8}>
        <StatusDashboard />
      </Col> */}
    </Row>
  );
}
