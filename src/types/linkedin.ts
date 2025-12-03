export type ExperienceItem = {
  title?: string | null;
  company?: string | null;
  period?: string | null;
  description?: string | null;
};

export type ProjectItem = {
  title?: string | null;
  description?: string | null;
  link?: string | null;
};

export type LinkedInPublicProfile = {
  sourceUrl: string | null;
  fullName: string | null;
  headline: string | null;
  location: string | null;
  avatarUrl: string | null;
  summary: string | null;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  raw?: any;
};
