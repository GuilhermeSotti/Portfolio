import fs from "fs";
import path from "path";
import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next/types";
import React from "react";

import { fetchRepos } from "../services/github";
import { fetchPublicLinkedInProfile } from "../services/linkedin";

type Repository = {
  id: string;
  name: string;
  description?: string | null;
  url: string;
  stars?: number;
  forks?: number;
  language?: string | null;
  updatedAt?: string;
};

type GainEntry = { label: string; value: number };
type GainTimeline = { date: string; value: number };
type ProjectGains = {
  repoName: string;
  entries: GainEntry[];
  timeline: GainTimeline[];
};

type ExperienceItem = {
  id?: string;
  title: string;
  company?: string;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
};

type ProjectItem = {
  id?: string;
  name: string;
  description?: string | null;
  url?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  metrics?: Record<string, number> | null;
};

type LinkedInPublicProfile = {
  sourceUrl: string;
  fullName?: string | null;
  headline?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  summary?: string | null;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  raw?: any;
};

type HomeProps = {
  repos: Repository[];
  gainsMap: Record<string, ProjectGains>;
  linkedin: LinkedInPublicProfile;
};

/* ---------------------------
   Small presentational components in-file (safe fallback)
   ---------------------------*/

const ProfileCard: React.FC<{ profile: LinkedInPublicProfile }> = ({ profile }) => {
  return (
    <section className="card mb-6">
      <div className="flex items-center gap-4">
        {profile.avatarUrl ? (
          // Use plain <img> for svg support and to avoid next/image warnings
          <img src={profile.avatarUrl} alt={profile.fullName ?? "Avatar"} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-700" />
        )}

        <div>
          <h2 className="text-2xl font-bold">{profile.fullName ?? "Autor"}</h2>
          {profile.headline && <p className="text-sm text-gray-400">{profile.headline}</p>}
          {profile.location && <p className="text-sm text-gray-500 mt-1">{profile.location}</p>}
        </div>
      </div>

      {profile.summary && <p className="mt-4 text-sm text-gray-300">{profile.summary}</p>}
    </section>
  );
};

const SimpleProjectCard: React.FC<{ repo: Repository }> = ({ repo }) => {
  return (
    <article className="project-card surface">
      <h3 className="text-lg font-semibold">{repo.name}</h3>
      <p className="text-sm text-gray-300 mt-1">{repo.description ?? "Sem descrição"}</p>
      <div className="mt-3 text-sm text-gray-400 flex gap-3">
        {typeof repo.stars === "number" && <span>⭐ {repo.stars}</span>}
        {repo.language && <span>• {repo.language}</span>}
      </div>
      <div className="mt-4 flex gap-2">
        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm">
          Ver no GitHub
        </a>
        <Link href={`/projects/${encodeURIComponent(repo.name)}`}>
          <a className="ml-auto text-sm btn-ghost px-3 py-1 rounded">Detalhes</a>
        </Link>
      </div>
    </article>
  );
};

/* ---------------------------
   Utility: merge public profile with local fallback file
   ---------------------------*/
function mergeWithLocalFallback(linked: LinkedInPublicProfile): LinkedInPublicProfile {
  const p = path.join(process.cwd(), "data", "linkedin.example.json");
  if (!fs.existsSync(p)) {
    return linked;
  }
  try {
    const localRaw = fs.readFileSync(p, "utf-8");
    const local = JSON.parse(localRaw);
    return {
      ...linked,
      fullName: linked.fullName ?? local.fullName ?? undefined,
      headline: linked.headline ?? local.headline ?? undefined,
      summary: linked.summary ?? local.summary ?? undefined,
      avatarUrl: linked.avatarUrl ?? local.avatarUrl ?? undefined,
      experiences: (linked.experiences && linked.experiences.length > 0) ? linked.experiences : (local.experiences ?? []),
      projects: (linked.projects && linked.projects.length > 0) ? linked.projects : (local.projects ?? []),
      // preserve raw if present
      raw: linked.raw ?? local.raw ?? undefined,
    };
  } catch (err) {
    // if local parse fails, return linked as-is
    console.error("Erro ao mesclar linkedin.example.json:", err);
    return linked;
  }
}

/* ---------------------------
   Page Component + getStaticProps
   ---------------------------*/

const Home: React.FC<HomeProps> = ({ repos, gainsMap, linkedin }) => {
  const firstGainKey = Object.keys(gainsMap).find((k) => (gainsMap[k]?.entries?.length ?? 0) > 0) ?? null;
  const firstGain = firstGainKey ? gainsMap[firstGainKey] : null;

  const aggregatedByLabel = Object.values(gainsMap).reduce<Record<string, number>>((acc, g) => {
    if (!g?.entries) return acc;
    for (const e of g.entries) {
      acc[e.label] = (acc[e.label] || 0) + (e.value ?? 0);
    }
    return acc;
  }, {});

  const aggregatedEntries = Object.entries(aggregatedByLabel).map(([label, value]) => ({ label, value }));

  return (
    <>
      <Head>
        <title>{linkedin.fullName ?? "Portfólio"} — Portfólio</title>
        <meta name="description" content={linkedin.summary ?? "Portfólio profissional"} />
      </Head>

      {/* Hero */}
      <section className="hero container">
        <div className="left">
          <h1 className="fade-up text-4xl font-bold">{linkedin.fullName ?? "Seu Nome"}</h1>
          <p className="lead mt-2">{linkedin.headline ?? "Desenvolvedor Front-end"}</p>
          <div className="mt-6">
            <a href="#projects" className="btn btn-primary">{/* CTA textual */}Ver Projetos</a>
          </div>
        </div>

        <div>
          <div className="avatar">
            <img src={linkedin.avatarUrl ?? "/avatar.svg"} alt={linkedin.fullName ?? "Avatar"} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <div className="container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <aside className="order-2 lg:order-1">
            <ProfileCard profile={linkedin} />

            <section className="card mt-6">
              <h3 className="text-lg font-semibold mb-3">Contato</h3>
              <p className="text-sm text-gray-400">
                {linkedin.summary ? linkedin.summary : "Resumo não disponível."}
              </p>
              <div className="mt-4">
                <a href={linkedin.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full inline-block text-center">
                  Ver LinkedIn público
                </a>
              </div>
            </section>
          </aside>

          {/* Main column */}
          <main className="order-1 lg:order-2 lg:col-span-2">
            <section id="projects" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Projetos</h2>
              {repos.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhum repositório encontrado.</p>
              ) : (
                <div className="projects-grid">
                  {repos.map((r) => (
                    <SimpleProjectCard key={r.id} repo={r} />
                  ))}
                </div>
              )}
            </section>

            <section id="metrics" className="card mt-6">
              <h3 className="text-lg font-semibold mb-3">Métricas de Ganhos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Agregados</h4>
                  {aggregatedEntries.length > 0 ? (
                    <ul className="space-y-2">
                      {aggregatedEntries.map((e) => (
                        <li key={e.label} className="flex justify-between text-sm text-gray-200">
                          <span>{e.label}</span>
                          <span>{e.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">Nenhum dado de ganho disponível.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Exemplo de evolução</h4>
                  {firstGain && firstGain.timeline && firstGain.timeline.length > 0 ? (
                    <div className="chart-wrap">
                      {/* Minimal timeline rendering as list if chart component not present */}
                      <ol className="text-sm space-y-1">
                        {firstGain.timeline.map((t) => (
                          <li key={t.date} className="flex justify-between">
                            <span>{t.date}</span>
                            <span>{t.value}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Nenhuma timeline disponível.</p>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <footer className="site-footer container">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} {linkedin.fullName ?? "Autor"}</div>
          <div className="text-sm">
            <a href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USER ?? ""}`} target="_blank" rel="noreferrer" className="hover:underline">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const githubUser = process.env.NEXT_PUBLIC_GITHUB_USER ?? process.env.GITHUB_USERNAME ?? "";
  const githubToken = process.env.GITHUB_TOKEN ?? "";
  const publicLinkedinUrl = process.env.PUBLIC_LINKEDIN_URL ?? "";

  let repos: Repository[] = [];
  const gainsMap: Record<string, ProjectGains> = {};
  let linkedinProfile: LinkedInPublicProfile = {
    sourceUrl: publicLinkedinUrl,
    fullName: null,
    headline: null,
    location: null,
    avatarUrl: null,
    summary: null,
    experiences: [],
    projects: [],
    raw: {}
  };

  // 1) GitHub repos (server-side)
  try {
    if (githubUser) {
      // fetchRepos should be implemented server-side and accept (user, token) — adjust if necessary
      // Here we try both shapes (previous code used fetchRepos(user, token))
      try {
        // try named export fetchRepos(user, token)
        // @ts-ignore
        repos = await fetchRepos(githubUser, githubToken);
      } catch (err) {
        console.warn("fetchRepos(user, token) failed, trying fetchRepos()");
        try {
          // @ts-ignore
          repos = await fetchRepos();
        } catch (err2) {
          console.error("fetchRepos fallback failed:", err2);
          repos = [];
        }
      }
    }
  } catch (err) {
    console.error("Erro ao buscar repositórios:", err);
    repos = [];
  }

  // 2) Gains: read local data/gains.example.json as fallback
  try {
    const gainsPath = path.join(process.cwd(), "data", "gains.example.json");
    if (fs.existsSync(gainsPath)) {
      const raw = fs.readFileSync(gainsPath, "utf-8");
      const rawGains = JSON.parse(raw);
      for (const repoName of Object.keys(rawGains)) {
        const entry = rawGains[repoName];
        gainsMap[repoName] = {
          repoName,
          entries: entry.entries ?? [],
          timeline: entry.timeline ?? []
        };
      }
    }
  } catch (err) {
    console.error("Erro ao carregar gains local:", err);
  }

  // 3) LinkedIn public scraping (server-side)
  try {
    const fetched = await fetchPublicLinkedInProfile(publicLinkedinUrl);
    linkedinProfile = mergeWithLocalFallback(fetched);
  } catch (err) {
    console.error("Erro scraping LinkedIn público:", err);
    // fallback: try local file if exists
    try {
      const p = path.join(process.cwd(), "data", "linkedin.example.json");
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf-8");
        const local = JSON.parse(raw);
        linkedinProfile = {
          sourceUrl: publicLinkedinUrl,
          fullName: local.fullName ?? null,
          headline: local.headline ?? null,
          location: local.location ?? null,
          avatarUrl: local.avatarUrl ?? null,
          summary: local.summary ?? null,
          experiences: local.experiences ?? [],
          projects: local.projects ?? [],
          raw: { fallback: true }
        };
      }
    } catch (err2) {
      console.error("Erro ao carregar linkedin.example.json fallback:", err2);
    }
  }

  // Ensure every repo has a gains entry (so project pages don't break)
  for (const r of repos) {
    if (!gainsMap[r.name]) {
      gainsMap[r.name] = { repoName: r.name, entries: [], timeline: [] };
    }
  }

  return {
    props: {
      repos,
      gainsMap,
      linkedin: linkedinProfile
    },
    // revalidate every hour to avoid frequent scraping (adjust as needed)
    revalidate: 3600
  };
};

export default Home;
