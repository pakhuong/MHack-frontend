import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { NavFavorites } from '../nav-favorites';
import { useState } from 'react';
import type { Conversation } from '../../types/chat';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';

export const ChatFavorites = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const onNewChat = () => {
    setConversations([
      ...conversations,
      {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  React.useEffect(() => {
    setConversations([
      {
        id: uuidv4(),
        title: 'Project Management & Task Tracking',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Family Recipe Collection & Meal Planning',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Fitness Tracker & Workout Routines',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Book Notes & Reading List',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Book Notes & Reading List',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Sustainable Gardening Tips & Plant Care',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Sustainable Gardening Tips & Plant Care',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Language Learning Progress & Resources',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Home Renovation Ideas & Budget Tracker',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Personal Finance & Investment Portfolio',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Movie & TV Show Watchlist with Reviews',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Daily Habit Tracker & Goal Setting',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Personal Finance & Investment Portfolio',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Movie & TV Show Watchlist with Reviews',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Movie & TV Show Watchlist with Reviews',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Movie & TV Show Watchlist with Reviews',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Movie & TV Show Watchlist with Reviews',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Movie & TV Show Watchlist with Reviews',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'Daily Habit Tracker & Goal Setting',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col gap-2 p-2">
      <Button
        type="primary"
        icon={<Plus color="black" />}
        onClick={onNewChat}
        block
        className="bg-gray-100 border-gray-200 text-black hover:bg-gray-200 mb-2"
      >
        <span className="text-black">New Chat</span>
      </Button>

      {conversations.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-4">
          No conversations yet
        </div>
      ) : (
        <NavFavorites conversations={conversations} />
      )}
    </div>
  );
};
