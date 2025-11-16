import fs from "fs";
import path from "path";
import { GetStaticPaths, GetStaticProps } from "next";
import { fetchRepos } from "../../services/github";
import { Repository, ProjectGains } from "../../types";
import TimelineChart from "../../components/TimelineChart";
import { RadarGain } from "../../components/MetricsChart";

type Props = {
  repo?: Repository;
  gains?: ProjectGains;
};

export default function ProjectPage({ repo, gains }: Props) {
  if (!repo) {
    return <div>Projeto não encontrado</div>;
  }
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">{repo.name}</h1>
        <p className="text-gray-600">{repo.description}</p>
      </header>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Ganhos</h2>
        {gains && gains.entries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <RadarGain entries={gains.entries} />
            </div>
            <div>
              <h3 className="mb-2 font-medium">Evolução</h3>
              <TimelineChart timeline={gains.timeline} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Nenhum dado de ganhos disponível para este projeto.</p>
        )}
      </section>

      <section>
        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
          Abrir no GitHub
        </a>
      </section>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const githubUser = process.env.NEXT_PUBLIC_GITHUB_USER;
  const token = process.env.GITHUB_TOKEN;
  const repos = await fetchRepos(githubUser ?? "", token ?? "");
  const paths = repos.map((r) => ({ params: { name: r.name } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const githubUser = process.env.NEXT_PUBLIC_GITHUB_USER;
  const token = process.env.GITHUB_TOKEN;
  const repoName = String(params?.name ?? "");

  const repos = await fetchRepos(githubUser ?? "", token ?? "");
  const repo = repos.find((r) => r.name === repoName) ?? null;

  const gainsPath = path.join(process.cwd(), "data", "gains.example.json");
  let rawGains: Record<string, any> = {};
  if (fs.existsSync(gainsPath)) rawGains = JSON.parse(fs.readFileSync(gainsPath, "utf-8"));

  const gains: ProjectGains = {
    repoName,
    entries: rawGains[repoName]?.entries ?? [],
    timeline: rawGains[repoName]?.timeline ?? []
  };

  return { props: { repo, gains }, revalidate: 60 };
};
