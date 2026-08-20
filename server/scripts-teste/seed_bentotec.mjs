// seed_bentotec.mjs
//
// Cria (ou reaproveita) um deck "Quiz Bentotec - Inglês" e popula ele com
// 60 flashcards: 20 FACIL, 20 MEDIO, 20 DIFICIL, misturando vocabulário
// básico, gramática simples e expressões mais avançadas.
//
// Como rodar:
//   1. cd server
//   2. Ajuste EMAIL_PROFESSOR e SENHA abaixo pro usuário professor que vai
//      "dono" desse deck (o mesmo que fará login na tela do dia da Bentotec)
//   3. node scripts-teste/seed_bentotec.mjs
//
// Pré-requisito: a API precisa estar rodando (npm run dev em outro terminal).

import axios from 'axios'

const API_URL = 'http://localhost:4000/api'
const EMAIL_PROFESSOR = 'professor@teste.com'
const SENHA = '123456'
const NOME_DECK = 'Quiz Bentotec - Inglês'

// ------------------------------------------------------------
// 20 FÁCIL — vocabulário básico (palavras isoladas)
// ------------------------------------------------------------
const facil = [
  ['Hello', 'Olá'], ['Goodbye', 'Tchau'], ['Please', 'Por favor'], ['Thank you', 'Obrigado'],
  ['Yes', 'Sim'], ['No', 'Não'], ['Water', 'Água'], ['House', 'Casa'],
  ['Dog', 'Cachorro'], ['Cat', 'Gato'], ['Book', 'Livro'], ['School', 'Escola'],
  ['Friend', 'Amigo'], ['Family', 'Família'], ['Food', 'Comida'], ['Day', 'Dia'],
  ['Night', 'Noite'], ['Sun', 'Sol'], ['Moon', 'Lua'], ['Red', 'Vermelho'],
]

// ------------------------------------------------------------
// 20 MÉDIO — verbos, frases curtas, preposições
// ------------------------------------------------------------
const medio = [
  ['I am studying', 'Eu estou estudando'], ['She goes to school', 'Ela vai à escola'],
  ['We are happy', 'Nós estamos felizes'], ['He likes coffee', 'Ele gosta de café'],
  ['They live here', 'Eles moram aqui'], ['I have a car', 'Eu tenho um carro'],
  ['Can you help me?', 'Você pode me ajudar?'], ['What time is it?', 'Que horas são?'],
  ['I am hungry', 'Estou com fome'], ['She is tired', 'Ela está cansada'],
  ['Under the table', 'Embaixo da mesa'], ['Next to the door', 'Ao lado da porta'],
  ['In front of', 'Na frente de'], ['Between two houses', 'Entre duas casas'],
  ['Yesterday I ran', 'Ontem eu corri'], ['Tomorrow I will travel', 'Amanhã eu vou viajar'],
  ['I usually wake up early', 'Eu geralmente acordo cedo'],
  ['She never eats meat', 'Ela nunca come carne'],
  ['We often go out', 'Nós frequentemente saímos'],
  ['He is taller than me', 'Ele é mais alto que eu'],
]

// ------------------------------------------------------------
// 20 DIFÍCIL — expressões idiomáticas, phrasal verbs, gramática avançada
// ------------------------------------------------------------
const dificil = [
  ['It\'s raining cats and dogs', 'Está chovendo muito forte'],
  ['Break the ice', 'Quebrar o gelo (iniciar uma conversa)'],
  ['Give up', 'Desistir'], ['Look forward to', 'Estar ansioso por'],
  ['Run out of time', 'Ficar sem tempo'], ['Get along with', 'Se dar bem com'],
  ['If I had known, I would have helped', 'Se eu soubesse, teria ajudado'],
  ['The report was written by her', 'O relatório foi escrito por ela'],
  ['Had I known earlier...', 'Se eu tivesse sabido antes...'],
  ['Not only... but also', 'Não somente... mas também'],
  ['Once in a blue moon', 'Raramente (uma vez na vida)'],
  ['Piece of cake', 'Muito fácil'], ['Cost an arm and a leg', 'Custar muito caro'],
  ['Under the weather', 'Se sentindo mal/doente'],
  ['Hit the books', 'Estudar bastante'], ['On the ball', 'Atento, alerta'],
  ['I wish I had studied more', 'Eu gostaria de ter estudado mais'],
  ['She should have called', 'Ela deveria ter ligado'],
  ['By the time we arrived, they had left', 'Quando chegamos, eles já tinham saído'],
  ['Despite the rain, we went out', 'Apesar da chuva, saímos'],
]

const rodar = async () => {
  console.log('Fazendo login...')
  const loginResp = await axios.post(`${API_URL}/auth/login`, {
    email: EMAIL_PROFESSOR,
    password: SENHA,
  })
  const token = loginResp.data.token
  const auth = { headers: { Authorization: `Bearer ${token}` } }
  console.log('Login OK.')

  console.log(`Criando deck "${NOME_DECK}"...`)
  const deckResp = await axios.post(`${API_URL}/decks`, {
    title: NOME_DECK,
    origem: 'Seed Bentotec',
  }, auth)
  const deckId = deckResp.data.id
  console.log(`Deck criado com id=${deckId}`)

  const grupos = [
    { nivel: 'FACIL', itens: facil },
    { nivel: 'MEDIO', itens: medio },
    { nivel: 'DIFICIL', itens: dificil },
  ]

  let totalCriados = 0

  for (const grupo of grupos) {
    console.log(`\nCriando ${grupo.itens.length} flashcards de nível ${grupo.nivel}...`)
    for (const [front, back] of grupo.itens) {
      await axios.post(`${API_URL}/flashcards`, {
        deckId,
        front,
        back,
        nivel: grupo.nivel,
      }, auth)
      totalCriados++
    }
    console.log(`✅ Nível ${grupo.nivel} concluído.`)
  }

  console.log(`\n🎉 Total de flashcards criados: ${totalCriados}`)
  console.log(`Deck id: ${deckId} — use esse id na tela de demonstração da Bentotec.`)
}

rodar().catch((error) => {
  console.error('\n❌ Erro:', error.response?.data || error.message)
})
