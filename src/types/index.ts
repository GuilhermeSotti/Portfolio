export type Repository = {
  id: string;
  name: string;
  description?: string | null;
  url: string;
  stars?: number;
  forks?: number;
  language?: string;
  updatedAt?: string;
};

export type ProjectGains = {
  revenue?: string;
  notes?: string;
};
