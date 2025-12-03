export const config = {
  github: {
    user: process.env.NEXT_PUBLIC_GITHUB_USER || '',
    token: process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || ''
  },
  linkedin: {
    publicProfileUrl: process.env.NEXT_PUBLIC_LINKEDIN_PUBLIC_URL || ''
  },
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || ''
  }
};
