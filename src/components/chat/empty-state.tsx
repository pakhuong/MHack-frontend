import { Button, Input } from 'antd';
import {
  AlertTriangle,
  Database,
  Network,
  Send,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const suggestions = [
  'Why is our payment service showing 5xx errors after the last deployment?',
  'What caused the sudden spike in response time for our API endpoints?',
  'Check database connection issues and slow query performance',
  'Investigate intermittent network timeouts affecting user sessions',
];

const suggestionIcons = [AlertTriangle, TrendingUp, Database, Network];

const suggestionCategories = [
  'Incident Response',
  'Performance',
  'Infrastructure',
  'Network',
];

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
  onSend?: (text: string) => void;
}

export const EmptyState = ({ onSuggestionClick, onSend }: EmptyStateProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (onSend) {
      onSend(inputValue.trim());
    } else {
      onSuggestionClick(inputValue.trim());
    }

    setInputValue('');
  };
  const getCategoryColor = (index: number) => {
    const colors = [
      'text-red-400 bg-red-500/10 border-red-500/20',
      'text-blue-400 bg-blue-500/10 border-blue-500/20',
      'text-purple-400 bg-purple-500/10 border-purple-500/20',
      'text-green-400 bg-green-500/10 border-green-500/20',
      'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      'text-orange-400 bg-orange-500/10 border-orange-500/20',
      'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      'text-pink-400 bg-pink-500/10 border-pink-500/20',
    ];
    return colors[index] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-black">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="mb-3">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-white">
          What can I help with?
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Ask me about your infrastructure, incidents, or performance:
        </p>
      </div>

      {/* Suggestions Grid - Single Row */}
      <div className="w-full max-w-4xl mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {suggestions.map((suggestion, index) => {
            const IconComponent = suggestionIcons[index];
            const category = suggestionCategories[index];
            return (
              <div
                key={suggestion}
                onClick={() => onSuggestionClick(suggestion)}
                className="group relative p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/10"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(
                      index
                    )}`}
                  >
                    {category}
                  </span>
                  <IconComponent className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                </div>

                {/* Content */}
                <p className="text-gray-300 text-xs leading-tight group-hover:text-white transition-colors line-clamp-2">
                  {suggestion}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-3">
          <p className="text-gray-500 text-xs mb-1">
            Or type your own question below
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs">AI-powered analysis</span>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="flex-shrink-0 p-4 w-full">
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
            disabled={!inputValue.trim()}
            className="text-zinc-400 hover:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
