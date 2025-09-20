import { useState, type ReactNode } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Input, Select, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Ticket } from '../types/ticket';
import {
  ticketStatusColors,
  severityColors,
  incidentTypeColors,
} from '../types/ticket';
import { Plus } from 'lucide-react';

const { Search } = Input;

// Mock data
const mockData: Ticket[] = [
  {
    id: 'IS-0296',
    summary: 'Lượng request tăng, nhiều queue BE đang bị nghẽn',
    status: 'CLOSED',
    severity: 'S3',
    incidentType: 'ĐANG XẢY RA',
    created: '2025-09-19 17:59:02',
    updated: '2025-09-19 18:15:23',
  },
  {
    id: 'IS-0295',
    summary: 'Lượng request tăng, nhiều queue BE đang bị nghẽn',
    status: 'CLOSED',
    severity: 'S3',
    incidentType: 'ĐANG XẢY RA',
    created: '2025-09-19 17:57:13',
    updated: '2025-09-19 17:58:45',
  },
  {
    id: 'IS-0291',
    summary: 'Giao dịch chậm ảnh hưởng hệ thống',
    status: 'RECOVERED',
    severity: 'S3',
    incidentType: 'ĐANG XẢY RA',
    created: '2025-09-12 12:16:23',
    updated: '2025-09-12 17:45:12',
  },
  {
    id: 'IS-0289',
    summary: 'Giao dịch chậm, ảnh hưởng toàn hệ thống',
    status: 'RECOVERED',
    severity: 'S1',
    incidentType: 'ĐANG XẢY RA',
    created: '2025-09-10 20:58:42',
    updated: '2025-09-10 23:15:00',
  },
  {
    id: 'IS-0288',
    summary: 'Dừng giao dịch để xử lý chậm giao dịch',
    status: 'CLOSED',
    severity: 'S1',
    incidentType: 'ĐANG XẢY RA',
    created: '2025-09-10 20:30:53',
    updated: '2025-09-10 20:45:12',
  },
];

const TicketPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const columns: ProColumns<Ticket>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (dom: ReactNode, record: Ticket) => (
        <span className="text-purple-600 font-medium">{record.id}</span>
      ),
    },
    {
      title: 'SUMMARY',
      dataIndex: 'summary',
      key: 'summary',
      width: 400,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (dom: ReactNode, record: Ticket) => (
        <Tag
          className={`${ticketStatusColors[record.status]} px-3 py-1 rounded-full`}
        >
          {record.status}
        </Tag>
      ),
      filters: [
        { text: 'CLOSED', value: 'CLOSED' },
        { text: 'RECOVERED', value: 'RECOVERED' },
        { text: 'RECOVERING', value: 'RECOVERING' },
        { text: 'OPEN', value: 'OPEN' },
      ],
    },
    {
      title: 'SEVERITY',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (dom: ReactNode, record: Ticket) => (
        <Tag
          className={`${severityColors[record.severity]} px-3 py-1 rounded-full`}
        >
          {record.severity}
        </Tag>
      ),
      filters: [
        { text: 'S1 - Critical', value: 'S1' },
        { text: 'S2 - High', value: 'S2' },
        { text: 'S3 - Medium', value: 'S3' },
      ],
    },
    {
      title: 'INCIDENT TYPE',
      dataIndex: 'incidentType',
      key: 'incidentType',
      width: 150,
      render: (dom: ReactNode, record: Ticket) => (
        <Tag
          className={`${incidentTypeColors[record.incidentType]} px-3 py-1 rounded-full`}
        >
          {record.incidentType}
        </Tag>
      ),
      filters: [
        { text: 'ĐANG XẢY RA', value: 'ĐANG XẢY RA' },
        { text: 'ĐÃ GIẢI QUYẾT', value: 'ĐÃ GIẢI QUYẾT' },
      ],
    },
    {
      title: 'CREATED',
      dataIndex: 'created',
      key: 'created',
      width: 180,
      sorter: true,
    },
    {
      title: 'UPDATED',
      dataIndex: 'updated',
      key: 'updated',
      width: 180,
      sorter: true,
    },
  ];

  const toolBarRender = () => [
    <Search
      key="search"
      placeholder="Search tickets..."
      className="w-64"
      allowClear
    />,
    <Select
      key="status"
      placeholder="Status: All"
      className="w-40"
      allowClear
      showSearch
      optionFilterProp="children"
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
    >
      <Select.Option value="S1">S1 - Critical</Select.Option>
      <Select.Option value="S2">S2 - High</Select.Option>
      <Select.Option value="S3">S3 - Medium</Select.Option>
    </Select>,
    <Select
      key="incidentType"
      placeholder="Incident Type: All"
      className="w-44"
      allowClear
      showSearch
      optionFilterProp="children"
    >
      <Select.Option value="ĐANG XẢY RA">ĐANG XẢY RA</Select.Option>
      <Select.Option value="ĐÃ GIẢI QUYẾT">ĐÃ GIẢI QUYẾT</Select.Option>
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
          <p className="text-gray-500 mb-4">No tickets found</p>
          <Button type="primary" icon={<Plus color="black" />}>
            <span className="text-black">Create New Ticket</span>
          </Button>
        </div>
      }
    />
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-600">
          Ticket Management System
        </h1>
        <p className="text-gray-600">
          Manage and track system incidents effectively
        </p>
      </div>

      <ProTable<Ticket>
        columns={columns}
        rowKey="id"
        search={false}
        dateFormatter="string"
        headerTitle="INCIDENT TICKET (IS)"
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
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
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
  );
};

export default TicketPage;
