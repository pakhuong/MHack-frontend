import * as React from 'react';
import {
  AudioWaveform,
  Blocks,
  BotMessageSquare,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Settings2,
  Ticket,
  Trash2,
} from 'lucide-react';

import { NavFavorites } from '@/components/nav-favorites';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavWorkspaces } from '@/components/nav-workspaces';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// Sample data
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Ticket',
      url: '/ticket',
      icon: Ticket,
    },
    {
      title: 'Chat',
      url: '/chat',
      icon: BotMessageSquare,
      isActive: true,
    },
    {
      title: 'Home',
      url: '#',
      icon: Home,
    },
    {
      title: 'Inbox',
      url: '#',
      icon: Inbox,
      badge: '10',
    },
  ],
  navSecondary: [
    {
      title: 'Calendar',
      url: '#',
      icon: Calendar,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Templates',
      url: '#',
      icon: Blocks,
    },
    {
      title: 'Trash',
      url: '#',
      icon: Trash2,
    },
    {
      title: 'Help',
      url: '#',
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: 'Recent Chats',
      url: '#',
      emoji: '💬',
    },
    {
      name: 'Saved Responses',
      url: '#',
      emoji: '📌',
    },
    {
      name: 'Code Snippets',
      url: '#',
      emoji: '💻',
    },
    {
      name: 'Documentation',
      url: '#',
      emoji: '📚',
    },
    {
      name: 'API References',
      url: '#',
      emoji: '🔗',
    },
  ],
  workspaces: [
    {
      name: 'Development',
      emoji: '🛠️',
      pages: [
        {
          name: 'Frontend Tasks',
          url: '#',
          emoji: '🎨',
        },
        {
          name: 'Backend Tasks',
          url: '#',
          emoji: '⚙️',
        },
        {
          name: 'API Documentation',
          url: '#',
          emoji: '📝',
        },
      ],
    },
    {
      name: 'Project Management',
      emoji: '📊',
      pages: [
        {
          name: 'Active Sprints',
          url: '#',
          emoji: '🎯',
        },
        {
          name: 'Backlog',
          url: '#',
          emoji: '📋',
        },
        {
          name: 'Team Updates',
          url: '#',
          emoji: '👥',
        },
      ],
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sideBarContent?: React.ReactNode;
}

export function AppSidebar({ sideBarContent, ...props }: AppSidebarProps) {
  return (
    <Sidebar
      className="border-r-0 bg-[#121212]"
      style={{ width: '240px' }}
      {...props}
    >
      <SidebarHeader className="border-b border-[#2A2A2A] bg-[#121212] p-0">
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent className="bg-[#121212]">
        {sideBarContent || (
          <>
            <div className="mt-4 px-4">
              <button className="w-full rounded-md bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-white hover:bg-[#3A3A3A] transition-colors">
                + New Chat
              </button>
            </div>
          </>
        )}
      </SidebarContent>
      <SidebarRail className="bg-[#121212] border-r border-[#2A2A2A]" />
    </Sidebar>
  );
}