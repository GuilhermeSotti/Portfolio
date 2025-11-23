import { LinkedInApiProfile, LinkedInEmailResponse, LinkedInMergedProfile, ExperienceItem, ProjectItem } from "../types/linkedin";
import fs from "fs";
import path from "path";

/**
 * Server-side LinkedIn helper.
 * - Usa token server-side vindo de env (process.env.LINKEDIN_ACCESS_TOKEN)
 * - Busca dados básicos via API (/me e emailAddress)
 * - Se não existir token, usa fallback para `data/linkedin.example.json`
 *
 * NOTE: LinkedIn API fields dependem de permissões; code trata faltas graciosamente.
 */

const API_BASE = "https://api.linkedin.com/v2";

async function fetchLinkedInApi<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Restli-Protocol-Version": "2.0.0",
      Accept: "application/json"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function fetchLinkedInProfileFromApi(token: string): Promise<LinkedInApiProfile | null> {
  if (!token) return null;
  const projection = "?projection=(id,localizedFirstName,localizedLastName,localizedHeadline,profilePicture(displayImage~:playableStreams))";
  try {
    const profile = await fetchLinkedInApi<LinkedInApiProfile>(`/me${projection}`, token);
    return profile;
  } catch (err) {
    console.error("fetchLinkedInProfileFromApi error:", err);
    return null;
  }
}

export async function fetchLinkedInEmailFromApi(token: string): Promise<string | null> {
  if (!token) return null;
  try {
    const r = await fetchLinkedInApi<LinkedInEmailResponse>(`/emailAddress?q=members&projection=(elements*(handle~))`, token);
    const email = r?.elements?.[0]?.['handle~']?.emailAddress ?? null;
    return email;
  } catch (err) {
    console.error("fetchLinkedInEmailFromApi error:", err);
    return null;
  }
}

function extractAvatarUrl(profile: LinkedInApiProfile | null): string | null {
  try {
    const streams = profile?.profilePicture?.['displayImage~']?.elements ?? [];
    let url: string | null = null;
    for (const el of streams) {
      if (el?.identifiers && el.identifiers.length > 0) {
        const candidate = el.identifiers[0]?.identifier;
        if (candidate) url = candidate;
      }
    }
    return url;
  } catch {
    return null;
  }
}

function readLocalLinkedinData(): { summary?: string; experiences?: ExperienceItem[]; projects?: ProjectItem[] } {
  const p = path.join(process.cwd(), "data", "linkedin.example.json");
  if (!fs.existsSync(p)) return { experiences: [], projects: [] };
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

/**
 * Public method: getMergedProfile
 * - token optional: if present, try to fetch minimal profile + email
 * - merges with local data (experiences/projects) so the site always has complete info
 */
export async function getMergedLinkedInProfile(token?: string): Promise<LinkedInMergedProfile> {
  const cfg = readLocalLinkedinData();
  const profile = token ? await fetchLinkedInProfileFromApi(token) : null;
  const email = token ? await fetchLinkedInEmailFromApi(token) : null;

  const fullName = profile ? `${profile.localizedFirstName ?? ""} ${profile.localizedLastName ?? ""}`.trim() : (cfg.summary ? "" : "");
  const headline = profile?.localizedHeadline ?? undefined;
  const avatarUrl = extractAvatarUrl(profile) ?? null;

  const experiences = cfg.experiences ?? [];
  const projects = cfg.projects ?? [];

  const merged: LinkedInMergedProfile = {
    id: profile?.id,
    fullName: (fullName || (cfg as any).fullName) ?? "Nome do Autor",
    headline: headline ?? (cfg as any).headline ?? "",
    email: email ?? (cfg as any).email ?? null,
    avatarUrl: avatarUrl ?? (cfg as any).avatarUrl ?? null,
    experiences,
    projects,
    summary: (cfg as any).summary ?? ""
  };

  return merged;
}
