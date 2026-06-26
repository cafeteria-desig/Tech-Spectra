export interface Registration {
  id?: string;
  full_name: string;
  college_name: string;
  email: string;
  phone: string;
  id_card_url: string;
  events_selected: string[];
  seat_number: string;
  hackathon_problem?: string;
  shark_tank_problem?: string;
  registered_at?: string;
}

export interface TeamMember {
  id?: string;
  team_id?: string;
  member_name: string;
  member_email: string;
  id_card_url: string;
  seat_number: string;
  registered_at?: string;
}

export interface Team {
  id?: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  college_name: string;
  events_selected: string[];
  hackathon_problem?: string;
  shark_tank_problem?: string;
  registered_at?: string;
  members?: TeamMember[];
}

export interface Seat {
  id: string; // e.g. "A1", "B5"
  booked: boolean;
}

export type Page = 'home' | 'events' | 'schedule' | 'register' | 'contact' | 'admin' | 'admin-login';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  baseX?: number;
  baseY?: number;
  isDispersed?: boolean;
  angle?: number;
}
