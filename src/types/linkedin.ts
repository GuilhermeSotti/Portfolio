export type LinkedInApiProfile = {
  id: string;
  localizedFirstName?: string;
  localizedLastName?: string;
  localizedHeadline?: string;
  profilePicture?: any;
};

export type LinkedInEmailResponse = {
  elements: Array<{
    'handle~'?: {
      emailAddress?: string;
    };
  }>;
};

export type ExperienceItem = {
  id?: string;
  title: string;
  company?: string;
  startDate?: string;
  endDate?: string | null;
  location?: string;
  description?: string;
};

export type ProjectItem = {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string | null;
  metrics?: Record<string, number>;
};

export type LinkedInMergedProfile = {
  id?: string;
  fullName: string;
  headline?: string;
  email?: string | null;
  avatarUrl?: string | null;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  summary?: string;
};
