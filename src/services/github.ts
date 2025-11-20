import { Repository } from "../types";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

export async function fetchGitHubProjects(): Promise<Repository[]> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error("⚠ Missing GitHub Token! Add it to your Vercel environment variables.");
    return [];
  }

  const query = `
    {
      user(login: "GuilhermeSotti") {
        repositories(first: 50, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            name
            description
            url
            updatedAt
            stargazerCount
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("GitHub API Error:", await res.text());
    return [];
  }

  const json = await res.json();
  return json?.data?.user?.repositories?.nodes || [];
}
