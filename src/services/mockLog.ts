/**
 * Tập 1
 * - Chủ đạo: log thành công (INFO)
 * - Đôi khi có vài log hệ thống (deploy, cache, health)
 */
export const logsSet1 = [
  {
    timestamp: '2025-09-18T10:04:50Z',
    content: 'level=INFO service=gateway route=/health status=200 latency_ms=8',
  },
  {
    timestamp: '2025-09-18T10:04:58Z',
    content: 'payment succeeded for order ORD1001 (txn TXN1001)',
  },
  {
    timestamp: '2025-09-18T10:05:05Z',
    content:
      'level=INFO service=payment-service op=authorize status=OK ms=120 user=88421',
  },
  {
    timestamp: '2025-09-18T10:05:12Z',
    content:
      '{"level":"INFO","service":"deploy","service_name":"payment-service","version":"v1.1.9","action":"completed"}',
  },
  {
    timestamp: '2025-09-18T10:05:18Z',
    content:
      'level=INFO service=auth-service event=token_issued user=88421 latency_ms=34 trace=tr-a1',
  },
  {
    timestamp: '2025-09-18T10:05:25Z',
    content:
      'level=INFO service=payment-service op=capture status=OK ms=98 order=ORD1002',
  },
  { timestamp: '2025-09-18T10:05:33Z', content: 'cache warmup done' },
  {
    timestamp: '2025-09-18T10:05:40Z',
    content: 'level=INFO service=payment-service rps=9200 p95_ms=280',
  },
  {
    timestamp: '2025-09-18T10:05:47Z',
    content:
      'level=INFO service=bank-adapter route=/charge status=200 p95_ms=240',
  },
  {
    timestamp: '2025-09-18T10:05:55Z',
    content: 'payment succeeded for order ORD1003 (txn TXN1003)',
  },
  {
    timestamp: '2025-09-18T10:06:02Z',
    content: '{"level":"INFO","service":"queue","topic":"txn","lag":12}',
  },
  {
    timestamp: '2025-09-18T10:06:10Z',
    content: 'level=INFO service=gateway route=/pay status=200 latency_ms=110',
  },
  {
    timestamp: '2025-09-18T10:06:18Z',
    content: 'payment succeeded for order ORD1004 (txn TXN1004)',
  },
  {
    timestamp: '2025-09-18T10:06:25Z',
    content:
      'level=INFO service=payment-service circuit_breaker=CLOSED target=bank-api',
  },
  {
    timestamp: '2025-09-18T10:06:33Z',
    content: 'level=INFO service=metrics sampler=ok window=60s',
  },
];

/**
 * Tập 2
 * - Thành công là chính, xen kẽ log hệ thống + một số WARNING (upstream slow, retries, near-threshold)
 */
export const logsSet2 = [
  {
    timestamp: '2025-09-18T11:00:00Z',
    content:
      'level=INFO service=payment-service op=authorize status=OK ms=150 order=ORD2001',
  },
  {
    timestamp: '2025-09-18T11:00:07Z',
    content: 'level=INFO service=gateway route=/pay status=200 latency_ms=130',
  },
  {
    timestamp: '2025-09-18T11:00:15Z',
    content:
      'level=WARN service=bank-adapter name=upstream_slow p95_ms=850 baseline_ms=300 bank=ABC',
  },
  {
    timestamp: '2025-09-18T11:00:22Z',
    content: 'payment succeeded for order ORD2002 (txn TXN2002)',
  },
  {
    timestamp: '2025-09-18T11:00:30Z',
    content: '{"level":"INFO","service":"queue","topic":"txn","lag":120}',
  },
  {
    timestamp: '2025-09-18T11:00:37Z',
    content:
      'level=WARN service=payment-service retries=1/3 op=charge reason=bank-5xx-hiccup',
  },
  {
    timestamp: '2025-09-18T11:00:45Z',
    content: 'payment succeeded after retry order ORD2003 (txn TXN2003)',
  },
  {
    timestamp: '2025-09-18T11:00:52Z',
    content:
      'level=INFO service=auth-service event=token_issued user=99123 latency_ms=40',
  },
  {
    timestamp: '2025-09-18T11:01:00Z',
    content:
      'near threshold: level=WARN service=payment-service metric=failure_rate value=0.9% baseline=0.3% window=2m',
  },
  {
    timestamp: '2025-09-18T11:01:07Z',
    content:
      '{"level":"INFO","service":"deploy","service_name":"bank-adapter","version":"v3.4.2","action":"completed"}',
  },
  {
    timestamp: '2025-09-18T11:01:15Z',
    content: 'open connections stable; db pool size=200 used=65',
  },
  {
    timestamp: '2025-09-18T11:01:22Z',
    content:
      'level=INFO service=payment-service op=capture status=OK ms=105 order=ORD2004',
  },
  {
    timestamp: '2025-09-18T11:01:30Z',
    content: 'WARN: circuit breaker half-open for bank-api (testing requests)',
  },
  {
    timestamp: '2025-09-18T11:01:37Z',
    content: 'payment succeeded for order ORD2005 (txn TXN2005)',
  },
  {
    timestamp: '2025-09-18T11:01:45Z',
    content:
      'level=WARN service=payment-service p95_latency_ms=620 baseline_ms=280 window=1m',
  },
];

/**
 * Tập 3
 * - Thành công + hệ thống; có vài lỗi FAIL/DOWN (DB connect, upstream 5xx, timeouts)
 */
export const logsSet3 = [
  {
    timestamp: '2025-09-18T12:15:00Z',
    content:
      'level=INFO service=payment-service op=authorize status=OK ms=140 order=ORD3001',
  },
  {
    timestamp: '2025-09-18T12:15:08Z',
    content: 'payment succeeded for order ORD3002 (txn TXN3002)',
  },
  {
    timestamp: '2025-09-18T12:15:16Z',
    content:
      'level=ERROR service=payment-service code=DB_CONN_FAIL db=db-prod host=10.2.0.15:5432 msg="could not connect"',
  },
  {
    timestamp: '2025-09-18T12:15:24Z',
    content:
      'could not connect to db-prod: dial tcp 10.2.0.15:5432: i/o timeout',
  },
  {
    timestamp: '2025-09-18T12:15:32Z',
    content:
      '{"level":"ERROR","service":"payment-service","stage":"init","msg":"connection pool exhausted","pool_size":50}',
  },
  {
    timestamp: '2025-09-18T12:15:40Z',
    content:
      'level=WARN service=bank-adapter name=upstream_slow p95_ms=2200 baseline_ms=300 bank=ABC',
  },
  {
    timestamp: '2025-09-18T12:15:48Z',
    content: 'bank-api returned 502 Bad Gateway',
  },
  {
    timestamp: '2025-09-18T12:15:56Z',
    content:
      'level=ERROR service=payment-service op=charge status=FAILED reason=TIMEOUT ms=5000 trace=tr-3007',
  },
  {
    timestamp: '2025-09-18T12:16:04Z',
    content:
      '{"level":"ERROR","service":"payment-service","error":"ECONNRESET","msg":"socket hang up"}',
  },
  {
    timestamp: '2025-09-18T12:16:12Z',
    content: 'open circuit to bank-api; fast-failing requests',
  },
  {
    timestamp: '2025-09-18T12:16:20Z',
    content:
      'level=INFO service=deploy service_name=payment-service version=v1.2.0 action=started by=ci-run-992',
  },
  {
    timestamp: '2025-09-18T12:16:28Z',
    content: 'txn TXN3008 aborted due to upstream latency > 5s',
  },
  { timestamp: '2025-09-18T12:16:36Z', content: 'rolling back deploy v1.2.0' },
  {
    timestamp: '2025-09-18T12:16:44Z',
    content: 'payment succeeded after retry order ORD3009 (txn TXN3009)',
  },
  {
    timestamp: '2025-09-18T12:16:52Z',
    content:
      'level=ERROR service=db-migrator step=apply version=20250918_120503 err=LOCK_TIMEOUT',
  },
];
