# Backend API Skeleton

Este diretório contém um esqueleto de API Node/Express para ser usado junto ao front-end React.

## Estrutura
- `src/server.js`: ponto de entrada do servidor.
- `src/routes/`: define os endpoints e associa controllers.
- `src/controllers/`: lógica que responde às requisições.
- `src/services/`: regras de negócio e acesso a dados.
- `src/models/`: modelos de dados e definição de persistência.
- `src/middlewares/`: validação, autenticação e tratamento de erros.
- `src/config/`: configurações de ambiente e banco.
- `src/utils/`: utilitários de resposta e formatação.

## Como usar
1. Entre na pasta `server`:
   ```bash
   cd server
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Copie o exemplo de ambiente:
   ```bash
   copy .env.example .env
   ```
4. Atualize `server/.env` com a URL do seu banco SQL.
5. Gere o cliente Prisma e execute a migração:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
6. Inicie o servidor em modo dev:
   ```bash
   npm run dev
   ```

## Próximo passo
Depois que o servidor estiver rodando, o front-end pode consumir a API em `http://localhost:4000/api`.
