export interface Repository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
}

export type GainEntry = { label: string; value: number };
export type GainTimeline = { date: string; value: number };

export interface ProjectGains {
  repoName: string;
  entries: GainEntry[];
  timeline: GainTimeline[];
}
