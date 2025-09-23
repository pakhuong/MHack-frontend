import { useMemo, useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Space,
  Switch,
  Tag,
} from 'antd';
import type { TimeRange } from '../types/observability';
import { useWebSocketLogs } from '../hooks/useWebSocketLogs';

const { RangePicker } = DatePicker;

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
  const { controls, filterLogs, latestTimestamp, connectionState, reconnect } =
    useWebSocketLogs({
      initialBurst: 120,
      intervalMs: 2000,
    });

  const [text, setText] = useState<string>('');
  const [regex, setRegex] = useState<boolean>(false);
  const [range, setRange] = useState<TimeRange | undefined>(undefined);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      filterLogs({
        text,
        regex,
        timeRange: range,
      }),
    [filterLogs, text, regex, range]
  );

  // Auto-scroll effect for new logs
  useEffect(() => {
    if (autoScroll && !isUserScrolling && logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [filtered.length, autoScroll, isUserScrolling]);

  const onExportText = () => {
    const name = `logs_${dayjs().format('YYYYMMDD_HHmmss')}.txt`;
    const content = filtered
      .map((log) => `${log.timestamp} ${log.content}`)
      .join('\n');
    download(name, content, 'text/plain');
  };

  return (
    <Space direction="vertical" size={16} style={{ display: 'flex' }}>
      <Card>
        <Form layout="inline" style={{ rowGap: 12 }}>
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
          <Form.Item label="Auto Scroll">
            <Switch
              checked={autoScroll && !isUserScrolling}
              onChange={(checked) => {
                setAutoScroll(checked);
                if (checked) {
                  setIsUserScrolling(false);
                  // Force scroll to bottom when enabled
                  setTimeout(() => {
                    if (logContainerRef.current) {
                      logContainerRef.current.scrollTop =
                        logContainerRef.current.scrollHeight;
                    }
                  }, 0);
                }
              }}
            />
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
              <Button onClick={onExportText}>Export Text</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={
          <Space>
            <span>Live Logs</span>
            <Tag>{filtered.length} logs</Tag>
            {latestTimestamp && (
              <Tag color="default">
                Last: {dayjs(latestTimestamp).format('HH:mm:ss')}
              </Tag>
            )}
            {connectionState.isConnected ? (
              <Tag color="green">WebSocket Connected</Tag>
            ) : connectionState.isConnecting ? (
              <Tag color="blue">Connecting...</Tag>
            ) : connectionState.error ? (
              <Tag
                color="red"
                style={{ cursor: 'pointer' }}
                onClick={reconnect}
              >
                Connection Failed - Click to Retry
              </Tag>
            ) : (
              <Tag color="orange">Disconnected</Tag>
            )}
          </Space>
        }
        styles={{ body: { padding: 16 } }}
      >
        <div
          ref={logContainerRef}
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance

            if (!isAtBottom && autoScroll) {
              // User scrolled up, temporarily disable auto-scroll
              setIsUserScrolling(true);
            } else if (isAtBottom && isUserScrolling) {
              // User scrolled back to bottom, re-enable auto-scroll
              setIsUserScrolling(false);
            }
          }}
          style={{
            fontFamily: 'Monaco, "Lucida Console", monospace',
            fontSize: '12px',
            lineHeight: '1.4',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: '12px',
            borderRadius: '4px',
            maxHeight: '600px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {filtered.slice(-1000).map((log, index) => (
            <div
              key={log.id}
              style={{
                marginBottom: '2px',
                padding: '1px 0',
                borderLeft:
                  index % 2 === 0 ? '2px solid #333' : '2px solid transparent',
                paddingLeft: '6px',
              }}
            >
              <span style={{ color: '#569cd6', fontWeight: 'normal' }}>
                {dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS')}
              </span>
              <span style={{ marginLeft: '8px' }}>{log.content}</span>
            </div>
          ))}
        </div>
      </Card>
    </Space>
  );
}
