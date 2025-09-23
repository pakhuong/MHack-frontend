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
  Activity,
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
import type { AlertIncidenDetail } from '../types/ticket';
import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router-dom';
import { mockDataDetail } from './Tickets';

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

export default function TicketDetail({
  tag = 'incident',
}: {
  tag?: 'alert' | 'incident';
}) {
  const { id } = useParams();
  const [incident, setIncident] = useState<AlertIncidenDetail | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    (async () => {
      if (!id) return;

      setIncident(null);
      setLoading(true);

      try {
        const api = tag === 'alert' ? 'alerts' : 'incidents';
        const response = await axios.get(`http://localhost:3000/${api}/${id}`);
        setIncident(response.data);
      } catch (error) {
        console.error(`Failed to fetch ${tag} details:`, error);
        setIncident(mockDataDetail.find((item) => item._id === id) ?? null);
        // setIncident(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [tag, id]);

  const handleStatusChange = async (value: string) => {
    if (!incident || !id) return;
    try {
      const api = tag === 'alert' ? 'alerts' : 'incidents';
      const response = await axios.put(`/api/${api}/${id}`, {
        status: value,
      });
      setIncident(response.data);
    } catch (error) {
      console.error(`Failed to update ${tag} status:`, error);
    }
  };

  const handlePriorityChange = async (value: string) => {
    if (!incident || !id) return;
    try {
      const api = tag === 'alert' ? 'alerts' : 'incidents';
      const response = await axios.put(`/api/${api}/${id}`, {
        priority: value,
      });
      setIncident(response.data);
    } catch (error) {
      console.error(`Failed to update ${tag} priority:`, error);
    }
  };

  const handleSeverityChange = async (value: string) => {
    if (!incident || !id) return;
    try {
      const api = tag === 'alert' ? 'alerts' : 'incidents';
      const response = await axios.put(`/api/${api}/${id}`, {
        severity: value,
      });
      setIncident(response.data);
    } catch (error) {
      console.error(`Failed to update ${tag} severity:`, error);
    }
  };

  const handleAssigneeChange = async (value: string) => {
    if (!incident || !id) return;
    try {
      const api = tag === 'alert' ? 'alerts' : 'incidents';
      const response = await axios.put(`/api/${api}/${id}`, {
        assignee: value,
      });
      setIncident(response.data);
    } catch (error) {
      console.error(`Failed to update ${tag} assignee:`, error);
    }
  };

  const handleReporterChange = async (value: string) => {
    if (!incident || !id) return;
    try {
      const api = tag === 'alert' ? 'alerts' : 'incidents';
      const response = await axios.put(`/api/${api}/${id}`, {
        reporter: value,
      });
      setIncident(response.data);
    } catch (error) {
      console.error(`Failed to update ${tag} reporter:`, error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading {tag || 'item'} details...</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : 'Item'} Not
            Found
          </h2>
          <p className="text-gray-400">
            The {tag || 'item'} with ID "{id}" could not be found.
          </p>
        </div>
      </div>
    );
  }

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
                  {tag === 'alert'
                    ? `ALERT ${(incident as any).alert_id}`
                    : `INCIDENT ${(incident as any).incident_id}`}
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

        {/* Status Info */}
        <div className="flex items-center text-gray-400 text-sm mb-6">
          <Clock className="w-4 h-4 mr-1" />
          {tag === 'alert' ? 'Triggered' : 'Started'}:{' '}
          {formatDateTime(
            (incident as any).start_time || (incident as any).time
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Overview - Only for incidents */}
            {tag === 'incident' && incident.impact && (
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
                          {incident.impact.users?.toLocaleString() || 'N/A'}
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
                          {incident.impact.region || 'N/A'}
                        </p>
                        <p className="text-gray-400 text-sm">Region</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Anomalies */}
            {(incident as any).anomalies &&
              (incident as any).anomalies.length > 0 && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Activity className="w-5 h-5 mr-2 text-orange-500" />
                      Detected Anomalies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(incident as any).anomalies.map(
                        (anomaly: any, index: number) => (
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
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Log Clusters */}
            {(incident as any).log_clusters &&
              (incident as any).log_clusters.length > 0 && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Database className="w-5 h-5 mr-2 text-purple-500" />
                      Log Clusters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(incident as any).log_clusters.map(
                        (cluster: any, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-purple-500 text-purple-400 bg-purple-500/10"
                          >
                            {cluster}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Timeline */}
            {incident.timeline && incident.timeline.length > 0 && (
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
                          <p className="text-white font-medium">
                            {event.event}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {formatDateTime(event.time)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resolution */}
            {(incident.suggested_solution || incident.preventive_plan) && (
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
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Controls */}
            <Card className="bg-zinc-900 border-zinc-800 gap-0">
              <CardHeader>
                <CardTitle className="text-white text-md">
                  Status & Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Status
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
                        value={incident.status}
                        onChange={handleStatusChange}
                        className="w-full"
                        size="small"
                        style={{
                          backgroundColor: '#18181b',
                          borderColor: '#3f3f46',
                        }}
                        options={[
                          {
                            value: 'OPEN',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-xs">OPEN</span>
                              </div>
                            ),
                          },
                          {
                            value: 'IN_PROGRESS',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs">IN PROGRESS</span>
                              </div>
                            ),
                          },
                          {
                            value: 'RESOLVED',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs">RESOLVED</span>
                              </div>
                            ),
                          },
                          {
                            value: 'CLOSED',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                <span className="text-xs">CLOSED</span>
                              </div>
                            ),
                          },
                        ]}
                      />
                    </ConfigProvider>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Priority
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
                        value={incident.priority}
                        onChange={handlePriorityChange}
                        className="w-full"
                        size="small"
                        style={{
                          backgroundColor: '#18181b',
                          borderColor: '#3f3f46',
                        }}
                        options={[
                          {
                            value: 'LOW',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                <span className="text-xs">LOW</span>
                              </div>
                            ),
                          },
                          {
                            value: 'MEDIUM',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs">MEDIUM</span>
                              </div>
                            ),
                          },
                          {
                            value: 'HIGH',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs">HIGH</span>
                              </div>
                            ),
                          },
                          {
                            value: 'URGENT',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-xs">URGENT</span>
                              </div>
                            ),
                          },
                        ]}
                      />
                    </ConfigProvider>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Severity
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
                        value={incident.severity.toUpperCase()}
                        onChange={handleSeverityChange}
                        className="w-full"
                        size="small"
                        style={{
                          backgroundColor: '#18181b',
                          borderColor: '#3f3f46',
                        }}
                        options={[
                          {
                            value: 'CRITICAL',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-xs">CRITICAL</span>
                              </div>
                            ),
                          },
                          {
                            value: 'HIGH',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <span className="text-xs">HIGH</span>
                              </div>
                            ),
                          },
                          {
                            value: 'MEDIUM',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-xs">MEDIUM</span>
                              </div>
                            ),
                          },
                          {
                            value: 'LOW',
                            label: (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs">LOW</span>
                              </div>
                            ),
                          },
                        ]}
                      />
                    </ConfigProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment */}
            <Card className="bg-zinc-900 border-zinc-800 gap-0">
              <CardHeader>
                <CardTitle className="text-white text-md">Assignment</CardTitle>
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

            {/* Root Cause - Only for incidents */}
            {tag === 'incident' &&
              ((incident as any).change_event || incident.cause) && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Target className="w-5 h-5 mr-2 text-red-500 text-md" />
                      Root Cause
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(incident as any).change_event && (
                        <div className=" flex flex-col gap-2">
                          <p className="text-sm font-medium text-gray-400 mb-1">
                            Change Event
                          </p>
                          <div className="flex items-center space-x-2">
                            <GitBranch className="w-4 h-4 text-blue-500" />
                            <p className="text-gray-200 text-sm">
                              {(incident as any).change_event}
                            </p>
                          </div>
                        </div>
                      )}
                      {(incident as any).change_event && incident.cause && (
                        <Separator className="bg-zinc-700" />
                      )}
                      {incident.cause && (
                        <div className=" flex flex-col gap-2">
                          <p className="text-sm font-medium text-gray-400 mb-1">
                            Identified Cause
                          </p>
                          <p className="text-gray-200 text-sm">
                            {incident.cause}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
