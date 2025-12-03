import cheerio from 'cheerio';
import { LinkedInPublicProfile } from '../types/linkedin';

function normalizeProfileUrl(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://www.linkedin.com/in/${trimmed}`;
}

async function fetchHTML(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (PortfolioScraper)' } });
  if (!res.ok) throw new Error(`Failed to fetch LinkedIn url: ${res.status}`);
  return res.text();
}

export async function fetchPublicLinkedInProfile(input?: string | null): Promise<LinkedInPublicProfile> {
  const url = normalizeProfileUrl(input);
  if (!url) throw new Error('LinkedIn public URL inválido');
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);

  // Extração básica: se houver JSON-LD, tenta usar, caso contrário busca elementos
  const jsonLdText = $('script[type="application/ld+json"]').first().html();
  const jsonLd = jsonLdText ? JSON.parse(jsonLdText) : null;

  const profile: LinkedInPublicProfile = {
    sourceUrl: url,
    fullName: jsonLd?.name ?? $('h1').first().text() ?? null,
    headline: jsonLd?.headline ?? $('h2').first().text() ?? null,
    location: null,
    avatarUrl: $('img').first().attr('src') ?? null,
    summary: jsonLd?.description ?? null,
    experiences: [],
    projects: [],
    raw: { jsonLd }
  };

  return profile;
}
