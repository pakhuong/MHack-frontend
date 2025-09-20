import { Card } from 'antd';
import { BulbOutlined, RocketOutlined, ToolOutlined } from '@ant-design/icons';

const examples = [
  {
    icon: <BulbOutlined className="text-2xl text-yellow-500" />,
    title: 'Explain quantum computing',
    suggestions: [
      'in simple terms',
      'and its potential impact',
      'compared to classical computing',
    ],
  },
  {
    icon: <RocketOutlined className="text-2xl text-blue-500" />,
    title: 'Got any creative ideas',
    suggestions: [
      "for a 10 year old's birthday",
      'for a novel plot',
      'for a mobile app',
    ],
  },
  {
    icon: <ToolOutlined className="text-2xl text-green-500" />,
    title: 'How do I make',
    suggestions: [
      'an HTTP request in JavaScript',
      'a REST API with Node.js',
      'a responsive layout with CSS Grid',
    ],
  },
];

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black">
      <h1 className="text-4xl font-bold mb-8 text-white">
        What can I help with?
      </h1>
    </div>
  );
};

export default EmptyState;
