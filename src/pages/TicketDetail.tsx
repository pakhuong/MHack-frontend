import { useState } from 'react';
import {
  Paperclip,
  Link,
  MoreHorizontal,
  Eye,
  X,
  Plus,
  Ticket as TicketIcon,
} from 'lucide-react';
import { ConfigProvider, theme, Select } from 'antd';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import type { Ticket } from '../types/ticket';

// Mock data for demonstration
const mockTicket: Ticket = {
  id: 'ATMT-007',
  summary: 'Add pop-up to ask users for app store review',
  description:
    "After the 3rd time an ios user logs into the app, we will send a pop-up that asks if they love the app. If the user loves the app then we'll ask them to leave a review in the ios app store. If the user doesn't love the app, we'll ask them to leave feedback for our team.",
  status: 'DONE',
  severity: 'S3',
  priority: 'HIGH',
  incidentType: 'HAPPENING',
  created: '2025-01-15 10:30:00',
  updated: '2025-01-20 14:45:00',
  assignee: {
    id: '1',
    name: 'Jose Romero',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  },
  reporter: {
    id: '2',
    name: 'Elena Godinez',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
  },
  labels: [],
  attachments: [
    {
      id: '1',
      name: 'ios user app style guidelines.pdf',
      size: '2.9 MB',
      type: 'pdf',
      url: '#',
      thumbnail:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=150&fit=crop',
    },
  ],
  comments: [],
  development: {
    branches: 3,
    commits: 5,
    pullRequests: 2,
    lastCommit: '9 days ago',
  },
};

export default function TicketDetail() {
  const [ticket, setTicket] = useState<Ticket>(mockTicket);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Handle adding comment
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const handleStatusChange = (value: string) => {
    setTicket((prev) => ({
      ...prev,
      status: value as Ticket['status'],
    }));
  };

  const handlePriorityChange = (value: string) => {
    setTicket((prev) => ({
      ...prev,
      priority: value as Ticket['priority'],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'NEED_TEST':
        return 'bg-orange-500';
      case 'TESTING':
        return 'bg-purple-500';
      case 'DONE':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-500';
      case 'MEDIUM':
        return 'bg-blue-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'URGENT':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-start flex-col space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <TicketIcon size={24} color="green" />
                    <span className="text-green-600 font-medium text-lg">
                      {ticket.id}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold text-white">
                    {ticket.summary}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
                  >
                    <Paperclip className="w-4 h-4" color="gray" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
                  >
                    <Link className="w-4 h-4" color="gray" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
                  >
                    <MoreHorizontal className="w-4 h-4" color="gray" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-400 italic mb-3">
                Description
              </h3>
              <p className="text-gray-200 leading-relaxed text-md">
                {ticket.description}
              </p>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-400 italic mb-3">
                  Attachments
                </h3>
                <div className="space-y-3">
                  {ticket.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center space-x-3 p-3 border border-zinc-800 rounded-lg bg-zinc-900"
                    >
                      <div className="w-16 h-12 bg-zinc-800 rounded flex items-center justify-center">
                        {attachment.thumbnail ? (
                          <img
                            src={attachment.thumbnail}
                            alt={attachment.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Paperclip className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-100">
                          {attachment.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {attachment.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity/Comments */}
            <div>
              <h3 className="text-base font-semibold text-gray-400 italic">
                Activity
              </h3>
              <div className="space-y-4 mt-2">
                {/* Add Comment */}
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" />
                    <AvatarFallback>EG</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        color: '#f4f4f5',
                      }}
                      className="mb-2 bg-zinc-800 border-zinc-700 text-gray-100 placeholder-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-2">
          <div className="space-y-2">
            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
              >
                <Eye className="w-4 h-4" color="gray" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
              >
                <MoreHorizontal className="w-4 h-4" color="gray" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" color="gray" />
              </Button>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <Select
                value={ticket.status}
                onChange={handleStatusChange}
                className="w-full"
                style={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                }}
                dropdownStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                }}
                popupClassName="custom-select-dropdown"
                suffixIcon={
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`}
                  ></div>
                }
                options={[
                  {
                    value: 'TODO',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span>TODO</span>
                      </div>
                    ),
                  },
                  {
                    value: 'IN_PROGRESS',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>In Progress</span>
                      </div>
                    ),
                  },
                  {
                    value: 'NEED_TEST',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span>Need Test</span>
                      </div>
                    ),
                  },
                  {
                    value: 'TESTING',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span>Testing</span>
                      </div>
                    ),
                  },
                  {
                    value: 'DONE',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Done</span>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Priority
              </label>
              <Select
                value={ticket.priority}
                onChange={handlePriorityChange}
                className="w-full"
                style={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                }}
                dropdownStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                }}
                popupClassName="custom-select-dropdown"
                suffixIcon={
                  <div
                    className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}
                  ></div>
                }
                options={[
                  {
                    value: 'LOW',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Low</span>
                      </div>
                    ),
                  },
                  {
                    value: 'MEDIUM',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Medium</span>
                      </div>
                    ),
                  },
                  {
                    value: 'HIGH',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span>High</span>
                      </div>
                    ),
                  },
                  {
                    value: 'URGENT',
                    label: (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Urgent</span>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Assignee
              </label>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={ticket.assignee?.avatar} />
                  <AvatarFallback>
                    {ticket.assignee?.name
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-100">
                  {ticket.assignee?.name}
                </span>
              </div>
            </div>

            {/* Reporter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Reporter
              </label>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={ticket.reporter?.avatar} />
                  <AvatarFallback>
                    {ticket.reporter?.name
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-100">
                  {ticket.reporter?.name}
                </span>
              </div>
            </div>

            <Separator />

            {/* Development */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-100">Development</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-100 hover:bg-zinc-800"
                >
                  <Plus className="w-4 h-4" color="gray" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">
                    {ticket.development?.branches} branches
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">
                    {ticket.development?.commits} commits
                  </span>
                  <span className="text-gray-500">
                    {ticket.development?.lastCommit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">
                    {ticket.development?.pullRequests} pull requests
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-zinc-700 text-gray-300 hover:bg-zinc-800"
                  >
                    OPEN
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
