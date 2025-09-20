export type TicketStatus = 'CLOSED' | 'RECOVERED' | 'RECOVERING' | 'OPEN';

export type TicketSeverity = 'S1' | 'S2' | 'S3';

export type TicketType = 'ĐANG XẢY RA' | 'ĐÃ GIẢI QUYẾT';

export interface Ticket {
  id: string;
  summary: string;
  status: TicketStatus;
  severity: TicketSeverity;
  incidentType: TicketType;
  created: string;
  updated: string;
}

export const ticketStatusColors: Record<TicketStatus, string> = {
  CLOSED: 'bg-green-600 text-white',
  RECOVERED: 'bg-lime-500 text-white',
  RECOVERING: 'bg-blue-400 text-white',
  OPEN: 'bg-yellow-500 text-white',
};

export const severityColors: Record<TicketSeverity, string> = {
  S1: 'bg-red-600 text-white',
  S2: 'bg-orange-500 text-white',
  S3: 'bg-pink-300 text-white',
};

export const incidentTypeColors: Record<TicketType, string> = {
  'ĐANG XẢY RA': 'bg-orange-500 text-white',
  'ĐÃ GIẢI QUYẾT': 'bg-blue-500 text-white',
};
