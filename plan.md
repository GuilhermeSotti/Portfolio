# Plano técnico - Portfolio com ganhos por projeto

- Stack: Next.js + TypeScript + Tailwind + Chart.js
- Autenticação GitHub: token server-side (env GITHUB_TOKEN)
- Busca repositórios: GraphQL (endpoint https://api.github.com/graphql) via fetch em getStaticProps (server)
- Dados de ganhos: `data/gains.example.json` mapeados por nome do repo. Transformação por `scripts/transformGains.ts`
- Rendering: SSG com getStaticProps (index + detalhes). ISR possível ajustando `revalidate`.
- Deploy: Vercel (recomendado) ou S3+CloudFront. CI: GitHub Actions.
- Testes: Jest + RTL (unitários), Cypress (E2E).
