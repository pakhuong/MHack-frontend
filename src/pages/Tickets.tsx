import { useState, type ReactNode } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Input, Select, Empty, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import type { AlerIncident, TicketSeverity } from '../types/ticket';
import { severityColors } from '../types/ticket';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
const { Search } = Input;

// Mock data
const mockData: AlerIncident[] = [
  {
    incident_id: 'INC-20250918-01',
    service: 'payment-service',
    start_time: '2025-09-18T10:05:00Z',
    severity: 'critical',
    impact: {
      users: 5000,
      region: 'VN',
    },
    anomalies: [
      {
        metric: 'failure_rate',
        change: '+12%',
        value: '12.3%',
      },
      {
        metric: 'rps',
        change: '-3500',
        value: '6000',
      },
    ],
    log_clusters: ['DB_CONN_FAIL'],
    change_event: 'deploy v1.2.0 at 10:03',
    cause: 'DB connection pool misconfiguration after deploy',
    timeline: [
      {
        time: '2025-09-18T10:03:00Z',
        event: 'deploy v1.2.0',
      },
      {
        time: '2025-09-18T10:05:00Z',
        event: 'failure_rate_spike + DB_CONN_FAIL',
      },
      {
        time: '2025-09-18T10:07:00Z',
        event: 'incident escalated',
      },
    ],
    suggested_solution: 'Revert deploy v1.2.0, increase DB pool size to 500',
    preventive_plan: 'Run DB stress test in CI/CD before deploy',
    status: '',
    assignee: '',
    reporter: '',
    priority: '',
  },
  {
    incident_id: 'INC-20250918-01',
    service: 'payment-service',
    start_time: '2025-09-18T10:05:00Z',
    severity: 'critical',
    impact: {
      users: 5000,
      region: 'VN',
    },
    anomalies: [
      {
        metric: 'failure_rate',
        change: '+12%',
        value: '12.3%',
      },
      {
        metric: 'rps',
        change: '-3500',
        value: '6000',
      },
    ],
    log_clusters: ['DB_CONN_FAIL'],
    change_event: 'deploy v1.2.0 at 10:03',
    cause: 'DB connection pool misconfiguration after deploy',
    timeline: [
      {
        time: '2025-09-18T10:03:00Z',
        event: 'deploy v1.2.0',
      },
      {
        time: '2025-09-18T10:05:00Z',
        event: 'failure_rate_spike + DB_CONN_FAIL',
      },
      {
        time: '2025-09-18T10:07:00Z',
        event: 'incident escalated',
      },
    ],
    suggested_solution: 'Revert deploy v1.2.0, increase DB pool size to 500',
    preventive_plan: 'Run DB stress test in CI/CD before deploy',
    status: '',
    assignee: '',
    reporter: '',
    priority: '',
  },
  {
    incident_id: 'INC-20250918-01',
    service: 'payment-service',
    start_time: '2025-09-18T10:05:00Z',
    severity: 'critical',
    impact: {
      users: 5000,
      region: 'VN',
    },
    anomalies: [
      {
        metric: 'failure_rate',
        change: '+12%',
        value: '12.3%',
      },
      {
        metric: 'rps',
        change: '-3500',
        value: '6000',
      },
    ],
    log_clusters: ['DB_CONN_FAIL'],
    change_event: 'deploy v1.2.0 at 10:03',
    cause: 'DB connection pool misconfiguration after deploy',
    timeline: [
      {
        time: '2025-09-18T10:03:00Z',
        event: 'deploy v1.2.0',
      },
      {
        time: '2025-09-18T10:05:00Z',
        event: 'failure_rate_spike + DB_CONN_FAIL',
      },
      {
        time: '2025-09-18T10:07:00Z',
        event: 'incident escalated',
      },
    ],
    suggested_solution: 'Revert deploy v1.2.0, increase DB pool size to 500',
    preventive_plan: 'Run DB stress test in CI/CD before deploy',
    status: '',
    assignee: '',
    reporter: '',
    priority: '',
  },
  {
    incident_id: 'INC-20250918-01',
    service: 'payment-service',
    start_time: '2025-09-18T10:05:00Z',
    severity: 'critical',
    impact: {
      users: 5000,
      region: 'VN',
    },
    anomalies: [
      {
        metric: 'failure_rate',
        change: '+12%',
        value: '12.3%',
      },
      {
        metric: 'rps',
        change: '-3500',
        value: '6000',
      },
    ],
    log_clusters: ['DB_CONN_FAIL'],
    change_event: 'deploy v1.2.0 at 10:03',
    cause: 'DB connection pool misconfiguration after deploy',
    timeline: [
      {
        time: '2025-09-18T10:03:00Z',
        event: 'deploy v1.2.0',
      },
      {
        time: '2025-09-18T10:05:00Z',
        event: 'failure_rate_spike + DB_CONN_FAIL',
      },
      {
        time: '2025-09-18T10:07:00Z',
        event: 'incident escalated',
      },
    ],
    suggested_solution: 'Revert deploy v1.2.0, increase DB pool size to 500',
    preventive_plan: 'Run DB stress test in CI/CD before deploy',
    status: '',
    assignee: '',
    reporter: '',
    priority: '',
  },
];

const TicketPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const columns: ProColumns<AlerIncident>[] = [
    {
      title: 'ID',
      dataIndex: 'incident_id',
      key: 'incident_id',
      width: 100,
      render: (dom: ReactNode, record: AlerIncident) => (
        <span className="text-blue-600 font-medium">{record.incident_id}</span>
      ),
    },
    {
      title: 'SERVICE',
      dataIndex: 'service',
      key: 'service',
      width: 180,
      render: (dom: ReactNode, record: AlerIncident) => (
        <span className="text-white font-bold">{record.service}</span>
      ),
    },
    {
      title: 'START TIME',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 180,
      render: (dom: ReactNode, record: AlerIncident) => (
        <span className="text-gray-200 font-medium">
          {dayjs(record.start_time).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'SEVERITY',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (dom: ReactNode, record: AlerIncident) => (
        <Tag
          className={`text-white px-3 py-1 rounded-full`}
          color={severityColors[record.severity as TicketSeverity]}
        >
          {record.severity}
        </Tag>
      ),
      filters: [
        { text: 'Critical', value: 'critical' },
        { text: 'High', value: 'high' },
        { text: 'Medium', value: 'medium' },
      ],
    },
    {
      title: 'CAUSE',
      dataIndex: 'cause',
      key: 'cause',
      width: 400,
    },
  ];

  const toolBarRender = () => [
    <Search
      key="search"
      placeholder="Search incidents..."
      className="w-64"
      allowClear
    />,
    // <Select
    //   key="status"
    //   placeholder="Status: All"
    //   className="w-40"
    //   allowClear
    //   showSearch
    //   optionFilterProp="children"
    // >
    //   <Select.Option value="CLOSED">CLOSED</Select.Option>
    //   <Select.Option value="RECOVERED">RECOVERED</Select.Option>
    //   <Select.Option value="RECOVERING">RECOVERING</Select.Option>
    //   <Select.Option value="OPEN">OPEN</Select.Option>
    // </Select>,
    <Select
      key="severity"
      placeholder="Severity: All"
      className="w-40"
      allowClear
      showSearch
      optionFilterProp="children"
    >
      <Select.Option value="critical">Critical</Select.Option>
      <Select.Option value="high">High</Select.Option>
      <Select.Option value="medium">Medium</Select.Option>
    </Select>,
    // <Button key="create" type="primary" icon={<Plus color="black" />}>
    //   <span className="text-black">Create Ticket</span>
    // </Button>,
  ];

  const customEmpty = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 mb-4">No tickets found</p>
          <Button type="primary" icon={<Plus color="black" />}>
            <span className="text-black">Create New Ticket</span>
          </Button>
        </div>
      }
    />
  );

  return (
    <ConfigProvider locale={enUS}>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Alert Incident Management
          </h1>
          <p className="text-gray-600">
            Manage and track alert incidents effectively
          </p>
        </div>

        <ProTable<AlerIncident>
          columns={columns}
          rowKey="id"
          search={false}
          dateFormatter="string"
          // headerTitle="INCIDENT TICKET (IS)"
          toolBarRender={toolBarRender}
          locale={{
            emptyText: customEmpty(),
            selectionAll: 'Select All',
            selectNone: 'Clear All',
            selectInvert: 'Invert Selection',
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys as string[]);
            },
          }}
          tooltip={{
            title: 'ALERT INCIDENT MANAGEMENT',
            placement: 'top',
          }}
          onRow={(record) => ({
            onClick: () => {
              navigate(`/alert-incident-management/${record.incident_id}`);
            },
          })}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            locale: {
              items_per_page: '/ page',
              jump_to: 'Go to',
              jump_to_confirm: 'confirm',
              page: 'Page',
              prev_page: 'Previous Page',
              next_page: 'Next Page',
              prev_5: 'Previous 5 Pages',
              next_5: 'Next 5 Pages',
            },
          }}
          request={async () => {
            // Simulating API call with mock data
            return {
              data: mockData,
              success: true,
              total: mockData.length,
            };
          }}
          className="bg-white rounded-lg shadow-sm"
        />
      </div>
    </ConfigProvider>
  );
};

export default TicketPage;
