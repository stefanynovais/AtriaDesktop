// test-api.js
//
// Script de teste da Camada 2: só testa se a comunicação com a API
// está funcionando (login + buscar pergunta), SEM precisar do Arduino
// conectado. Útil pra validar essa parte antes do hardware físico
// estar pronto.
//
// Como rodar:
//   cd arduino-bridge
//   npm install
//   copie .env.example para .env e ajuste DECK_ID, API_EMAIL, etc
//   node test-api.js

import 'dotenv/config'
import axios from 'axios'

const { API_URL, API_EMAIL, API_PASSWORD, DECK_ID } = process.env

const encurtarPara16 = (texto) => {
  if (!texto) return ''
  if (texto.length <= 16) return texto
  return texto.substring(0, 15) + '.'
}

const testar = async () => {
  console.log('[test] Fazendo login...')
  const loginResp = await axios.post(`${API_URL}/auth/login`, {
    email: API_EMAIL,
    password: API_PASSWORD,
  })
  const token = loginResp.data.token
  console.log('[test] Login OK, token recebido.')

  console.log(`[test] Buscando pergunta do deck ${DECK_ID}...`)
  const perguntaResp = await axios.get(
    `${API_URL}/exercicios/verdadeiro-falso/${DECK_ID}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  const pergunta = perguntaResp.data
  console.log('[test] Pergunta recebida da API:')
  console.log(pergunta)

  const linha1 = encurtarPara16(pergunta.front)
  const linha2 = encurtarPara16(pergunta.backMostrado)
  const gabarito = pergunta.correto ? '1' : '0'
  const mensagemQueIriaProArduino = `Q;${gabarito};${linha1};${linha2}`

  console.log('\n[test] Essa seria a mensagem enviada pro Arduino:')
  console.log(mensagemQueIriaProArduino)

  console.log('\n[test] ✅ Camada 2 validada: API + geração da pergunta estão funcionando.')
}

testar().catch((error) => {
  console.error('[test] ❌ Erro:', error.response?.data || error.message)
})
