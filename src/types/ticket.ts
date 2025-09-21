export type TicketStatus =
  | 'CLOSED'
  | 'RECOVERED'
  | 'RECOVERING'
  | 'OPEN'
  | 'DONE'
  | 'IN_PROGRESS'
  | 'TODO'
  | 'NEED_TEST'
  | 'TESTING';

export type TicketSeverity = 'S1' | 'S2' | 'S3';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TicketType = 'HAPPENING' | 'RESOLVED';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  thumbnail?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  created: string;
  updated?: string;
}

export interface Ticket {
  id: string;
  summary: string;
  description?: string;
  status: TicketStatus;
  severity: TicketSeverity;
  priority: TicketPriority;
  incidentType: TicketType;
  created: string;
  updated: string;
  assignee?: User;
  reporter?: User;
  labels?: string[];
  attachments?: Attachment[];
  comments?: Comment[];
  development?: {
    branches: number;
    commits: number;
    pullRequests: number;
    lastCommit?: string;
  };
}

export const ticketStatusColors: Record<TicketStatus, string> = {
  CLOSED: 'green',
  RECOVERED: 'lime',
  RECOVERING: 'blue',
  OPEN: 'yellow',
  DONE: 'green',
  IN_PROGRESS: 'blue',
  TODO: 'gray',
  NEED_TEST: 'orange',
  TESTING: 'purple',
};

export const severityColors: Record<TicketSeverity, string> = {
  S1: 'red',
  S2: 'orange',
  S3: 'pink',
};

export const priorityColors: Record<TicketPriority, string> = {
  LOW: 'green',
  MEDIUM: 'blue',
  HIGH: 'orange',
  URGENT: 'red',
};

export const incidentTypeColors: Record<TicketType, string> = {
  HAPPENING: 'orange',
  RESOLVED: 'blue',
};
