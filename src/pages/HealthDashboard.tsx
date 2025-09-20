import { Card, Col, Row, Segmented, Space, Statistic, Tag, Button } from 'antd';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRealTimeMetrics } from '../hooks/useRealTimeMetrics';
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

type MetricKey = 'cpuUsage' | 'memoryUsage' | 'responseTime' | 'errorRate';

function buildLineOptions(
  title: string,
  services: ServiceName[],
  seriesByService: Record<ServiceName, HealthMetricsSeries>,
  key: MetricKey,
  thresholds?: { warn?: number; critical?: number; yMax?: number }
) {
  const series = services.map((s) => ({
    name: s,
    type: 'line',
    smooth: true as const,
    showSymbol: false,
    data: (seriesByService[s]?.points ?? []).map((p) => [p.timestamp, p[key]]),
  }));

  const yAxisName =
    key === 'cpuUsage'
      ? 'CPU (%)'
      : key === 'memoryUsage'
        ? 'Memory (%)'
        : key === 'responseTime'
          ? 'Response Time (ms)'
          : 'Error Rate (%)';

  const markLineData: {
    yAxis: number;
    lineStyle: { color: string };
    label: { formatter: string };
  }[] = [];
  if (thresholds?.warn != null) {
    markLineData.push({
      yAxis: thresholds.warn,
      lineStyle: { color: '#faad14' },
      label: { formatter: 'warn' },
    });
  }
  if (thresholds?.critical != null) {
    markLineData.push({
      yAxis: thresholds.critical,
      lineStyle: { color: '#ff4d4f' },
      label: { formatter: 'critical' },
    });
  }

  return {
    title: { text: title, left: 'center', top: 8, textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { top: 28 },
    grid: { top: 56, left: 48, right: 16, bottom: 32 },
    xAxis: {
      type: 'time' as const,
      axisLabel: { formatter: (v: string) => dayjs(v).format('HH:mm') },
    },
    yAxis: {
      type: 'value' as const,
      name: yAxisName,
      max: thresholds?.yMax,
    },
    series,
    markLine:
      markLineData.length > 0
        ? {
            symbol: 'none',
            data: markLineData,
          }
        : undefined,
  };
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
    'Response Time',
    visibleServices,
    seriesByService,
    'responseTime',
    { warn: 500, critical: 1000 }
  );

  const errOptions = buildLineOptions(
    'Error Rate',
    visibleServices,
    seriesByService,
    'errorRate',
    { warn: 3, critical: 10, yMax: 100 }
  );

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
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
              Updated: {dayjs(latestTimestamp).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          )}
          <Button onClick={() => controls.resetSeries()}>Reset</Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        {visibleServices.map((s) => {
          const last = lastByService[s];
          const status =
            seriesByService[s]?.status ?? ('healthy' as ServiceStatus);
          return (
            <Col key={s} xs={24} md={12} lg={6}>
              <Card>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
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
                      value={last?.responseTime ?? 0}
                      suffix="ms"
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

      <Card>
        <Space direction="vertical">
          <strong>Notes</strong>
          <ul style={{ marginLeft: 18 }}>
            <li>
              Threshold lines indicate warning/critical levels. Hover lines to
              see point values.
            </li>
            <li>
              Use the Logs page to investigate anomalies. Click a service name
              in Logs to deep-link here.
            </li>
          </ul>
        </Space>
      </Card>
    </Space>
  );
}
