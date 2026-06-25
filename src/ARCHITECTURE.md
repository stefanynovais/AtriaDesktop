Adaptação da arquitetura para o repositório AtriaDesktop

Resumo
- Mantive Vite + React (projeto SPA atual).
- Recomendo migrar progressivamente para TypeScript; por ora mantenho JS para mínima intrusão.

Estrutura recomendada (feature-first, adaptada ao estado atual)

/src
  /app (opcional para Next-style)
  /features
    /auth
      - pages, components, hooks relacionados a login/register
    /perfil
      - componentes e páginas de perfil
    /deck
      - páginas e componentes de Decks
  /components
    - primitives e UI shared (Button, Input, Layout)
  /hooks
    - hooks compartilhados (useAuth, useFetch)
  /lib
    - clients (api.ts), utils, services
  /styles
    - tokens, global.css
  /assets

Mapeamento atual -> recomendações
- `src/pages` -> mover para `src/features/*/pages` (ex: `src/pages/Login` -> `src/features/auth/pages/Login`)
- `src/components/*` -> `src/components/*` (UI primitives) ou `src/features/*/components` quando específico
- `src/routes/index.jsx` -> deixar em `src/routes` integrando `features` routes

Passos práticos para adaptação (sugeridos)
1. Criar `src/features` e mover pastas de `src/pages` por domínio.
2. Criar `src/components/primitives` para botões/inputs.
3. Adicionar `zod`, `react-hook-form`, `tanstack/react-query` e `zustand` conforme necessidade.
4. Adicionar `prettier`, `husky` + `lint-staged`, `vitest` e `playwright` ao devDependencies.
5. Adicionei arquivos de configuração iniciais: ESLint, Prettier, Husky, lint-staged e Vitest.

Como usar agora
- rode `npm install` (ou `pnpm install`) para instalar as dependências adicionadas no `package.json`.
- execute `npm run prepare` para ativar hooks do Husky (ou será executado durante a instalação automática).
- passos úteis: `npm run dev`, `npm run lint`, `npm run format`, `npm run test`.
5. Habilitar `strict` e migrar para TS gradualmente (renomeie arquivos por feature).

Comandos iniciais sugeridos (instalação):

# com pnpm (recomendado)
pnpm add -D prettier vitest @testing-library/react @testing-library/jest-dom
pnpm add react-hook-form zod @tanstack/react-query zustand

# com npm
npm install --save-dev prettier vitest @testing-library/react @testing-library/jest-dom
npm install react-hook-form zod @tanstack/react-query zustand

Observações
- Não movi arquivos automaticamente para evitar conflitos de import; posso fazer a reorganização e atualizar imports se você autorizar.
- Se quiser, posso iniciar a migração adicionando `src/features` e movendo um domínio (ex: `Login`/`Register`) como exemplo.
