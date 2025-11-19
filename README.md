# Portfolio

Portfólio profissional com integração automática ao GitHub (GraphQL), painel de **ganhos por projeto** (dados via JSON), gráficos interativos (Chart.js), animações suaves e melhores práticas (TypeScript strict, Tailwind, testes, CI).

---

## Conteúdo deste README

- O que é
- Requisitos
- Arquivos importantes
- Setup local (passo-a-passo)
- Variáveis de ambiente
- Scripts úteis
- Como adicionar/editar `gains` (dados de ganhos)
- Testes (unitários + E2E)
- CI / Deploy (GitHub Actions + Vercel)
- Segurança e boas práticas
- Troubleshooting rápido

---

## O que é

Aplicação Next.js que:
- consulta seus repositórios públicos no GitHub (GraphQL),
- associa dados de ganhos por projeto via um arquivo JSON (`data/gains.example.json`),
- gera páginas estáticas com SSG/ISR,
- fornece gráficos interativos (Chart.js) e visual moderno (Tailwind).

---

## Requisitos

- Node.js >= 18 (recomendado)
- npm (ou pnpm/yarn)
- Conta GitHub (opcionalmente: Personal Access Token para reduzir limites de API)
- (Opcional) Conta Vercel para deploy contínuo

---

## Estrutura principal (resumida)

```
├─ .github/workflows/ci.yml
├─ data/
│  └─ gains.example.json
├─ scripts/
│  └─ transformGains.ts
├─ src/
│  ├─ pages/
│  │  ├─ index.tsx
│  │  └─ projects/[name].tsx
│  ├─ components/
│  ├─ services/github.ts
│  ├─ styles/
│  │  ├─ globals.css
│  │  └─ (tokens.css, base.css, components.css, ...)
│  └─ types/
├─ package.json
└─ README.md
```

---

## Instalação e setup local

1. Clone o repositório:
   ```bash
   git clone git@github.com:GuilhermeSotti/portfolio-gains-next.git
   cd portfolio-gains-next
   ```

2. Instale dependências:
   ```bash
   npm ci
   ```

3. Crie um arquivo de variáveis de ambiente local:
   - Copie `.env.example` para `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edite `.env.local` e defina:
     - `NEXT_PUBLIC_GITHUB_USER=GuilhermeSotti`
     - `GITHUB_TOKEN` (opcional)
     - (Opcional) `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`

4. Rodar em desenvolvimento:
   ```bash
   npm run dev
   ```

---

## Variáveis de ambiente

- `NEXT_PUBLIC_GITHUB_USER` — **Obrigatório**
- `GITHUB_TOKEN` — Opcional, recomendado
- `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID` — para CI/CD com Vercel

Criar PAT GitHub:
- GitHub → Settings → Developer Settings → PAT → Generate new token
- Marque: `public_repo` (ou `repo` se usar privados)

---

## Scripts (package.json)

- `npm run dev` — modo dev
- `npm run build` — build produção
- `npm run start` — inicia build
- `npm run lint` — ESLint
- `npm run test` — Jest
- `npm run transform-gains` — processa dados de ganhos
- `npm run cypress:open` — E2E
- `npm run cypress:run` — E2E CI

---

## Como adicionar / editar dados de ganhos (gains)

Arquivo: `data/gains.example.json`

Exemplo:
```json
{
  "repo-name": {
    "entries": [
      { "label": "Receita (BRL)", "value": 12000 },
      { "label": "Clientes", "value": 3 }
    ],
    "timeline": [
      { "date": "2024-01", "value": 1000 },
      { "date": "2024-12", "value": 12000 }
    ]
  }
}
```

Processar:
```bash
npm run transform-gains
```

Gera:
- `data/gains.csv`
- `data/gains.summary.json`

---

## Testes

### Unitários (Jest)
```bash
npm test
```

### E2E (Cypress)
```bash
npm run dev
npm run cypress:open
```

---

## CI / Deploy (GitHub Actions + Vercel)

Workflow:
- lint
- testes
- build
- deploy (opcional)

Secrets necessários:
- `GITHUB_TOKEN`
- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`

Deploy manual:
```bash
npm i -g vercel
vercel --prod
```

---

## Segurança

- Nunca comite tokens.
- Use GitHub Secrets.
- Variáveis sensíveis não podem começar com `NEXT_PUBLIC_`.

---

## Troubleshooting

- Sem repositórios → revisar token.
- Rate limit → gerar novo token.
- Gráficos não aparecem → validar JSON.
- CSS não carrega → confirmar import em `_app.tsx`.

---

## Customizações rápidas

- Alterar tema via localStorage:
  `localStorage.setItem('theme', 'dark')`

- Ajustar revalidate:
  alterar `getStaticProps` em `index.tsx` / `projects/[name].tsx`.

---

## Observações finais

- Performance: SSG/ISR, otimização de imagens.
- Acessibilidade: sr-only, skip-link, foco visível.
- Animações respeitando prefers-reduced-motion.