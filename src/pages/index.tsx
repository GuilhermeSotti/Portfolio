import fs from "fs";
import path from "path";
import Head from "next/head";
import type { GetStaticProps } from "next/types";
import type { ReactElement } from "react";
import { Repository, ProjectGains } from "../types";
import { fetchRepos } from "../services/github";
import { getMergedLinkedInProfile } from "../services/linkedin";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import ProfileCard from "../components/ProfileCard";
import TimelineChart from "../components/TimelineChart";
import { BarGain } from "../components/MetricsChart";

type HomeProps = {
  repos: Repository[];
  gainsMap: Record<string, ProjectGains>;
  linkedin: {
    id?: string;
    fullName: string;
    headline?: string;
    email?: string | null;
    avatarUrl?: string | null;
    experiences: Array<any>;
    projects: Array<any>;
    summary?: string;
  };
};

const Home = ({ repos, gainsMap, linkedin }: HomeProps): ReactElement => {
  const firstGainProjectKey = Object.keys(gainsMap).find((k) => (gainsMap[k]?.entries?.length ?? 0) > 0) ?? null;
  const firstGain = firstGainProjectKey ? gainsMap[firstGainProjectKey] : null;

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
        <title>{linkedin?.fullName ?? "Portfólio"} — Portfólio</title>
        <meta name="description" content={linkedin?.summary ?? "Portfólio técnico e projetos"} />
        <meta property="og:title" content={`${linkedin?.fullName ?? "Portfólio"} — Portfólio`} />
        <meta property="og:description" content={linkedin?.summary ?? "Portfólio técnico e projetos"} />
      </Head>

      <Hero />

      <div className="container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Profile + contact */}
          <aside className="order-2 lg:order-1">
            <ProfileCard profile={linkedin} />
            <section className="card mt-6">
              <h3 className="text-lg font-semibold mb-3">Contato</h3>
              <p className="text-sm text-gray-400">
                {linkedin?.email ? (
                  <a href={`mailto:${linkedin.email}`} className="text-accent hover:underline">
                    {linkedin.email}
                  </a>
                ) : (
                  "Email não disponível"
                )}
              </p>
              <div className="mt-4">
                <a href={`https://www.linkedin.com/in/${linkedin?.id ?? ""}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
                  Ver perfil no LinkedIn
                </a>
              </div>
            </section>

            <section className="card mt-6">
              <h3 className="text-lg font-semibold mb-3">Resumo</h3>
              <p className="text-sm text-gray-300">{linkedin?.summary ?? "Sem resumo disponível."}</p>
            </section>
          </aside>

          {/* Middle column: Projects list */}
          <main className="order-1 lg:order-2 lg:col-span-2">
            <section id="projects" className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Projetos</h2>

              {repos.length === 0 ? (
                <p className="text-sm text-gray-400">Nenhum repositório encontrado. Verifique o usuário GitHub ou o token de API.</p>
              ) : (
                <div className="projects-grid">
                  {repos.map((repo) => (
                    <ProjectCard key={repo.id} repo={repo} />
                  ))}
                </div>
              )}
            </section>

            <section id="metrics" className="card mt-6">
              <h3 className="text-lg font-semibold mb-3">Métricas e Ganhos</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Agregados por categoria</h4>
                  {aggregatedEntries.length > 0 ? (
                    <div className="chart-wrap">
                      {/* Reaproveita o BarGain component */}
                      <BarGain entries={aggregatedEntries} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Nenhum dado de ganhos agregado disponível.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Exemplo de evolução</h4>
                  {firstGain && firstGain.timeline && firstGain.timeline.length > 0 ? (
                    <div className="chart-wrap">
                      <TimelineChart timeline={firstGain.timeline} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Nenhuma timeline disponível para exemplo.</p>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <footer className="site-footer container">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} {linkedin?.fullName ?? "Autor"}</div>
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
  const githubUser = process.env.NEXT_PUBLIC_GITHUB_USER;
  const githubToken = process.env.GITHUB_TOKEN;
  const linkedinToken = process.env.LINKEDIN_ACCESS_TOKEN;

  let repos: Repository[] = [];
  let gainsMap: Record<string, ProjectGains> = {};
  let linkedinData = {
    id: undefined,
    fullName: "Autor",
    headline: "",
    email: null,
    avatarUrl: null,
    experiences: [],
    projects: [],
    summary: ""
  };

  try {
    if (githubUser) {
      repos = await fetchRepos(githubUser, githubToken ?? "");
    } else {
      console.warn("NEXT_PUBLIC_GITHUB_USER not set - skipping GitHub fetch");
    }
  } catch (err) {
    console.error("Erro ao buscar repositórios:", err);
    repos = [];
  }

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
    gainsMap = {};
  }

  try {
    const merged = await getMergedLinkedInProfile(linkedinToken);
    linkedinData = {
      id: merged.id,
      fullName: merged.fullName ?? "Autor",
      headline: merged.headline ?? "",
      email: merged.email ?? null,
      avatarUrl: merged.avatarUrl ?? null,
      experiences: merged.experiences ?? [],
      projects: merged.projects ?? [],
      summary: merged.summary ?? ""
    };
  } catch (err) {
    console.error("Erro ao buscar LinkedIn / mesclar dados:", err);
  }

  for (const r of repos) {
    if (!gainsMap[r.name]) {
      gainsMap[r.name] = { repoName: r.name, entries: [], timeline: [] };
    }
  }

  return {
    props: {
      repos,
      gainsMap,
      linkedin: linkedinData
    },
    revalidate: 60
  };
};

export default Home;
