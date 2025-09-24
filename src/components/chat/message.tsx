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
import type { AlertIncident } from '@/types/ticket';

interface MessageProps {
  message: MessageType;
  onEdit?: (messageId: string) => void;
  onRegenerate?: () => void;
  isStreaming?: boolean;
  report?: AlertIncident;
}

export const Message = ({
  message,
  onEdit,
  onRegenerate,
  isStreaming,
  report,
}: MessageProps) => {
  const isUser = message.role === 'user';
  const navigate = useNavigate();
  console.log({ message });
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

  const getTypeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'incident':
        return '#ff4d4f';
      case 'alert':
        return 'yellow';

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
        {report && (
          <Card
            className="bg-zinc-800 max-w-80 border-zinc-700 hover:border-zinc-600 cursor-pointer transition-all"
            onClick={() =>
              window.open(`/alert-incident-management/${'alert_id' in report ? 'alert' : 'incident'}/${report.id}`)
            }
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag
                    style={{
                      borderColor: getTypeColor(report.tag),
                      color: getTypeColor(report.tag)
                    }}
                    className="text-xs"
                  >
                    {report.tag.toUpperCase()}
                  </Tag>
                  <span className="text-blue-400 font-mono text-sm">
                    {report._id}
                  </span>
                </div>
                <Tag
                  color={getSeverityColor(report.severity)}
                  className="text-xs"
                >
                  {report.severity.toUpperCase()}
                </Tag>
                <Tag color={getStatusColor(report.status)} className="text-xs">
                  {report.status}
                </Tag>

                {/* <h4 className="text-white font-medium mb-2 text-sm">
                  {report.tag || 'System Incident Detected'}
                </h4> */}

                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    Service: {report.service}
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
