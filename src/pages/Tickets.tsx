import { useState, useEffect, type ReactNode } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Input, Select, Empty, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import type {
  AlertIncident,
  TicketPriority,
  TicketSeverity,
  TicketStatus,
} from '../types/ticket';
import {
  priorityColors,
  severityColors,
  tagColors,
  ticketStatusColors,
} from '../types/ticket';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import React from 'react';
import axios from 'axios';

const { Search } = Input;
import { v4 as uuidv4 } from 'uuid';
// Mock data
// export const mockDataDetail: AlertIncidenDetail[] = [
//   {
//     _id: uuidv4(),
//     incident_id: 'INC-20250918-01',
//     service: 'payment-service',
//     time: '2025-09-18T10:05:00Z',
//     severity: 'critical',
//     status: 'OPEN',
//     priority: 'HIGH',
//     cause: 'Payment service is not working',
//     suggested_solution: 'Restart the payment service',
//     preventive_plan: 'Restart the payment service',
//     assignee: 'John Doe',
//     reporter: 'John Doe',
//     start_time: '2025-09-18T10:05:00Z',
//     impact: {
//       users: 5000,
//       region: 'VN',
//     },
//     anomalies: [
//       {
//         metric: 'failure_rate',
//         change: '+12%',
//         value: '12.3%',
//       },
//     ],
//     log_clusters: ['DB_CONN_FAIL'],
//     change_event: 'traffic surge',
//     timeline: [
//       {
//         time: '2025-09-18T10:05:00Z',
//         event: 'traffic surge',
//       },
//     ],
//   },
//   {
//     _id: uuidv4(),
//     alert_id: 'ALERT-20250918-01',
//     time: '2025-09-18T10:05:00Z',
//     service: 'payment-service',
//     severity: 'warning',
//     status: 'OPEN',
//     priority: 'HIGH',
//     cause: 'Payment service is not working',
//     suggested_solution: 'Restart the payment service',
//     preventive_plan: 'Restart the payment service',
//     assignee: 'John Doe',
//     reporter: 'John Doe',
//     metric: {
//       name: 'failure_rate',
//       value: '12.3%',
//       baseline: '10%',
//       change: '+12%',
//     },
//     impact: {
//       users: 5000,
//       region: 'VN',
//     },
//     timeline: [
//       {
//         time: '2025-09-18T10:05:00Z',
//         event: 'traffic surge',
//       },
//     ],
//   },
//   {
//     _id: uuidv4(),
//     incident_id: 'INC-20250918-02',
//     service: 'user-service',
//     time: '2025-09-18T09:30:00Z',
//     severity: 'high',
//     status: 'RECOVERING',
//     priority: 'MEDIUM',
//     cause: 'User service is not working',
//     suggested_solution: 'Restart the user service',
//     preventive_plan: 'Restart the user service',
//     assignee: 'John Doe',
//     reporter: 'John Doe',
//     start_time: '2025-09-18T09:30:00Z',
//     impact: {
//       users: 2000,
//       region: 'US',
//     },
//     anomalies: [
//       {
//         metric: 'failure_rate',
//         change: '+12%',
//         value: '12.3%',
//       },
//     ],
//     log_clusters: ['DB_CONN_FAIL'],
//     change_event: 'traffic surge',
//     timeline: [
//       {
//         time: '2025-09-18T09:30:00Z',
//         event: 'traffic surge',
//       },
//       {
//         time: '2025-09-18T09:30:00Z',
//         event: 'traffic surge',
//       },
//     ],
//   },
//   {
//     _id: uuidv4(),
//     alert_id: 'ALERT-20250918-02',
//     service: 'database-service',
//     time: '2025-09-18T08:15:00Z',
//     severity: 'medium',
//     status: 'CLOSED',
//     priority: 'LOW',
//     cause: 'Database service is not working',
//     suggested_solution: 'Restart the database service',
//     preventive_plan: 'Restart the database service',
//     assignee: 'John Doe',
//     reporter: 'John Doe',
//     metric: {
//       name: 'failure_rate',
//       value: '12.3%',
//       baseline: '10%',
//       change: '+12%',
//     },
//     impact: {
//       users: 5000,
//       region: 'VN',
//     },
//     timeline: [],
//   },
//   {
//     _id: uuidv4(),
//     incident_id: 'INC-20250917-01',
//     service: 'api-gateway',
//     time: '2025-09-17T16:45:00Z',
//     severity: 'critical',
//     status: 'RECOVERED',
//     priority: 'HIGH',
//     cause: 'Database service is not working',
//     suggested_solution: 'Restart the database service',
//     preventive_plan: 'Restart the database service',
//     assignee: 'John Doe',
//     reporter: 'John Doe',
//     timeline: [],
//     start_time: '2025-09-17T16:45:00Z',
//     impact: {
//       users: 2000,
//       region: 'US',
//     },
//     anomalies: [],
//     log_clusters: [],
//     change_event: 'traffic surge',
//   },
//   {
//     _id: uuidv4(),
//     alert_id: 'ALERT-20250917-01',
//     service: 'monitoring-service',
//     time: '2025-09-17T14:20:00Z',
//     severity: 'low',
//     status: 'CLOSED',
//     priority: 'LOW',
//     cause: 'Database service is not working',
//     suggested_solution: 'Restart the database service',
//     preventive_plan: 'Restart the database service',
//     assignee: 'John Doe',
//     reporter: 'John Doe',
//     metric: {
//       name: 'failure_rate',
//       value: '12.3%',
//       baseline: '10%',
//       change: '+12%',
//     },
//     impact: {
//       users: 2000,
//       region: 'US',
//     },
//     timeline: [],
//   },
// ];

// const mockData: AlertIncident[] = mockDataDetail.map((item) => {
//   if ('incident_id' in item) {
//     return {
//       _id: item._id,
//       id: item.incident_id,
//       tag: 'incident',
//       time: item.start_time,
//       service: item.service,
//       severity: item.severity,
//       status: item.status,
//       priority: item.priority,
//     };
//   }
//   return {
//     _id: item._id,
//     id: item.alert_id,
//     tag: 'alert',
//     time: item.time,
//     service: item.service,
//     severity: item.severity,
//     status: item.status,
//     priority: item.priority,
//   };
// });

const TicketPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [severityFilter, setSeverityFilter] = useState<string | undefined>(
    undefined
  );
  const [filteredData, setFilteredData] = useState<AlertIncident[]>([]);
  const navigate = useNavigate();

  const [data, setData] = useState<AlertIncident[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setData([]);
      Promise.allSettled([
        axios
          .get('http://localhost:3000/incidents')
          .then((response) => {
            return response;
          })
          .catch((error) => {
            return { status: 'rejected' };
          }),
        axios
          .get('http://localhost:3000/alerts')
          .then((response) => {
            return response;
          })
          .catch((error) => {
            return { status: 'rejected' };
          }),
      ])
        .then((results) => {
          console.log('API Results:', results);

          const ticketsData =
            results[0].status === 'fulfilled'
              ? results[0].value.data.map(
                  (ticket: {
                    _id: string;
                    incident_id: string;
                    start_time: string;
                    service: string;
                    severity: string;
                    status: string;
                    priority: string;
                  }) => ({
                    _id: ticket.id,
                    id: ticket.incident_id,
                    time: ticket.start_time,
                    service: ticket.service,
                    severity: ticket.severity,
                    status: ticket.status,
                    priority: ticket.priority,
                    tag: 'incident',
                  })
                )
              : [];

          const alertsData =
            results[1].status === 'fulfilled'
              ? results[1].value.data.map(
                  (alert: {
                    _id: string;
                    alert_id: string;
                    time: string;
                    service: string;
                    severity: string;
                    status: string;
                    priority: string;
                  }) => ({
                    _id: alert._id,
                    id: alert.alert_id,
                    time: alert.time,
                    service: alert.service,
                    severity: alert.severity,
                    status: alert.status,
                    priority: alert.priority,
                    tag: 'alert',
                  })
                )
              : [];

          const combinedData = [...ticketsData, ...alertsData];

          setData(combinedData);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          console.log('Falling back to mock data');
          setData([]);
        })
        .finally(() => {
          setLoading(false);
        });
    })();
    // setData(mockData);
  }, []);

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = data;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(searchText.toLowerCase()) ||
          item.service.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Tag filter
    if (tagFilter) {
      filtered = filtered.filter((item) => item.tag === tagFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Severity filter
    if (severityFilter) {
      filtered = filtered.filter((item) => item.severity === severityFilter);
    }

    setFilteredData(filtered);
  }, [data, searchText, tagFilter, statusFilter, severityFilter]);

  const columns: ProColumns<AlertIncident>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (dom: ReactNode, record: AlertIncident) => (
        <span className="text-white font-medium">{record.id}</span>
      ),
    },
    {
      title: 'TYPE',
      dataIndex: 'tag',
      key: 'tag',
      width: 100,
      render: (dom: ReactNode, record: AlertIncident) => (
        <Tag
          className={`text-white px-3 py-1 rounded-full`}
          color={tagColors[record.tag]}
        >
          {record.tag}
        </Tag>
      ),
    },
    {
      title: 'SERVICE',
      dataIndex: 'service',
      key: 'service',
      width: 180,
      render: (dom: ReactNode, record: AlertIncident) => (
        <span className="text-white font-bold">{record.service}</span>
      ),
    },
    {
      title: 'TIME',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (dom: ReactNode, record: AlertIncident) => (
        <span className="text-gray-200 font-medium">
          {dayjs(record.time).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
      sorter: true,
    },
    {
      title: 'SEVERITY',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (dom: ReactNode, record: AlertIncident) => (
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
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (dom: ReactNode, record: AlertIncident) => (
        <Tag
          className={`text-white px-3 py-1 rounded-full`}
          color={ticketStatusColors[record.status as TicketStatus]}
        >
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'PRIORITY',
      dataIndex: 'priority',
      key: 'priority',
      width: 200,
      render: (dom: ReactNode, record: AlertIncident) => (
        <Tag
          className={`text-white px-3 py-1 rounded-full`}
          color={priorityColors[record.priority as TicketPriority]}
        >
          {record.priority}
        </Tag>
      ),
    },
  ];

  const toolBarRender = () => [
    <Search
      key="search"
      placeholder="Search incidents..."
      className="w-64"
      allowClear
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onSearch={(value) => setSearchText(value)}
    />,
    <Select
      key="tag"
      placeholder="Tag: All"
      className="w-40"
      allowClear
      showSearch
      optionFilterProp="children"
      value={tagFilter}
      onChange={(value) => setTagFilter(value)}
    >
      <Select.Option value="incident">INCIDENT</Select.Option>
      <Select.Option value="alert">ALERT</Select.Option>
    </Select>,
    <Select
      key="status"
      placeholder="Status: All"
      className="w-40"
      allowClear
      showSearch
      optionFilterProp="children"
      value={statusFilter}
      onChange={(value) => setStatusFilter(value)}
    >
      <Select.Option value="CLOSED">CLOSED</Select.Option>
      <Select.Option value="RECOVERED">RECOVERED</Select.Option>
      <Select.Option value="RECOVERING">RECOVERING</Select.Option>
      <Select.Option value="OPEN">OPEN</Select.Option>
    </Select>,
    <Select
      key="severity"
      placeholder="Severity: All"
      className="w-40"
      allowClear
      showSearch
      optionFilterProp="children"
      value={severityFilter}
      onChange={(value) => setSeverityFilter(value)}
    >
      <Select.Option value="critical">Critical</Select.Option>
      <Select.Option value="high">High</Select.Option>
      <Select.Option value="medium">Medium</Select.Option>
      <Select.Option value="low">Low</Select.Option>
    </Select>,
    <Button key="create" type="primary" icon={<Plus color="black" />}>
      <span className="text-black">Create Ticket</span>
    </Button>,
  ];

  const customEmpty = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="text-center">
          <p className="text-gray-500 mb-4">No incidents/alerts found</p>
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

        <ProTable<AlertIncident>
          columns={columns}
          rowKey="id"
          search={false}
          dateFormatter="string"
          // headerTitle="INCIDENT TICKET (IS)"
          toolBarRender={toolBarRender}
          key={`table-${filteredData.length}-${searchText}-${tagFilter}-${statusFilter}-${severityFilter}`}
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
              if (record.tag === 'incident') {
                navigate(`/alert-incident-management/incident/${record._id}`);
              } else {
                navigate(`/alert-incident-management/alert/${record._id}`);
              }
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
            // Simulating API call with filtered data
            return {
              data: filteredData,
              success: true,
              total: filteredData.length,
            };
          }}
          loading={loading}
          className="bg-white rounded-lg shadow-sm"
        />
      </div>
    </ConfigProvider>
  );
};

export default TicketPage;
