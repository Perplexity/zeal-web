export interface User {
  id: number;
  username: string;
  email_address: string;
  license?: License;
  combo_stats?: ComboStats;
}

export interface License {
  name: string;
  key: string;
  date_redeemed: number;
  date_expires: number;
  job_limit: number;
  thread_limit: number;
  combo_limit: number;
}

export interface BasicCombo {
  username: string;
  password: string;
}

interface JobProgress {
  current: number;
  total: number;
}

export interface Job {
  id: number;
  threads: number;
  region: string;
  mode: number;
  min_level: number;
  capture_bans: number;
  hits: number;
  fails: number;
  progress: JobProgress;
  run_time: number;
  status: "Running" | "Paused" | "Completed";
}

export interface ComboStats {
  hits: number;
  failed: number;
  pending: number;
}

export interface Queue {
  rank: string;
  lp: number;
  wins: number;
  losses: number;
}

export interface Summoner {
  id: number;
  region: string;
  username: string;
  password: string;
  email_verified: number;
  phone_verified: number;
  summoner_name: string;
  level: number;
  last_played: number;
  solo_queue: Queue;
  flex_queue: Queue;
  riot_points: number;
  blue_essence: number;
  refund_credits: number;
  refundable_rp: number;
  refundable_be: number;
  champions: string[];
  skins: string[];
  banned: number;
  toxic_banned: number;
}
