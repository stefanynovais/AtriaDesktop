// bridge.js
//
// Script "ponte" entre o Arduino (quiz físico Verdadeiro/Falso) e a API do Atria.
//
// O que ele faz, em loop:
//   1. Pede uma pergunta de Verdadeiro/Falso pra API (a partir de um deck)
//   2. Manda essa pergunta pro Arduino via cabo serial (USB)
//   3. Espera o Arduino avisar que o aluno respondeu (botão apertado)
//   4. Registra o resultado (acerto/erro) na API de estatísticas
//   5. Repete
//
// Antes de rodar:
//   1. cd arduino-bridge
//   2. npm install
//   3. copie .env.example para .env e ajuste SERIAL_PORT, DECK_ID, etc
//   4. npm start

import 'dotenv/config'
import axios from 'axios'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

const {
  SERIAL_PORT,
  BAUD_RATE,
  API_URL,
  API_EMAIL,
  API_PASSWORD,
  DECK_ID,
} = process.env

// ------------------------------------------------------------
// Corta um texto pra caber em uma linha do LCD 16x2 (16 caracteres)
// ------------------------------------------------------------
const encurtarPara16 = (texto) => {
  if (!texto) return ''
  if (texto.length <= 16) return texto
  return texto.substring(0, 15) + '.' // corta e indica que foi cortado
}

// ------------------------------------------------------------
// Conecta na porta serial do Arduino
// ------------------------------------------------------------
const porta = new SerialPort({
  path: SERIAL_PORT,
  baudRate: Number(BAUD_RATE) || 9600,
})

const parser = porta.pipe(new ReadlineParser({ delimiter: '\n' }))

porta.on('open', () => {
  console.log(`[bridge] Conectado na porta serial ${SERIAL_PORT}`)
})

porta.on('error', (err) => {
  console.error('[bridge] Erro na porta serial:', err.message)
  console.error('[bridge] Confira se o SERIAL_PORT no .env está certo e se o Arduino IDE não está com o Serial Monitor aberto (só um programa pode usar a porta por vez).')
})

// ------------------------------------------------------------
// Login na API (pra pegar o token automaticamente, sem copiar/colar manual)
// ------------------------------------------------------------
let token = null

const login = async () => {
  const resposta = await axios.post(`${API_URL}/auth/login`, {
    email: API_EMAIL,
    password: API_PASSWORD,
  })
  token = resposta.data.token
  console.log('[bridge] Login feito com sucesso na API')
}

// ------------------------------------------------------------
// Busca uma pergunta Verdadeiro/Falso na API
// ------------------------------------------------------------
const buscarPergunta = async () => {
  const resposta = await axios.get(
    `${API_URL}/exercicios/verdadeiro-falso/${DECK_ID}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return resposta.data
}

// ------------------------------------------------------------
// Registra o resultado na API de estatísticas
// ------------------------------------------------------------
const registrarResultado = async (acertou) => {
  await axios.post(
    `${API_URL}/estatisticas`,
    {
      deckId: Number(DECK_ID),
      totalCards: 1,
      acertos: acertou ? 1 : 0,
      erros: acertou ? 0 : 1,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  console.log(`[bridge] Resultado registrado na API: ${acertou ? 'ACERTOU' : 'ERROU'}`)
}

// ------------------------------------------------------------
// Espera UMA linha de resposta do Arduino, no formato "R;V;1" / "R;F;0" / "R;TIMEOUT;0"
// ------------------------------------------------------------
const esperarRespostaDoArduino = () => {
  return new Promise((resolve) => {
    const onLine = (linha) => {
      linha = linha.trim()
      if (linha.startsWith('R;')) {
        parser.removeListener('data', onLine)
        const partes = linha.split(';') // ["R", "V" | "F" | "TIMEOUT", "1" | "0"]
        const acertou = partes[2] === '1'
        resolve(acertou)
      }
    }
    parser.on('data', onLine)
  })
}

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ------------------------------------------------------------
// Loop principal
// ------------------------------------------------------------
const rodarQuiz = async () => {
  await login()

  // pequena pausa pra garantir que a porta serial do Arduino já está pronta
  await esperar(2000)

  while (true) {
    try {
      console.log('\n[bridge] Buscando nova pergunta...')
      const pergunta = await buscarPergunta()

      const linha1 = encurtarPara16(pergunta.front)
      const linha2 = encurtarPara16(pergunta.backMostrado)
      const gabarito = pergunta.correto ? '1' : '0'

      const mensagem = `Q;${gabarito};${linha1};${linha2}\n`
      console.log(`[bridge] Enviando pro Arduino: ${mensagem.trim()}`)
      porta.write(mensagem)

      const acertou = await esperarRespostaDoArduino()
      await registrarResultado(acertou)

      // pequena pausa antes de buscar a próxima pergunta
      await esperar(1000)
    } catch (error) {
      console.error('[bridge] Erro no loop do quiz:', error.message)
      await esperar(3000) // espera um pouco antes de tentar de novo
    }
  }
}

rodarQuiz()
