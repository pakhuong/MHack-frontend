import { createBrowserRouter } from 'react-router-dom';
import TicketPage from '../pages/Tickets';
import ChatPage from '../pages/Chat';
import { MainLayoutWrapper } from '../components/layout';
import { ChatFavorites } from '@/components/chat/chat-favorites';

export const router = createBrowserRouter([
  {
    path: '/ticket',
    element: (
      <MainLayoutWrapper sideBarContent={<></>} pageTitle="Tickets">
        <TicketPage />
      </MainLayoutWrapper>
    ),
  },
  {
    path: '/chat',
    element: (
      <MainLayoutWrapper sideBarContent={<ChatFavorites />} pageTitle="Chat">
        <ChatPage />
      </MainLayoutWrapper>
    ),
  },
]);
