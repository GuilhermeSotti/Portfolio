// src/types/linkedin.ts
export type ExperienceItem = {
  id?: string;
  title: string;
  company?: string;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
};

export type ProjectItem = {
  id?: string;
  name: string;
  description?: string | null;
  url?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  metrics?: Record<string, number> | null;
};

/**
 * Raw debug information returned by the scraper.
 * Expand here se quiser adicionar novos campos no futuro.
 */
export type LinkedInRawInfo = {
  jsonLd?: any;
  og?: Record<string, string | undefined>;
  errorStatus?: number;
  bodySnippet?: string;
  error?: string;
  // permissive bag for anything else
  [k: string]: any;
};

export type LinkedInPublicProfile = {
  sourceUrl: string;
  fullName?: string | null;
  headline?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  summary?: string | null;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  raw?: LinkedInRawInfo;
};
