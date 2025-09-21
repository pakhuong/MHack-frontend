import { useState, useRef, useEffect } from 'react';
import { Input, Button, Layout, Spin, Tabs, Card, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import type {
  Message as MessageType,
  Conversation,
  MessageRole,
} from '../types/chat';
import type { AlerIncident } from '../types/ticket';
import { Message } from '../components/chat/message';
import EmptyState from '../components/chat/empty-state';
import {
  AlertTriangle,
  BookOpen,
  FileText,
  LoaderIcon,
  Send,
  User,
} from 'lucide-react';

const { Content } = Layout;

// Mock data for threads
interface ThreadMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  replies?: ThreadMessage[];
}

interface Thread {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  participants: {
    name: string;
    avatar: string;
    role: string;
  }[];
  messages: ThreadMessage[];
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

const mockThreads: Thread[] = [
  {
    id: 'thread-001',
    title: 'Payment Gateway Performance Issues',
    description:
      'Investigating intermittent timeouts and slow response times in the payment processing system',
    status: 'active',
    priority: 'high',
    tags: ['payment', 'performance', 'urgent'],
    participants: [
      {
        name: 'Sarah Chen',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        role: 'DevOps Engineer',
      },
      {
        name: 'Mike Johnson',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        role: 'Backend Developer',
      },
      {
        name: 'Alex Kim',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        role: 'Site Reliability Engineer',
      },
    ],
    messages: [
      {
        id: 'msg-001',
        user: {
          name: 'Sarah Chen',
          avatar:
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
          role: 'DevOps Engineer',
        },
        content:
          "We're seeing increased latency in payment processing. Response times have gone from 200ms to 2-3 seconds. This started around 14:30 UTC.",
        timestamp: '2025-01-20T14:35:00Z',
        reactions: [
          {
            emoji: '👀',
            count: 3,
            users: ['Mike Johnson', 'Alex Kim', 'John Doe'],
          },
          { emoji: '🚨', count: 2, users: ['Alex Kim', 'John Doe'] },
        ],
      },
      {
        id: 'msg-002',
        user: {
          name: 'Mike Johnson',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          role: 'Backend Developer',
        },
        content:
          'Checking database connection pool metrics now. Could be related to the recent deployment.',
        timestamp: '2025-01-20T14:37:00Z',
        reactions: [
          { emoji: '👍', count: 2, users: ['Sarah Chen', 'Alex Kim'] },
        ],
      },
      {
        id: 'msg-003',
        user: {
          name: 'Alex Kim',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          role: 'Site Reliability Engineer',
        },
        content:
          "I'm seeing connection pool exhaustion in the logs. Max connections reached at 14:32 UTC. We need to either increase pool size or investigate connection leaks.",
        timestamp: '2025-01-20T14:42:00Z',
        reactions: [
          {
            emoji: '🎯',
            count: 4,
            users: ['Sarah Chen', 'Mike Johnson', 'John Doe', 'Jane Smith'],
          },
        ],
      },
    ],
    createdAt: '2025-01-20T14:35:00Z',
    updatedAt: '2025-01-20T14:42:00Z',
    messageCount: 8,
  },
  {
    id: 'thread-002',
    title: 'Database Migration Rollback Plan',
    description:
      'Planning rollback strategy for the upcoming database schema migration',
    status: 'active',
    priority: 'medium',
    tags: ['database', 'migration', 'planning'],
    participants: [
      {
        name: 'John Doe',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        role: 'Database Administrator',
      },
      {
        name: 'Jane Smith',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
        role: 'Backend Developer',
      },
    ],
    messages: [
      {
        id: 'msg-004',
        user: {
          name: 'John Doe',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          role: 'Database Administrator',
        },
        content:
          'We need to prepare a comprehensive rollback plan for the schema migration scheduled for next week. What are the critical checkpoints we should monitor?',
        timestamp: '2025-01-20T10:15:00Z',
      },
      {
        id: 'msg-005',
        user: {
          name: 'Jane Smith',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
          role: 'Backend Developer',
        },
        content:
          'Key metrics to watch: query performance, connection counts, and data integrity checks. We should also have automated tests ready to validate the migration.',
        timestamp: '2025-01-20T10:22:00Z',
        reactions: [{ emoji: '✅', count: 1, users: ['John Doe'] }],
      },
    ],
    createdAt: '2025-01-20T10:15:00Z',
    updatedAt: '2025-01-20T10:22:00Z',
    messageCount: 5,
  },
  {
    id: 'thread-003',
    title: 'Security Audit Findings - API Endpoints',
    description: 'Discussion of security vulnerabilities found in recent audit',
    status: 'resolved',
    priority: 'urgent',
    tags: ['security', 'api', 'audit'],
    participants: [
      {
        name: 'Security Team',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        role: 'Security Engineer',
      },
    ],
    messages: [
      {
        id: 'msg-006',
        user: {
          name: 'Security Team',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          role: 'Security Engineer',
        },
        content:
          'Found several API endpoints without proper rate limiting. This could lead to DoS attacks. Immediate action required.',
        timestamp: '2025-01-19T16:30:00Z',
        reactions: [
          {
            emoji: '🚨',
            count: 5,
            users: [
              'John Doe',
              'Jane Smith',
              'Mike Johnson',
              'Sarah Chen',
              'Alex Kim',
            ],
          },
        ],
      },
    ],
    createdAt: '2025-01-19T16:30:00Z',
    updatedAt: '2025-01-19T18:45:00Z',
    messageCount: 12,
  },
];

// Mock data for reports
const mockReports: (AlerIncident & { chatId: string; createdFrom: string })[] =
  [
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
      ],
      log_clusters: ['DB_CONN_FAIL'],
      change_event: 'deploy v1.2.0 at 10:03',
      cause: 'DB connection pool misconfiguration after deploy',
      timeline: [],
      suggested_solution: 'Revert deploy v1.2.0, increase DB pool size to 500',
      preventive_plan: 'Run DB stress test in CI/CD before deploy',
      status: 'OPEN',
      assignee: '',
      reporter: '',
      priority: 'URGENT',
      chatId: 'chat-001',
      createdFrom: 'Chat Analysis',
    },
    {
      incident_id: 'INC-20250918-02',
      service: 'auth-service',
      start_time: '2025-09-18T14:30:00Z',
      severity: 'high',
      impact: {
        users: 2000,
        region: 'US',
      },
      anomalies: [],
      log_clusters: ['AUTH_TIMEOUT'],
      change_event: 'traffic surge',
      cause: 'High load causing authentication delays',
      timeline: [],
      suggested_solution: 'Scale authentication service horizontally',
      preventive_plan: 'Implement auto-scaling policies',
      status: 'IN_PROGRESS',
      assignee: '',
      reporter: '',
      priority: 'HIGH',
      chatId: 'chat-002',
      createdFrom: 'Thread Discussion',
    },
  ];

const ChatPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('threads');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reports] = useState(mockReports);
  const [threads] = useState(mockThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleThreadClick = (thread: Thread) => {
    setSelectedThread(thread);

    // Convert thread messages to chat conversation
    const threadConversation: Conversation = {
      id: `thread-conv-${thread.id}`,
      title: thread.title,
      messages: thread.messages.map((msg) => ({
        id: msg.id,
        role: 'user' as MessageRole, // All thread messages are treated as user messages for now
        content: `**${msg.user.name}** (${msg.user.role}): ${msg.content}`,
        timestamp: msg.timestamp,
      })),
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };

    setCurrentConversation(threadConversation);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    if (!currentConversation) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : ''),
        messages: [newMessage],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
    } else {
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage],
        updatedAt: new Date().toISOString(),
      };
      setCurrentConversation(updatedConversation);
      setConversations(
        conversations.map((conv) =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        )
      );
      setInputValue('');
    }

    setInputValue('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check if message might generate an incident
      const shouldGenerateIncident =
        inputValue.toLowerCase().includes('error') ||
        inputValue.toLowerCase().includes('incident') ||
        inputValue.toLowerCase().includes('failure') ||
        inputValue.toLowerCase().includes('down');

      let botResponse: MessageType;

      if (shouldGenerateIncident) {
        // Generate response with incident object
        const incidentData: AlerIncident = {
          incident_id: `INC-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(
            Math.random() * 100
          )
            .toString()
            .padStart(2, '0')}`,
          service: 'detected-service',
          start_time: new Date().toISOString(),
          severity: 'medium',
          impact: {
            users: Math.floor(Math.random() * 1000) + 100,
            region: 'Auto-detected',
          },
          anomalies: [],
          log_clusters: ['SYSTEM_ERROR'],
          change_event: 'User reported issue',
          cause: 'Under investigation',
          timeline: [],
          suggested_solution: 'Investigating the reported issue',
          preventive_plan: 'Monitor system metrics',
          status: 'OPEN',
          assignee: '',
          reporter: '',
          priority: 'MEDIUM',
        };

        botResponse = {
          id: Date.now().toString(),
          role: 'assistant',
          content:
            "I've analyzed your message and detected a potential system issue. Here's the incident report I've created:",
          timestamp: new Date().toISOString(),
          incident: incidentData,
        };
      } else {
        botResponse = {
          id: Date.now().toString(),
          role: 'assistant',
          content:
            'I understand your query. How can I help you further with system monitoring and incident management?',
          timestamp: new Date().toISOString(),
        };
      }

      if (currentConversation) {
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, newMessage, botResponse],
          updatedAt: new Date().toISOString(),
        };
        setCurrentConversation(updatedConversation);
        setConversations(
          conversations.map((conv) =>
            conv.id === updatedConversation.id ? updatedConversation : conv
          )
        );
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  const handleEditMessage = (messageId: string) => {
    if (!currentConversation) return;
    const message = currentConversation.messages.find(
      (m) => m.id === messageId
    );
    if (message) {
      setInputValue(message.content);
    }
  };

  const handleRegenerate = () => {
    if (!currentConversation || !currentConversation.messages.length) return;
    setIsLoading(true);

    // Simulate regenerating response
    setTimeout(() => {
      const lastMessage =
        currentConversation.messages[currentConversation.messages.length - 1];
      const newResponse: MessageType = {
        ...lastMessage,
        id: Date.now().toString(),
        content:
          'This is a regenerated response. Replace with actual API integration.',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [
        ...currentConversation.messages.slice(0, -1),
        newResponse,
      ];
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      };

      setCurrentConversation(updatedConversation);
      setConversations(
        conversations.map((conv) =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        )
      );
      setIsLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#ff4d4f';
      case 'high':
        return '#ff7a45';
      case 'medium':
        return '#ffa940';
      case 'low':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  };

  const renderMainChat = () => (
    <div className="flex flex-col h-full">
      {!currentConversation ? (
        <EmptyState onSuggestionClick={handleSuggestionClick} />
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
          <div className="mb-4 pb-4 border-b border-zinc-800">
            <h2 className="text-xl font-semibold text-white">
              {currentConversation.title}
            </h2>
            {selectedThread && (
              <p className="text-gray-400 text-sm mt-1">
                {selectedThread.description}
              </p>
            )}
          </div>

          {currentConversation?.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onEdit={handleEditMessage}
              onRegenerate={
                message.role === 'assistant' &&
                message.id ===
                  currentConversation.messages[
                    currentConversation.messages.length - 1
                  ].id
                  ? handleRegenerate
                  : undefined
              }
            />
          ))}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Spin indicator={<LoaderIcon style={{ fontSize: 24 }} />} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="p-4 bg-black border-t border-zinc-800">
        <div className="relative flex flex-row gap-2 items-center border border-zinc-800 rounded-lg p-2 shadow-sm bg-black">
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="pr-24 resize-none rounded-lg !border-none !shadow-unset !focus:shadow-unset !focus:border-none !focus:ring-0 bg-black text-white"
          />
          <Button
            type="text"
            icon={<Send />}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="text-zinc-400 hover:text-white"
          />
        </div>
      </div>
    </div>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ff4d4f';
      case 'high':
        return '#ff7a45';
      case 'medium':
        return '#ffa940';
      case 'low':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#52c41a';
      case 'resolved':
        return '#1890ff';
      case 'archived':
        return '#d9d9d9';
      default:
        return '#faad14';
    }
  };

  const renderSidebarThreads = () => (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-zinc-700">
        <h3 className="text-lg font-semibold text-white">Threads</h3>
        <p className="text-gray-400 text-sm mt-1">Team discussions</p>
      </div>

      <div className="p-3 space-y-2 flex flex-col gap-2 items-stretch">
        {threads.map((thread) => (
          <Card
            key={thread.id}
            className={`bg-zinc-800 border-zinc-700 hover:border-zinc-600 cursor-pointer transition-all ${
              selectedThread?.id === thread.id
                ? 'border-blue-500 bg-zinc-750'
                : ''
            }`}
            onClick={() => handleThreadClick(thread)}
          >
            <div className="p-3">
              <h4 className="text-white font-medium text-sm mb-2 line-clamp-2 leading-tight">
                {thread.title}
              </h4>
              <span className="text-xs text-gray-500">
                {new Date(thread.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSidebarReports = () => (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-zinc-700">
        <h3 className="text-lg font-semibold text-white">Reports</h3>
        <p className="text-gray-400 text-sm mt-1">Generated incidents</p>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 p-4">
          <FileText size={48} color="#666" className="mb-3" />
          <p className="text-gray-400 text-sm text-center">
            No reports generated yet
          </p>
        </div>
      ) : (
        <div className="p-3 space-y-2 flex flex-col gap-2 items-stretch">
          {reports.map((report) => (
            <Card
              key={report.incident_id}
              className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 cursor-pointer transition-all"
              onClick={() =>
                navigate(`/alert-incident-management/${report.incident_id}`)
              }
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle
                      size={14}
                      color={getSeverityColor(report.severity)}
                    />
                    <span className="text-blue-400 font-mono text-xs">
                      {report.incident_id}
                    </span>
                  </div>
                  <Tag
                    color={getSeverityColor(report.severity)}
                    className="text-xs px-1 py-0"
                  >
                    {report.severity.charAt(0).toUpperCase()}
                  </Tag>
                </div>

                <h4 className="text-white font-medium text-sm mb-2 line-clamp-2 leading-tight">
                  {report.service}
                </h4>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <User size={10} />
                    <span>{report.impact.users.toLocaleString()} users</span>
                  </div>
                  <span className="text-gray-500">
                    {new Date(report.start_time).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  From: {report.createdFrom}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Layout className="bg-black min-h-screen">
      <Content className="bg-black flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">{renderMainChat()}</div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col">
              {/* Sidebar Tabs */}
              <div className="px-4 pt-3 border-b border-zinc-700">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  size="small"
                  className="sidebar-tabs"
                  items={[
                    {
                      key: 'threads',
                      label: (
                        <span className="flex items-center space-x-2 text-gray-300 px-2 py-1">
                          <BookOpen size={14} />
                          <span>Threads</span>
                        </span>
                      ),
                      children: null,
                    },
                    {
                      key: 'reports',
                      label: (
                        <span className="flex items-center space-x-2 text-gray-300 px-2 py-1">
                          <FileText size={14} />
                          <span>Reports</span>
                          {reports.length > 0 && (
                            <Tag color="blue" className="ml-1 text-xs px-1">
                              {reports.length}
                            </Tag>
                          )}
                        </span>
                      ),
                      children: null,
                    },
                  ]}
                />
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'threads' && renderSidebarThreads()}
                {activeTab === 'reports' && renderSidebarReports()}
              </div>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ChatPage;
