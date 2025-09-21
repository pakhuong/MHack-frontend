import { useState } from 'react';
import {
  Clock,
  Users,
  MapPin,
  TrendingUp,
  TrendingDown,
  Database,
  GitBranch,
  CheckCircle,
  XCircle,
  Shield,
  Activity,
  Zap,
  Target,
  AlertTriangleIcon,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Select, ConfigProvider } from 'antd';
import { theme } from 'antd';
import type { AlerIncident } from '../types/ticket';

// Mock data for users
const mockUsers = [
  { id: 'john-doe', name: 'John Doe', email: 'john.doe@company.com' },
  { id: 'jane-smith', name: 'Jane Smith', email: 'jane.smith@company.com' },
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
  },
  {
    id: 'sarah-wilson',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
  },
  { id: 'system-monitor', name: 'System Monitor', email: 'system@company.com' },
  { id: 'unassigned', name: 'Unassigned', email: '' },
];

// Mock data for the incident
const mockTicket: AlerIncident = {
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
  status: 'OPEN',
  assignee: 'john-doe',
  reporter: 'system-monitor',
  priority: 'URGENT',
};

export default function TicketDetail() {
  const [incident, setIncident] = useState<AlerIncident>(mockTicket);

  const handleStatusChange = (value: string) => {
    setIncident((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleAssigneeChange = (value: string) => {
    setIncident((prev) => ({
      ...prev,
      assignee: value,
    }));
  };

  const handleReporterChange = (value: string) => {
    setIncident((prev) => ({
      ...prev,
      reporter: value,
    }));
  };

  const getUserById = (id: string) => {
    return (
      mockUsers.find((user) => user.id === id) ||
      mockUsers.find((user) => user.id === 'unassigned')
    );
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-600 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MEDIUM':
        return 'bg-blue-500 text-white';
      case 'LOW':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-500 text-white';
      case 'IN_PROGRESS':
        return 'bg-blue-500 text-white';
      case 'RESOLVED':
        return 'bg-green-500 text-white';
      case 'CLOSED':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-yellow-500 text-black';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getMetricIcon = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'failure_rate':
        return <XCircle className="w-4 h-4" />;
      case 'rps':
        return <Activity className="w-4 h-4" />;
      case 'response_time':
        return <Clock className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getChangeIcon = (change: string) => {
    if (change.startsWith('+')) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    } else if (change.startsWith('-')) {
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-2">
              {/* <AlertTriangle className="w-8 h-8 text-red-500" /> */}
              <AlertTriangleIcon color="red" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {incident.incident_id}
                </h1>
                <p className="text-gray-400 text-lg">{incident.service}</p>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300"
              style={{
                backgroundColor: '#18181b',
                borderColor: '#3f3f46',
              }}
            >
              <MoreHorizontal className="w-4 h-4" color="white" />
            </Button>
          </div> */}
        </div>

        {/* Status Badges */}
        <div className="flex items-center space-x-3 mb-6">
          <Badge className={getSeverityColor(incident.severity)}>
            <Shield className="w-3 h-3 mr-1" />
            {incident.severity.toUpperCase()}
          </Badge>
          <Badge className={getPriorityColor(incident.priority)}>
            <Zap className="w-3 h-3 mr-1" />
            {incident.priority}
          </Badge>

          {/* Status Select */}
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#3b82f6',
                colorBgBase: '#18181b',
                colorTextBase: '#f4f4f5',
                colorBgContainer: '#18181b',
                colorBorder: '#3f3f46',
                colorText: '#f4f4f5',
                colorTextSecondary: '#a1a1aa',
              },
            }}
          >
            <Select
              value={incident.status}
              onChange={handleStatusChange}
              className="min-w-[120px]"
              style={{
                backgroundColor: '#18181b',
                borderColor: '#3f3f46',
              }}
              options={[
                {
                  value: 'OPEN',
                  label: (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>OPEN</span>
                    </div>
                  ),
                },
                {
                  value: 'IN_PROGRESS',
                  label: (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>IN PROGRESS</span>
                    </div>
                  ),
                },
                {
                  value: 'RESOLVED',
                  label: (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>RESOLVED</span>
                    </div>
                  ),
                },
                {
                  value: 'CLOSED',
                  label: (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span>CLOSED</span>
                    </div>
                  ),
                },
              ]}
            />
          </ConfigProvider>

          <div className="flex items-center text-gray-400 text-sm ml-3">
            <Clock className="w-4 h-4 mr-1" />
            Started: {formatDateTime(incident.start_time)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Overview */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Users className="w-5 h-5 mr-2 text-red-500" />
                  Impact Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Users className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {incident.impact.users.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm">Affected Users</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <MapPin className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {incident.impact.region}
                      </p>
                      <p className="text-gray-400 text-sm">Region</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Anomalies */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Activity className="w-5 h-5 mr-2 text-orange-500" />
                  Detected Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incident.anomalies.map((anomaly, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getMetricIcon(anomaly.metric)}
                        <div>
                          <p className="font-medium text-white capitalize">
                            {anomaly.metric.replace('_', ' ')}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Current: {anomaly.value}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getChangeIcon(anomaly.change)}
                        <span
                          className={`font-bold ${
                            anomaly.change.startsWith('+')
                              ? 'text-red-500'
                              : 'text-green-500'
                          }`}
                        >
                          {anomaly.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Log Clusters */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Database className="w-5 h-5 mr-2 text-purple-500" />
                  Log Clusters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {incident.log_clusters.map((cluster, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-purple-500 text-purple-400 bg-purple-500/10"
                    >
                      {cluster}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Incident Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incident.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        {index < incident.timeline.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-600 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{event.event}</p>
                        <p className="text-gray-400 text-sm">
                          {formatDateTime(event.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Assignee
                  </label>
                  <ConfigProvider
                    theme={{
                      algorithm: theme.darkAlgorithm,
                      token: {
                        colorPrimary: '#3b82f6',
                        colorBgBase: '#18181b',
                        colorTextBase: '#f4f4f5',
                        colorBgContainer: '#18181b',
                        colorBorder: '#3f3f46',
                        colorText: '#f4f4f5',
                        colorTextSecondary: '#a1a1aa',
                      },
                    }}
                  >
                    <Select
                      value={incident.assignee}
                      onChange={handleAssigneeChange}
                      className="w-full"
                      size="large"
                      style={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                      }}
                      options={mockUsers.map((user) => ({
                        value: user.id,
                        label: (
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {getUserInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">{user.name}</div>
                              {user.email && (
                                <div className="text-xs text-gray-400">
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      }))}
                    />
                  </ConfigProvider>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Reporter
                  </label>
                  <ConfigProvider
                    theme={{
                      algorithm: theme.darkAlgorithm,
                      token: {
                        colorPrimary: '#3b82f6',
                        colorBgBase: '#18181b',
                        colorTextBase: '#f4f4f5',
                        colorBgContainer: '#18181b',
                        colorBorder: '#3f3f46',
                        colorText: '#f4f4f5',
                        colorTextSecondary: '#a1a1aa',
                      },
                    }}
                  >
                    <Select
                      value={incident.reporter}
                      onChange={handleReporterChange}
                      className="w-full"
                      size="large"
                      style={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                      }}
                      options={mockUsers.map((user) => ({
                        value: user.id,
                        label: (
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="bg-green-500 text-white text-xs">
                                {getUserInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">{user.name}</div>
                              {user.email && (
                                <div className="text-xs text-gray-400">
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      }))}
                    />
                  </ConfigProvider>
                </div>
              </CardContent>
            </Card>

            {/* Root Cause */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Target className="w-5 h-5 mr-2 text-red-500" />
                  Root Cause
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className=" flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      Change Event
                    </p>
                    <div className="flex items-center space-x-2">
                      <GitBranch className="w-4 h-4 text-blue-500" />
                      <p className="text-gray-200 text-sm">
                        {incident.change_event}
                      </p>
                    </div>
                  </div>
                  <Separator className="bg-zinc-700" />
                  <div className=" flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      Identified Cause
                    </p>
                    <p className="text-gray-200 text-sm">{incident.cause}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resolution */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Resolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className=" flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-400 mb-2">
                      Suggested Solution
                    </p>
                    <p className="text-gray-200 text-sm bg-zinc-800 p-3 rounded-lg">
                      {incident.suggested_solution}
                    </p>
                  </div>
                  <div className=" flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-400 mb-2">
                      Preventive Plan
                    </p>
                    <p className="text-gray-200 text-sm bg-zinc-800 p-3 rounded-lg">
                      {incident.preventive_plan}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
