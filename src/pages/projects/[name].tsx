import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { fetchRepos } from '../../services/githubService';
import { Repository } from '../../types';

type Props = { project?: Repository };

export const getStaticPaths: GetStaticPaths = async () => {
  const repos = await fetchRepos(process.env.NEXT_PUBLIC_GITHUB_USER || '', process.env.GITHUB_TOKEN || '');
  const paths = repos.map((r) => ({ params: { name: r.name } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const name = ctx.params?.name as string;
  const repos = await fetchRepos(process.env.NEXT_PUBLIC_GITHUB_USER || '', process.env.GITHUB_TOKEN || '');
  const project = repos.find((r) => r.name === name) || null;
  if (!project) return { notFound: true };
  return { props: { project }, revalidate: 3600 };
};

export default function ProjectPage({ project }: Props) {
  if (!project) return <div>Projeto não encontrado</div>;
  return (
    <main>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <a href={project.url} target="_blank" rel="noreferrer">Ver no GitHub</a>
    </main>
  );
}
