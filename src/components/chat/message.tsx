import type { Message as MessageType } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import { Button, Tooltip, Card, Tag } from 'antd';
import {
  CopyOutlined,
  EditOutlined,
  RedoOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, User } from 'lucide-react';

interface MessageProps {
  message: MessageType;
  onEdit?: (messageId: string) => void;
  onRegenerate?: () => void;
  isStreaming?: boolean;
}

export const Message = ({
  message,
  onEdit,
  onRegenerate,
  isStreaming,
}: MessageProps) => {
  const isUser = message.role === 'user';
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      // TODO: Add toast notification for success
    } catch {
      // TODO: Add toast notification for error
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return '#ff4d4f';
      case 'IN_PROGRESS':
        return '#1890ff';
      case 'RESOLVED':
        return '#52c41a';
      case 'CLOSED':
        return '#d9d9d9';
      default:
        return '#faad14';
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto flex flex-col w-full gap-1 ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <div className="text-xs text-zinc-500">
        {new Date(message.timestamp).toLocaleString()}
      </div>
      <div
        className={`flex max-w-full ${
          isUser ? 'bg-zinc-900' : 'bg-black border border-zinc-800'
        } py-4 px-6 rounded-lg flex-col space-y-4`}
      >
        <div className="prose prose-invert max-w-none font-base text-base">
          <div>
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-5 bg-white ml-1 animate-pulse"></span>
            )}
          </div>
        </div>

        {/* Incident Object */}
        {message.incident && (
          <Card
            className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 cursor-pointer transition-all"
            onClick={() => navigate(`/ticket/${message.incident?.incident_id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle
                    color={getSeverityColor(message.incident.severity)}
                    size={16}
                  />
                  <span className="text-blue-400 font-mono text-sm">
                    {message.incident.incident_id}
                  </span>
                  <Tag
                    color={getSeverityColor(message.incident.severity)}
                    className="text-xs"
                  >
                    {message.incident.severity.toUpperCase()}
                  </Tag>
                  <Tag
                    color={getStatusColor(message.incident.status)}
                    className="text-xs"
                  >
                    {message.incident.status}
                  </Tag>
                </div>

                <h4 className="text-white font-medium mb-2 text-sm">
                  {message.incident.cause || 'System Incident Detected'}
                </h4>

                <div className="flex items-center space-x-4 text-xs text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <User style={{ fontSize: 10 }} />
                    <span>
                      {message.incident.impact.users.toLocaleString()} users
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock style={{ fontSize: 10 }} />
                    <span>
                      {new Date(
                        message.incident.start_time
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Service: {message.incident.service}
                  </div>
                  <Button
                    type="link"
                    size="small"
                    className="text-blue-400 hover:text-blue-300 p-0 text-xs"
                  >
                    View Details →
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
      <div
        className={`flex items-center gap-2 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {!isUser && (
          <>
            <Tooltip title="Like">
              <Button
                type="text"
                icon={<LikeOutlined />}
                size="small"
                className="text-zinc-400 hover:text-white"
              />
            </Tooltip>
            <Tooltip title="Dislike">
              <Button
                type="text"
                icon={<DislikeOutlined />}
                size="small"
                className="text-zinc-400 hover:text-white"
              />
            </Tooltip>
          </>
        )}
        <Tooltip title="Copy">
          <Button
            type="text"
            icon={<CopyOutlined />}
            size="small"
            onClick={handleCopy}
            className="text-zinc-400 hover:text-white"
          />
        </Tooltip>
        {isUser && onEdit && (
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(message.id)}
              className="text-zinc-400 hover:text-white"
            />
          </Tooltip>
        )}
        {!isUser && onRegenerate && (
          <Tooltip title="Regenerate">
            <Button
              type="text"
              icon={<RedoOutlined />}
              size="small"
              onClick={onRegenerate}
              className="text-zinc-400 hover:text-white"
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Message;
