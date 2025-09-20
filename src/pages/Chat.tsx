import { useState, useRef, useEffect } from 'react';
import { Input, Button, Layout, Spin } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import type { Message as MessageType, Conversation } from '../types/chat';
import { Message } from '../components/chat/message';
import EmptyState from '../components/chat/empty-state';

const { Content } = Layout;

const ChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

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
      const botResponse: MessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content:
          'This is a sample response. Replace with actual API integration.',
        timestamp: new Date().toISOString(),
      };

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
    }, 1000);
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

  return (
    <Layout className="bg-black">
      <Content className="bg-black flex flex-col">
        {!currentConversation && conversations.length === 0 ? (
          <EmptyState onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
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
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="p-4 bg-black ">
          <div className="max-w-4xl mx-auto relative flex flex-row gap-2 items-center border border-zinc-800 rounded-lg p-2 shadow-sm bg-black">
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
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="text-zinc-400 hover:text-white"
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ChatPage;