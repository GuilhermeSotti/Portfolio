import React from 'react';
import ThemeToggle from '../components/ThemeToggle';
import LocaleToggle from '../components/LocaleToggle';
import { GetStaticProps } from 'next';
import { getHomeData } from '../controllers/homeController';
import { useTranslate } from '../hooks/useTranslate';

export const getStaticProps: GetStaticProps = async () => {
  const data = await getHomeData();
  return { props: data, revalidate: 3600 };
};

export default function Home({ repos, gainsMap, linkedin }: any) {
  const { t } = useTranslate();

  const topics = [
    { id: 'about', title: t('topics.about.title'), desc: t('topics.about.desc') },
    { id: 'skills', title: t('topics.skills.title'), desc: t('topics.skills.desc') },
    { id: 'projects', title: t('topics.projects.title'), desc: t('topics.projects.desc') },
    { id: 'experience', title: t('topics.experience.title'), desc: t('topics.experience.desc') },
    { id: 'contact', title: t('topics.contact.title'), desc: t('topics.contact.desc') },
    { id: 'more', title: t('topics.more.title'), desc: t('topics.more.desc') }
  ];

  return (
    <>
      <header className="header full-bleed" role="banner">
        <div className="brand">
          <div className="logo" aria-hidden>
            {t('site.name').slice(0,2)}
          </div>
          <div>
            <strong>{t('site.name')}</strong>
            <div style={{ color: 'var(--muted)' }}>{t('site.description')}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <nav aria-label="Main">
            <a href="#projects" style={{ marginRight: 12 }}>{t('nav.projects')}</a>
            <a href="#contact">{t('nav.contact')}</a>
          </nav>

          <LocaleToggle />
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="hero">
          <a className="topic-card topic-card--big" href="#about">
            <div>
              <h3>{t('hero.greeting', { name: t('site.name') })}</h3>
              <p style={{ color: 'var(--muted)' }}>{t('hero.intro')}</p>
            </div>
          </a>

          {topics.map((tpc) => (
            <a key={tpc.id} className="topic-card" href={`#${tpc.id}`}>
              <h3>{tpc.title}</h3>
              <p>{tpc.desc}</p>
            </a>
          ))}
        </section>

        {/* Sections (ancoras) */}
        <section id="about" className="page-section" aria-labelledby="about-title">
          <div className="section-card">
            <h2 id="about-title">Sobre</h2>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              Olá! Sou desenvolvedor com foco em arquitetura de front-end e padrões de projeto.
              Este portfólio mostra projetos de código aberto, demos e casos práticos.
            </p>
          </div>
        </section>

        <section id="skills" className="page-section" aria-labelledby="skills-title">
          <div className="section-card">
            <h2 id="skills-title">Skills</h2>
            <div className="row" style={{ marginTop: 12 }}>
              <div className="small-card">React / Next.js</div>
              <div className="small-card">TypeScript / JavaScript</div>
              <div className="small-card">Node.js / APIs</div>
              <div className="small-card">Testing / CI</div>
              <div className="small-card">Design Patterns / MVC</div>
              <div className="small-card">Accessibility & Performance</div>
            </div>
          </div>
        </section>

        <section id="projects" className="page-section" aria-labelledby="projects-title">
          <div className="section-card">
            <h2 id="projects-title">Projetos</h2>
            <div className="row" style={{ marginTop: 12 }}>
              {repos.slice(0, 6).map((r: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; description: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; url: string | undefined; }) => (
                <div key={r.id} className="small-card">
                  <strong>{r.name}</strong>
                  <div style={{ color: 'var(--muted)', marginTop: 6 }}>{r.description}</div>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8 }}>
                    Ver no GitHub →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="page-section" aria-labelledby="exp-title">
          <div className="section-card">
            <h2 id="exp-title">Experiência</h2>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              Histórico resumido — mantenha aqui as empresas, consultorias, e projetos relevantes.
            </p>
          </div>
        </section>

        <section id="contact" className="page-section" aria-labelledby="contact-title">
          <div className="section-card">
            <h2 id="contact-title">Contato</h2>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>
              Email, LinkedIn ou form de contato — links diretos abaixo.
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              <a className="small-card" href={`mailto:hello@example.com`}>Email</a>
              <a className="small-card" href={linkedin?.sourceUrl ?? '#'} target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="small-card" href="#projects">Ver projetos</a>
            </div>
          </div>
        </section>

        <footer className="footer">© {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME}. Minimal portfolio — tema claro/escuro.</footer>
      </main>
    </>
  );
}