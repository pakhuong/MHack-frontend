import { createBrowserRouter } from 'react-router-dom';
import TicketPage from '../pages/Tickets';
import ChatPage from '../pages/Chat';
import LogExplorer from '../pages/LogExplorer';
import HealthDashboard from '../pages/HealthDashboard';
import { MainLayoutWrapper } from '../components/layout';
import { ChatFavorites } from '@/components/chat/chat-favorites';
import TicketDetail from '@/pages/TicketDetail';
import Login from '@/pages/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayoutWrapper sideBarContent={<></>} pageTitle="Home">
        <ChatPage />
      </MainLayoutWrapper>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/alert-incident-management',
    element: (
      <MainLayoutWrapper
        sideBarContent={<></>}
        pageTitle="Alert/Incident Management"
      >
        <TicketPage />
      </MainLayoutWrapper>
    ),
  },
  {
    path: '/alert-incident-management/alert/:id',
    element: (
      <MainLayoutWrapper
        sideBarContent={<></>}
        pageTitle="Alert Incident Detail"
      >
        <TicketDetail tag="alert" />
      </MainLayoutWrapper>
    ),
  },
  {
    path: '/alert-incident-management/incident/:id',
    element: (
      <MainLayoutWrapper sideBarContent={<></>} pageTitle="Incident Detail">
        <TicketDetail tag="incident" />
      </MainLayoutWrapper>
    ),
  },
  {
    path: '/chat',
    element: (
      <MainLayoutWrapper sideBarContent={<></>} pageTitle="Chat">
        <ChatPage />
      </MainLayoutWrapper>
    ),
  },
  {
    path: '/chat/thread/:threadId',
    element: (
      <MainLayoutWrapper sideBarContent={<></>} pageTitle="Chat Thread">
        <ChatPage />
      </MainLayoutWrapper>
    ),
  },
  {
    path: '/logs',
    element: (
      <MainLayoutWrapper sideBarContent={<></>} pageTitle="Log Explorer">
        <LogExplorer />
      </MainLayoutWrapper>
    ),
  },
  {
    path: '/health',
    element: (
      <MainLayoutWrapper sideBarContent={<></>} pageTitle="Health Dashboard">
        <HealthDashboard />
      </MainLayoutWrapper>
    ),
  },
]);
