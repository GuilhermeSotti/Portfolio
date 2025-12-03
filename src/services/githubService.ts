import { Repository } from "../types";

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

export async function fetchRepos(githubUser: string, token: string): Promise<Repository[]> {
  if (!githubUser) return [];
  if (!token) {
    // retorna vazio em vez de falhar para não quebrar o site em ambientes sem token
    console.warn('GITHUB token não fornecido - retornando lista vazia de repositórios');
    return [];
  }

  const query = `
    query ($login: String!) {
      user(login: $login) {
        repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            id
            name
            description
            url
            stargazerCount
            forksCount
            primaryLanguage { name }
            updatedAt
          }
        }
      }
    }`;

  const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables: { login: githubUser } })
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const json = await res.json();
  const nodes = json?.data?.user?.repositories?.nodes ?? [];

  return nodes.map((r: any) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    url: r.url,
    stars: r.stargazerCount,
    forks: r.forksCount,
    language: r.primaryLanguage?.name ?? '',
    updatedAt: r.updatedAt
  }));
}
