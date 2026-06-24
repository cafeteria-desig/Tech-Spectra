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
