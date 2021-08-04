export interface User {
  id?: number;
  username: string;
  password: string;
  email_address: string;
  registered_ip: string;
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

interface JobProgress {
  current: number;
  total: number;
}

export interface Job {
  id: number;
  threads: number;
  mode: number;
  min_level: number;
  capture_bans: number;
  hits: number;
  fails: number;
  progress: JobProgress;
  run_time: number;
  status: "Running" | "Paused" | "Completed";
}

export type ComboResult = "Success" | "Failed";

export interface Combo {
  id: number;
  job_id: number;
  username: string;
  password: string;
  status: "Pending" | "Completed";
  result: ComboResult;
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