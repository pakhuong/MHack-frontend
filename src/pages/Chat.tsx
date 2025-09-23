import { useState, useRef, useEffect } from 'react';
import { Input, Button, Layout, Spin, Tabs, Card, Tag } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type {
  Message as MessageType,
  Conversation,
  MessageRole,
} from '../types/chat';
import type { AlertIncident, TicketSeverity } from '../types/ticket';
import { severityColors } from '../types/ticket';
import { Message } from '../components/chat/message';
import EmptyState from '../components/chat/empty-state';
import {
  AlertTriangle,
  BookOpen,
  FileText,
  LoaderIcon,
  Plus,
  Send,
} from 'lucide-react';
import axios from 'axios';
import React from 'react';

const { Content } = Layout;

// Thread interfaces for API response

interface Thread {
  threadId: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    id: string;
    role: string;
    content: string;
    ts: string;
    extra?: {
      checkpointsCount?: number;
      incident?: {
        id: string;
        severity: string;
      };
      impact?: {
        users: number;
        region: string;
      };
      anomaly?: {
        metric: string;
        change: string;
        value: string;
      };
    };
  };
  messageCount: number;
}

const ChatPage = () => {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('threads');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<AlertIncident[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showSidebar] = useState(true);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/chat/threads?limit=20&offset=0'
        );
        setThreads(response.data.items ?? []);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
        setThreads([]); // Fallback to mock data
      }
    };
    fetchThreads();
  }, []);

  // Load specific thread when threadId is in URL
  React.useEffect(() => {
    const loadThread = async () => {
      if (threadId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/chat/${threadId}`
          );
          const threadData = response.data;

          // Convert API response to conversation format
          const threadConversation: Conversation = {
            id: threadData.threadId,
            title: `Thread ${threadData.threadId.slice(0, 8)}...`,
            messages: threadData.messages.map(
              (msg: {
                id: string;
                role: string;
                content: string;
                ts: string;
                extra?: {
                  incident?: { id: string; severity: string };
                  impact?: { users: number; region: string };
                  anomaly?: { metric: string; change: string; value: string };
                };
              }) => ({
                id: msg.id,
                role: msg.role as MessageRole,
                content: msg.content,
                timestamp: msg.ts,
                incident: msg.extra?.incident
                  ? {
                      incident_id: msg.extra.incident.id,
                      service: 'detected-service',
                      start_time: msg.ts,
                      severity:
                        msg.extra.incident.severity === 'P1'
                          ? 'critical'
                          : 'medium',
                      impact: msg.extra.impact,
                      anomalies: msg.extra.anomaly ? [msg.extra.anomaly] : [],
                      log_clusters: [],
                      change_event: 'System detected',
                      cause: 'Under investigation',
                      timeline: [],
                      suggested_solution: 'Investigating the issue',
                      preventive_plan: 'Monitor system metrics',
                      status: 'OPEN',
                      assignee: '',
                      reporter: '',
                      priority:
                        msg.extra.incident.severity === 'P1'
                          ? 'URGENT'
                          : 'MEDIUM',
                    }
                  : undefined,
              })
            ),
            createdAt: threadData.createdAt,
            updatedAt: threadData.updatedAt,
          };

          setCurrentConversation(threadConversation);

          // Find and select the thread in sidebar
          const thread = threads.find((t) => t.threadId === threadId);
          if (thread) {
            setSelectedThread(thread);
          }
        } catch (error) {
          console.error('Failed to load thread:', error);
          // If thread not found, redirect to main chat
          if (location.pathname !== '/chat') {
            navigate('/chat');
          }
        }
      } else {
        // Clear current conversation when not in a thread
        setCurrentConversation(null);
        setSelectedThread(null);
      }
    };

    loadThread();
  }, [threadId, navigate, location.pathname, threads]);

  const handleCreateThread = () => {
    // Navigate to main chat page to start a new conversation
    navigate('/chat');
    setCurrentConversation(null);
    setSelectedThread(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, streamingText]);

  // Clean up streaming interval on unmount
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const startStreaming = (fullText: string, messageId: string) => {
    console.log(
      'Starting streaming for:',
      messageId,
      'with text length:',
      fullText.length
    );
    setStreamingMessageId(messageId);
    setStreamingText('');

    let currentIndex = 0;
    const streamingSpeed = 30; // milliseconds between characters

    streamingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        const currentText = fullText.substring(0, currentIndex + 1);
        console.log(
          'Streaming progress:',
          currentIndex,
          '/',
          fullText.length,
          ':',
          currentText.slice(-5)
        );
        setStreamingText(currentText);
        currentIndex++;
      } else {
        // Streaming complete
        console.log('Streaming completed for:', messageId);
        clearInterval(streamingIntervalRef.current!);

        // Update the actual message content first
        setCurrentConversation((prev) => {
          if (!prev) return prev;
          const updatedMessages = prev.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content: fullText } : msg
          );
          const updatedConversation = {
            ...prev,
            messages: updatedMessages,
            updatedAt: new Date().toISOString(),
          };

          // Update conversations array immediately
          setConversations((prevConvs) =>
            prevConvs.map((conv) =>
              conv.id === updatedConversation.id ? updatedConversation : conv
            )
          );

          return updatedConversation;
        });

        // Clear streaming state only after ensuring message is updated
        setStreamingMessageId(null);
        setStreamingText('');
      }
    }, streamingSpeed);
  };

  const handleThreadClick = (thread: Thread) => {
    // Navigate to thread URL
    navigate(`/chat/thread/${thread.threadId}`);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Clear input and set loading
    const userInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      // Call API to send message
      const response = await axios.post(
        'http://localhost:3000/chat/sendMessage',
        {
          query: userInput,
          threadId: threadId || undefined, // Include threadId if in a thread
        }
      );

      const { threadId: responseThreadId, reply, report } = response.data;

      // If we're not in a thread yet (first message), navigate to the new thread
      if (!threadId && responseThreadId) {
        navigate(`/chat/thread/${responseThreadId}`);
        return; // The useEffect will handle loading the conversation
      }

      // If we're already in a thread, add the messages to current conversation
      if (currentConversation) {
        // Add user message
        const userMessage: MessageType = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: userInput,
          timestamp: new Date().toISOString(),
        };

        const formattedReport = report
          ? 'incident_id' in report
            ? {
                _id: report.incident_id,
                id: report.incident_id,
                tag: 'incident',
                service: report.service || 'detected-service',
                time: report.start_time,
                severity: report.severity === 'P1' ? 'critical' : 'medium',
                status: 'OPEN',
                priority: report.severity === 'P1' ? 'URGENT' : 'MEDIUM',
              }
            : 'alert_id' in report
              ? {
                  _id: report.alert_id,
                  id: report.alert_id,
                  tag: 'alert',
                  service: report.service || 'detected-service',
                  time: report.time,
                  severity: report.severity === 'P1' ? 'critical' : 'medium',
                  status: 'OPEN',
                  priority: report.severity === 'P1' ? 'URGENT' : 'MEDIUM',
                }
              : undefined
          : undefined;

        // Create bot response
        const botResponse: MessageType = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: '', // Start empty for streaming
          timestamp: new Date().toISOString(),
          report: formattedReport as AlertIncident,
        };

        // Update conversation with both messages
        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage, botResponse],
          updatedAt: new Date().toISOString(),
        };

        setCurrentConversation(updatedConversation);

        // Add report to reports list if present
        if (formattedReport) {
          setReports((prevReports) => [
            formattedReport as AlertIncident,
            ...prevReports,
          ]);
        }

        // Start streaming the response
        setTimeout(() => {
          setIsLoading(false);
          startStreaming(reply, botResponse.id);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);

      // Fallback to local handling if API fails
      handleSendFallback(userInput);
    }
  };

  const handleSendFallback = (userInput: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
    };

    if (!currentConversation) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: userInput.slice(0, 30) + (userInput.length > 30 ? '...' : ''),
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
    }

    // Simulate API response
    setTimeout(() => {
      const botResponseContent =
        'I understand your query. This is a fallback response when the API is unavailable.';

      const botResponse: MessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };

      setCurrentConversation((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          messages: [...prev.messages, botResponse],
          updatedAt: new Date().toISOString(),
        };

        setConversations((prevConvs) =>
          prevConvs.map((conv) => (conv.id === updated.id ? updated : conv))
        );

        return updated;
      });

      setTimeout(() => {
        setIsLoading(false);
        startStreaming(botResponseContent, botResponse.id);
      }, 500);
    }, 1000);
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  const handleEmptyStateSend = (text: string) => {
    setInputValue(text);
    // Trigger send immediately
    setTimeout(() => {
      handleSend();
    }, 100);
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

      const regeneratedContent =
        "This is a regenerated response with new insights. I've analyzed the situation again and can provide additional context or alternative solutions. Let me know if you need more specific information or if there's another approach you'd like me to explore.";

      const newResponse: MessageType = {
        ...lastMessage,
        id: Date.now().toString(),
        content: '', // Start with empty content for streaming
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

      // Start streaming the regenerated response
      setTimeout(() => {
        setIsLoading(false);
        startStreaming(regeneratedContent, newResponse.id);
      }, 500);
    }, 1000);
  };

  const getSeverityColorHex = (severity: string) => {
    const colorMap = {
      critical: '#ff4d4f',
      high: '#ff7a45',
      medium: '#ffa940',
      low: '#52c41a',
    };
    return (
      colorMap[severity.toLowerCase() as keyof typeof colorMap] || '#d9d9d9'
    );
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    // Remove markdown formatting for preview
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/```[\s\S]*?```/g, '[code block]') // Replace code blocks
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now.getTime() - time.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return time.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: time.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const renderMainChat = () => (
    <div className="flex flex-col h-full">
      {!currentConversation ? (
        <EmptyState
          onSuggestionClick={handleSuggestionClick}
          onSend={handleEmptyStateSend}
        />
      ) : (
        <>
          <div className="overflow-y-auto flex flex-col gap-4 p-4">
            <div className="mb-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {currentConversation.title}
                  </h2>
                  {selectedThread && (
                    <p className="text-gray-400 text-sm mt-1">
                      Thread: {selectedThread.threadId}
                    </p>
                  )}
                  {threadId && (
                    <p className="text-blue-400 text-xs mt-1 font-mono">
                      Thread ID: {threadId}
                    </p>
                  )}
                </div>
                {threadId && (
                  <Button
                    type="text"
                    size="small"
                    onClick={() => navigate('/chat')}
                    className="text-gray-400 hover:text-white"
                  >
                    Back to Chat
                  </Button>
                )}
              </div>
            </div>

            {currentConversation?.messages.map((message) => {
              // Check if this message is currently streaming
              const isStreaming = streamingMessageId === message.id;
              const displayMessage = isStreaming
                ? { ...message, content: streamingText }
                : message;

              if (message.role === 'assistant') {
                console.log('Rendering assistant message:', {
                  messageId: message.id,
                  isStreaming,
                  streamingMessageId,
                  originalContent: message.content,
                  streamingText: streamingText.slice(0, 20) + '...',
                  displayContent: displayMessage.content.slice(0, 20) + '...',
                });
              }

              return (
                <Message
                  key={message.id}
                  message={displayMessage}
                  isStreaming={isStreaming}
                  onEdit={handleEditMessage}
                  onRegenerate={
                    message.role === 'assistant' &&
                    message.id ===
                      currentConversation.messages[
                        currentConversation.messages.length - 1
                      ].id &&
                    !isStreaming
                      ? handleRegenerate
                      : undefined
                  }
                />
              );
            })}
            {isLoading && (
              <div className="flex justify-center py-4">
                <Spin indicator={<LoaderIcon style={{ fontSize: 24 }} />} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex-shrink-0 p-4 bg-black border-t border-zinc-800">
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
        </>
      )}
    </div>
  );

  const renderSidebarThreads = () => (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 border-b border-zinc-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Threads</h3>
          <Button
            type="primary"
            size="small"
            icon={<Plus size={12} />}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-xs"
            onClick={() => {
              // Handle new thread creation
              console.log('Create new thread');
              handleCreateThread();
            }}
            style={{ backgroundColor: '#1890ff' }}
          >
            New
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 p-4">
            <BookOpen size={48} color="#666" className="mb-3" />
            <p className="text-gray-400 text-sm text-center">No threads yet</p>
            <p className="text-gray-500 text-xs text-center mt-1">
              Start a conversation to create your first thread
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2 flex flex-col gap-2 items-stretch">
            {threads.map((thread) => (
              <Card
                key={thread.threadId}
                className={`bg-zinc-800 border-zinc-700 hover:border-zinc-600 cursor-pointer transition-all ${
                  selectedThread?.threadId === thread.threadId
                    ? 'border-blue-500 bg-zinc-750'
                    : ''
                }`}
                onClick={() => handleThreadClick(thread)}
                styles={{
                  body: { padding: 0 },
                }}
              >
                <div className="p-3">
                  {/* Thread Title - truncated last message content */}
                  <h4 className="text-white font-medium text-sm mb-2 line-clamp-1 leading-tight">
                    {truncateContent(thread.lastMessage.content, 60)}
                  </h4>

                  {/* Thread Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <div className="flex items-center space-x-2">
                      <span>{thread.messageCount} messages</span>
                      {thread.lastMessage.extra?.checkpointsCount && (
                        <>
                          <span>•</span>
                          <span>
                            {thread.lastMessage.extra.checkpointsCount}{' '}
                            checkpoints
                          </span>
                        </>
                      )}
                    </div>
                    <span>{formatRelativeTime(thread.updatedAt)}</span>
                  </div>

                  {/* Last Message Role Indicator */}
                  <div className="flex items-center justify-between">
                    {/* Incident Indicator */}
                    {thread.lastMessage.extra?.incident && (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle size={12} className="text-red-400" />
                        <span className="text-xs text-red-400">Incident</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSidebarReports = () => (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 border-b border-zinc-700">
        <h3 className="text-lg font-semibold text-white">Reports</h3>
        <p className="text-gray-400 text-sm mt-1">Generated from chat</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 p-4">
            <FileText size={48} color="#666" className="mb-3" />
            <p className="text-gray-400 text-sm text-center">
              No reports generated yet
            </p>
            <p className="text-gray-500 text-xs text-center mt-1">
              Reports will appear when AI detects incidents
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2 flex flex-col gap-2 items-stretch">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 cursor-pointer transition-all"
                styles={{
                  body: { padding: 0 },
                }}
                onClick={() => {
                  // Navigate based on tag type like Tickets table
                  if (report.tag === 'incident') {
                    navigate(
                      `/alert-incident-management/incident/${report.id}`
                    );
                  } else {
                    navigate(`/alert-incident-management/alert/${report.id}`);
                  }
                }}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle
                        size={14}
                        color={getSeverityColorHex(report.severity)}
                      />
                      <span className="text-blue-400 font-mono text-xs">
                        {report.id}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag
                        color={
                          severityColors[report.severity as TicketSeverity]
                        }
                        className="text-xs px-2 py-0"
                      >
                        {report.severity.toUpperCase()}
                      </Tag>
                      <Tag
                        color={report.tag === 'incident' ? 'red' : 'yellow'}
                        className="text-xs px-2 py-0"
                      >
                        {report.tag.toUpperCase()}
                      </Tag>
                    </div>
                  </div>

                  <h4 className="text-white font-medium text-sm mb-2 line-clamp-1 leading-tight">
                    {report.service}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          report.status === 'OPEN'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {report.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          report.priority === 'URGENT'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {report.priority}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {formatRelativeTime(report.time)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500">
                    Generated from chat conversation
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout className="bg-black h-screen overflow-hidden">
      <Content className="bg-black h-full">
        <div className="flex h-full">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col h-full">{renderMainChat()}</div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col h-full">
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
