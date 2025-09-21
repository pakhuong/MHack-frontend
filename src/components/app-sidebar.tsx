import * as React from 'react';
import {
  AudioWaveform,
  BotMessageSquare,
  Command,
  Ticket,
  Logs,
  SquareActivity,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

// Sample data
const data = {
  teams: [
    {
      name: 'Backend',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'Data Platform',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'AI Platform',
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
      title: 'Logs',
      url: '/logs',
      icon: Logs,
    },
    {
      title: 'Health',
      url: '/health',
      icon: SquareActivity,
    },
  ],
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://github.com/shadcn.png',
  },
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
      <SidebarFooter style={{ backgroundColor: '#121212' }}>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail className="bg-[#121212] border-r border-[#2A2A2A]" />
    </Sidebar>
  );
}
