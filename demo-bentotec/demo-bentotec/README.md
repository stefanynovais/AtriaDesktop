# Quiz da Bentotec

Quiz físico da Atria para o dia da Bentotec. A pergunta aparece na tela e a resposta é dada
nos **botões do dispositivo (ESP32)**, ligado ao computador por USB.

É uma mini-aplicação **separada do site da Atria**: tem o próprio `package.json`, não usa o
login nem as rotas do site e roda em outra porta (**5174**), então dá pra deixar os dois abertos.

## Como rodar

1. Ligue o back-end do site (pasta `server/`: `npm run dev`). Ele precisa estar em
   `http://localhost:4000` e com o banco de dados no ar.
2. Nesta pasta (`demo-bentotec/`):
   ```
   npm install     # só na primeira vez
   npm run dev
   ```
3. Abra **http://localhost:5174** no **Google Chrome** ou no **Microsoft Edge**, no computador
   (o navegador precisa suportar a Web Serial API).

> No computador da escola, se o PowerShell bloquear o `npm`, use `npm.cmd` no lugar.

## Configuração

Tudo fica em `src/config.js`:

| Valor | Para que serve |
|---|---|
| `API_URL` | endereço do back-end |
| `EMAIL_PROFESSOR` / `SENHA` | conta que o quiz usa para entrar na API |
| `DECK_ID` | id do deck do quiz (o "Quiz Bentotec - Inglês") |
| `TEMPO_LIMITE` | segundos por pergunta, **igual ao do ESP32** |
| `VELOCIDADE_SERIAL` | **igual ao `Serial.begin()` do ESP32** (9600) |
| `TEMPO_RESULTADO_DISPOSITIVO_MS` | quanto tempo o visor mostra "CORRETA!/ERRADA!", **igual ao `TEMPO_RESULTADO_MS` do código do Arduino** (4000) |

Os níveis Fácil/Médio/Difícil só funcionam em um deck que tenha o nível preenchido nos flashcards.

## Como a tela conversa com o ESP32

Está descrito no topo de `src/services/dispositivo.js`. Resumindo: a página manda
`Q;<1|0>;<linha 1>;<linha 2>` e o ESP32 responde `PERGUNTA RECEBIDA`, `TIMER: n` a cada
segundo e `R;V;1` / `R;F;0` / `R;TIMEOUT;0`. O relógio da tela segue o `TIMER:` do ESP32.
Depois de uma resposta, o site espera o visor terminar de mostrar o resultado (`TEMPO_RESULTADO_DISPOSITIVO_MS`)
antes de mandar a próxima pergunta; nesse intervalo a tela mostra "Aguardando o dispositivo...".

## Checklist do dia

- [ ] Back-end ligado e **banco de dados no ar** (a Neon precisa de internet; sem internet, use um banco local)
- [ ] `DECK_ID` confere com o id do deck certo
- [ ] O tempo do resultado é o mesmo no Arduino (`TEMPO_RESULTADO_MS`) e no site (`TEMPO_RESULTADO_DISPOSITIVO_MS`)
- [ ] Teste completo **antes**, com o dispositivo conectado: conectar, um acerto, um erro, um tempo esgotado
- [ ] Som do computador ligado (ou desligado, pelo botão no canto da tela)
- [ ] Cabo USB firme. Se o dispositivo parar de responder, a tela avisa e tem o botão "Reenviar pergunta"

## Primeira vez num banco novo (ex: um banco novo na Neon)

Num banco vazio o quiz não tem conta nem deck. Crie os dois, **uma vez só**:

1. **Conta de professor** (a que está em `EMAIL_PROFESSOR` e `SENHA`). Pela tela do site em
   `/institutional-register`, ou pelo Thunder Client:
   ```
   POST http://localhost:4000/api/auth/register
   { "name": "Professor Teste", "email": "professor@teste.com", "password": "123456",
     "role": "PROFESSOR", "codigoEtec": "043" }
   ```
2. **Deck do quiz** (60 flashcards: 20 fáceis, 20 médios, 20 difíceis). Com o back-end ligado,
   dentro da pasta `server/`:
   ```
   node scripts-teste/seed_bentotec.mjs
   ```
   Rode **só uma vez**: cada execução cria outro deck. No final ele mostra `Deck id: N`.
3. Se o `N` não for o `DECK_ID` de `src/config.js`, troque lá.

## O que fazer quando a tela mostra um erro

| A tela diz | O que aconteceu | O que fazer |
|---|---|---|
| "Servidor fora do ar. Ligue o back-end..." | o back-end não está rodando (ou o endereço está errado) | `npm run dev` na pasta `server/` |
| "O servidor está no ar, mas recusou o login de ..." | a conta de `EMAIL_PROFESSOR` não existe ou a senha está errada | passo 1 acima, ou ajuste `EMAIL_PROFESSOR` e `SENHA` em `src/config.js` |
| "O servidor respondeu com erro (...)" | o back-end está no ar, mas algo por dentro falhou, em geral o banco de dados | olhe o terminal do back-end; a Neon "dorme" depois de uns minutos, tente de novo; sem internet ela não funciona |
| mensagem do back sobre deck não encontrado ou sem flashcards do nível | `DECK_ID` errado, ou o deck não tem os níveis preenchidos | passo 2 e 3 acima |
| "O dispositivo não respondeu..." | o ESP32 não está respondendo pela USB | confira o cabo e se ele está ligado; use "Reenviar pergunta" |

## Sem o dispositivo

O botão **Testar sem dispositivo** liga um modo em que os botões VERDADEIRO/FALSO da própria
tela fazem o papel dos botões físicos.

## Estrutura

```
src/
  config.js                      valores que mudam de um dia para o outro
  main.jsx                       ponto de entrada
  index.css                      fundo, fontes e variáveis de cor
  pages/QuizBentotec/            a tela do quiz (QuizBentotec.jsx + .css)
  components/LogoAtria/          o logo da Atria em SVG
  services/api.js                login e chamadas ao back-end
  services/dispositivo.js        conversa com o ESP32 pela USB
```
