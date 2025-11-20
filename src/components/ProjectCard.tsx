import Link from "next/link";
import { Repository } from "../types";

export default function ProjectCard({ repo }: { repo: Repository }) {
  return (
    <article className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      <h3 className="font-semibold text-lg">{repo.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{repo.description ?? "Sem descrição"}</p>
      <div className="mt-3 text-sm text-gray-500 flex gap-3">
        <span>⭐ {repo.stars}</span>
        <span>🍴 {repo.forks}</span>
        {repo.language ? <span>• {repo.language}</span> : null}
      </div>
      <div className="mt-4 flex gap-2">
        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">Ver no GitHub</a>
        <Link href={`/projects/${encodeURIComponent(repo.name)}`} className="ml-auto text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded">Detalhes</Link>
      </div>
    </article>
  );
}
