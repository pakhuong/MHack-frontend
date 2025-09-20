import type { Message as MessageType } from '../../types/chat';
import ReactMarkdown from 'react-markdown';
import { Button, Tooltip, message } from 'antd';
import {
  CopyOutlined,
  EditOutlined,
  RedoOutlined,
  LikeOutlined,
  DislikeOutlined,
} from '@ant-design/icons';

interface MessageProps {
  message: MessageType;
  onEdit?: (messageId: string) => void;
  onRegenerate?: () => void;
}

export const Message = ({ message, onEdit, onRegenerate }: MessageProps) => {
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      message.success('Copied to clipboard');
    } catch (err) {
      message.error('Failed to copy');
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
        } py-4 px-6 rounded-lg`}
      >
        <div className="prose prose-invert max-w-none font-base text-base">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
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
