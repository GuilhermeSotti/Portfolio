import fs from "fs";
import path from "path";
import type { GetStaticProps } from "next";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import { fetchRepos } from "../services/github";
import { Repository, ProjectGains } from "../types";
import { BarGain, RadarGain } from "../components/MetricsChart";
import TimelineChart from "../components/TimelineChart";

type HomeProps = {
  repos: Repository[];
  gainsMap: Record<string, ProjectGains>;
};

export default function Home({ repos, gainsMap }: HomeProps) {
  return (
    <>
      <Hero />
      <section id="projects" className="my-8">
        <h2 className="text-2xl font-semibold mb-4">Projetos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((r) => (
            <ProjectCard key={r.id} repo={r} />
          ))}
        </div>
      </section>

      <section id="metrics" className="my-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Métricas de Ganhos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div aria-hidden={false}>
            <h3 className="font-medium mb-2">Exemplo de categorias (por projeto)</h3>
            {Object.values(gainsMap)[0] ? <BarGain entries={Object.values(gainsMap)[0].entries} /> : <p className="text-sm text-gray-500">Nenhum dado de ganho encontrado</p>}
          </div>

          <div>
            <h3 className="font-medium mb-2">Evolução (timeline)</h3>
            {Object.values(gainsMap)[0] ? <TimelineChart timeline={Object.values(gainsMap)[0].timeline} /> : <p className="text-sm text-gray-500">Nenhuma timeline encontrada</p>}
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const githubUser = process.env.NEXT_PUBLIC_GITHUB_USER;
  const token = process.env.GITHUB_TOKEN;
  let repos: Repository[] = [];

  try {
    if (!githubUser) {
      throw new Error("NEXT_PUBLIC_GITHUB_USER não configurado");
    }
    repos = await fetchRepos(githubUser, token ?? "");
  } catch (err: any) {
    console.error("Erro ao buscar repositórios:", err.message || err);
    repos = [];
  }

  // Lê ganhos do arquivo JSON local
  const gainsPath = path.join(process.cwd(), "data", "gains.example.json");
  let rawGains: Record<string, any> = {};
  if (fs.existsSync(gainsPath)) {
    rawGains = JSON.parse(fs.readFileSync(gainsPath, "utf-8"));
  }

  // Mapeia por repo-name — se não houver gains para repo, fica vazio
  const gainsMap: Record<string, ProjectGains> = {};
  for (const r of repos) {
    const key = r.name;
    const g = rawGains[key];
    gainsMap[key] = {
      repoName: key,
      entries: g?.entries ?? [],
      timeline: g?.timeline ?? []
    };
  }

  return {
    props: {
      repos,
      gainsMap
    },
    revalidate: 60
  };
};
