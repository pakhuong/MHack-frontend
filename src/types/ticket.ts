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

export type TicketSeverity = 'critical' | 'high' | 'medium';

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

export interface AlerIncident {
  incident_id: string;
  service: string;
  start_time: string;
  severity: string;
  impact: {
    users: number;
    region: string;
  };
  anomalies: {
    metric: string;
    change: string;
    value: string;
  }[];
  log_clusters: string[];
  change_event: string;
  cause: string;
  timeline: {
    time: string;
    event: string;
  }[];
  suggested_solution: string;
  preventive_plan: string;
  status: string;
  assignee: string;
  reporter: string;
  priority: string;
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
  critical: 'red',
  high: 'orange',
  medium: 'yellow',
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
