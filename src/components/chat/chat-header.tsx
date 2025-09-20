import { Select, Button, Tooltip } from 'antd';
import { SettingOutlined, ShareAltOutlined } from '@ant-design/icons';

interface ChatHeaderProps {
  currentModel: string;
  onModelChange: (model: string) => void;
}

export const ChatHeader = ({
  currentModel,
  onModelChange,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <Select
          value={currentModel}
          onChange={onModelChange}
          style={{ width: 160 }}
          options={[
            { value: 'gpt-4', label: 'GPT-4' },
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5' },
          ]}
        />
      </div>

      <div className="flex items-center gap-2">
        <Tooltip title="Share chat">
          <Button
            icon={<ShareAltOutlined />}
            type="text"
            className="hover:bg-gray-100"
          />
        </Tooltip>
        <Tooltip title="Settings">
          <Button
            icon={<SettingOutlined />}
            type="text"
            className="hover:bg-gray-100"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatHeader;
