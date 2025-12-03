import fs from 'fs';
import path from 'path';
import { fetchRepos } from '../services/githubService';
import { fetchPublicLinkedInProfile } from '../services/linkedinService';
import { Repository, ProjectGains } from '../types';
import { LinkedInPublicProfile } from '../types/linkedin';
import { config } from '../config/default';

export async function getHomeData(): Promise<{ repos: Repository[]; gainsMap: Record<string, ProjectGains>; linkedin: LinkedInPublicProfile | null; }>{
  const ghUser = config.github.user;
  const ghToken = config.github.token;

  let repos: Repository[] = [];
  try{
    repos = await fetchRepos(ghUser, ghToken);
  }catch(err){
    console.error('Erro fetchRepos', err);
    repos = [];
  }

  const gainsFile = path.join(process.cwd(), 'data', 'gains.example.json');
  const gainsMap: Record<string, ProjectGains> = {};
  if (fs.existsSync(gainsFile)){
    try{
      const raw = JSON.parse(fs.readFileSync(gainsFile, 'utf8'));
      Object.assign(gainsMap, raw);
    }catch(err){
      console.warn('Erro ao ler gains.example.json', err);
    }
  }

  let linkedin = null;
  try{
    if (config.linkedin.publicProfileUrl){
      linkedin = await fetchPublicLinkedInProfile(config.linkedin.publicProfileUrl);
    }
  }catch(err){
    console.warn('Erro fetch LinkedIn', err);
  }

  return { repos, gainsMap, linkedin };
}
