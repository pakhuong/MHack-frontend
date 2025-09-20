import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  message,
  Modal,
  Collapse,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DEFAULT_SERVICES } from '../types/observability';
import type {
  LogEntry,
  LogLevel,
  ServiceName,
  TimeRange,
} from '../types/observability';
import { LOG_LEVELS } from '../services/mockData';
import { useRealTimeLogs } from '../hooks/useRealTimeLogs';

const { RangePicker } = DatePicker;

type TableLog = LogEntry;

function levelColor(level: LogLevel): string {
  switch (level) {
    case 'DEBUG':
      return 'default';
    case 'INFO':
      return 'blue';
    case 'WARN':
      return 'orange';
    case 'ERROR':
      return 'red';
    default:
      return 'default';
  }
}

function toCSV(rows: LogEntry[]): string {
  const headers = ['timestamp', 'serviceName', 'level', 'message', 'context'];
  const escape = (v: unknown) => {
    const s =
      typeof v === 'string'
        ? v
        : typeof v === 'object'
          ? JSON.stringify(v)
          : String(v ?? '');
    const needsQuote = /[",\n]/.test(s);
    return needsQuote ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.timestamp,
        r.serviceName,
        r.level,
        r.message,
        JSON.stringify(r.context ?? {}),
      ]
        .map(escape)
        .join(',')
    );
  }
  return lines.join('\n');
}

function download(filename: string, content: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

export default function LogExplorer() {
  const { controls, filterLogs, latestTimestamp } = useRealTimeLogs({
    initialBurst: 120,
    intervalMs: 1000,
  });

  const [services, setServices] = useState<ServiceName[]>();
  const [levels, setLevels] = useState<LogLevel[]>();
  const [text, setText] = useState<string>('');
  const [regex, setRegex] = useState<boolean>(false);
  const [range, setRange] = useState<TimeRange | undefined>(undefined);

  const filtered = useMemo(
    () =>
      filterLogs({
        services,
        levels,
        text,
        regex,
        timeRange: range,
      }),
    [filterLogs, services, levels, text, regex, range]
  );

  const [ctxModal, setCtxModal] = useState<{ open: boolean; entry?: LogEntry }>(
    {
      open: false,
    }
  );

  const columns: ColumnsType<TableLog> = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 200,
      render: (ts: string) => (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {dayjs(ts).format('YYYY-MM-DD HH:mm:ss.SSS')}
        </span>
      ),
      sorter: (a, b) =>
        dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 160,
      render: (s: string) => (
        <Tooltip title="Open health dashboard for this service">
          <a href={`/health?service=${encodeURIComponent(s)}`}>{s}</a>
        </Tooltip>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 110,
      render: (level: LogLevel) => <Tag color={levelColor(level)}>{level}</Tag>,
      filters: LOG_LEVELS.map((l) => ({ text: l, value: l })),
      onFilter: (v, r) => r.level === v,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'Context',
      key: 'context',
      width: 120,
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => setCtxModal({ open: true, entry: record })}
        >
          View
        </Button>
      ),
    },
    {
      title: 'Copy',
      key: 'copy',
      width: 100,
      render: (_, record) => (
        <Button
          size="small"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(JSON.stringify(record));
              message.success('Copied log line to clipboard');
            } catch {
              message.error('Copy failed');
            }
          }}
        >
          Copy
        </Button>
      ),
    },
  ];

  const onExportJSON = () => {
    const name = `logs_${dayjs().format('YYYYMMDD_HHmmss')}.json`;
    download(name, JSON.stringify(filtered, null, 2), 'application/json');
  };

  const onExportCSV = () => {
    const name = `logs_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    download(name, toCSV(filtered), 'text/csv');
  };

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form layout="inline" style={{ rowGap: 12 }}>
          <Form.Item label="Services">
            <Select<ServiceName[]>
              mode="multiple"
              allowClear
              placeholder="Select services"
              style={{ minWidth: 240 }}
              value={services}
              onChange={(v) => setServices(v)}
              options={DEFAULT_SERVICES.map((s) => ({ label: s, value: s }))}
            />
          </Form.Item>
          <Form.Item label="Levels">
            <Select<LogLevel[]>
              mode="multiple"
              allowClear
              placeholder="Select levels"
              style={{ minWidth: 220 }}
              value={levels}
              onChange={(v) => setLevels(v)}
              options={LOG_LEVELS.map((l) => ({ label: l, value: l }))}
            />
          </Form.Item>
          <Form.Item label="Time Range">
            <RangePicker
              showTime
              onChange={(vals) => {
                if (!vals || vals.length < 2) {
                  setRange(undefined);
                } else {
                  setRange({
                    from: vals[0]!.toISOString(),
                    to: vals[1]!.toISOString(),
                  });
                }
              }}
            />
          </Form.Item>
          <Form.Item label="Search">
            <Input
              placeholder="Text or regex"
              allowClear
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: 260 }}
            />
          </Form.Item>
          <Form.Item label="Regex">
            <Switch checked={regex} onChange={setRegex} />
          </Form.Item>
          <Form.Item>
            <Space>
              {controls.isPaused ? (
                <Button type="primary" onClick={controls.resume}>
                  Resume
                </Button>
              ) : (
                <Button onClick={controls.pause}>Pause</Button>
              )}
              <Button danger onClick={controls.clear}>
                Clear
              </Button>
              <Button onClick={onExportJSON}>Export JSON</Button>
              <Button onClick={onExportCSV}>Export CSV</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={
          <Space>
            <span>Live Logs</span>
            <Tag>{filtered.length} rows</Tag>
            {latestTimestamp && (
              <Tag color="default">
                Last: {dayjs(latestTimestamp).format('HH:mm:ss')}
              </Tag>
            )}
          </Space>
        }
        styles={{ body: { padding: 0 } }}
      >
        <Table<TableLog>
          rowKey="id"
          size="small"
          dataSource={filtered.slice(-2000)} // keep table manageable
          columns={columns}
          pagination={{ pageSize: 25, showSizeChanger: true }}
          sticky
        />
      </Card>

      <Modal
        title="Log Context"
        open={ctxModal.open}
        onCancel={() => setCtxModal({ open: false })}
        footer={
          <Button onClick={() => setCtxModal({ open: false })}>Close</Button>
        }
        width={820}
      >
        {ctxModal.entry ? (
          <Space direction="vertical" style={{ width: '100%' }} size={12}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Timestamp">
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {dayjs(ctxModal.entry.timestamp).format(
                    'YYYY-MM-DD HH:mm:ss.SSS'
                  )}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Service">
                {ctxModal.entry.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Level">
                <Tag color={levelColor(ctxModal.entry.level)}>
                  {ctxModal.entry.level}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Message">
                <code>{ctxModal.entry.message}</code>
              </Descriptions.Item>
              {ctxModal.entry.context?.requestUrl && (
                <Descriptions.Item label="Request URL">
                  <code>{ctxModal.entry.context.requestUrl}</code>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Collapse
              items={[
                {
                  key: 'req',
                  label: 'Request Body',
                  children: (
                    <pre
                      style={{
                        background: '#0b1021',
                        color: '#d6deeb',
                        padding: 12,
                        borderRadius: 6,
                        maxHeight: 260,
                        overflow: 'auto',
                        fontSize: 12,
                      }}
                    >
                      {JSON.stringify(
                        ctxModal.entry.context?.requestBody ?? {},
                        null,
                        2
                      )}
                    </pre>
                  ),
                },
                {
                  key: 'res',
                  label: 'Response',
                  children: (
                    <pre
                      style={{
                        background: '#0b1021',
                        color: '#d6deeb',
                        padding: 12,
                        borderRadius: 6,
                        maxHeight: 260,
                        overflow: 'auto',
                        fontSize: 12,
                      }}
                    >
                      {JSON.stringify(
                        ctxModal.entry.context?.response ?? {},
                        null,
                        2
                      )}
                    </pre>
                  ),
                },
              ]}
            />

            <Descriptions bordered size="small" column={2}>
              {ctxModal.entry.context?.userId && (
                <Descriptions.Item label="User ID">
                  {String(ctxModal.entry.context.userId)}
                </Descriptions.Item>
              )}
              {ctxModal.entry.context?.sessionId && (
                <Descriptions.Item label="Session ID">
                  {String(ctxModal.entry.context.sessionId)}
                </Descriptions.Item>
              )}
              {ctxModal.entry.context?.traceId && (
                <Descriptions.Item label="Trace ID">
                  <code>{String(ctxModal.entry.context.traceId)}</code>
                </Descriptions.Item>
              )}
              {ctxModal.entry.context?.spanId && (
                <Descriptions.Item label="Span ID">
                  <code>{String(ctxModal.entry.context.spanId)}</code>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Space>
        ) : (
          <div>No context</div>
        )}
      </Modal>
    </Space>
  );
}
