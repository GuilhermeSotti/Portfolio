import { Repository } from "../types";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

export async function fetchRepos(
  githubUser: string,
  token: string
): Promise<Repository[]> {
  if (!token) throw new Error("GITHUB_TOKEN not provided");

  const query = `
    query ($login: String!) {
      user(login: $login) {
        repositories(
          first: 100,
          orderBy: { field: UPDATED_AT, direction: DESC },
          privacy: PUBLIC
        ) {
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
    }
  `;

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { login: githubUser },
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("GitHub API Errors:", json.errors);
    throw new Error(JSON.stringify(json.errors));
  }

  const nodes = json.data?.user?.repositories?.nodes ?? [];

  return nodes.map((r: any) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    url: r.url,
    stars: r.stargazerCount,
    forks: r.forksCount,
    language: r.primaryLanguage?.name ?? "",
    updatedAt: r.updatedAt,
  }));
}