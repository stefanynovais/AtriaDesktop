// testar_importacao_anki.mjs
//
// Script simples pra testar a importação de .apkg sem precisar de
// Thunder Client, Postman ou qualquer ferramenta paga.
//
// Como usar:
//   1. cd server
//   2. npm install (se ainda não tiver form-data instalado, ele instala junto)
//   3. Ajusta as 3 variáveis abaixo (EMAIL, SENHA, CAMINHO_DO_APKG)
//   4. node scripts-teste/testar_importacao_anki.mjs

import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'

const API_URL = 'http://localhost:4000/api'
const EMAIL = 'professor@teste.com'
const SENHA = '123456'
const CAMINHO_DO_APKG = 'C:\\Users\\Usuario\\Downloads\\Basic_Danish.apkg'

const rodar = async () => {
  console.log('Fazendo login...')
  const loginResp = await axios.post(`${API_URL}/auth/login`, {
    email: EMAIL,
    password: SENHA,
  })
  const token = loginResp.data.token
  console.log('Login OK.')

  console.log(`Lendo arquivo: ${CAMINHO_DO_APKG}`)
  const form = new FormData()
  form.append('arquivo', fs.createReadStream(CAMINHO_DO_APKG))
  form.append('titulo', 'Deck importado via script de teste')

  console.log('Enviando pra API...')
  const importResp = await axios.post(`${API_URL}/importar/apkg`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })

  console.log('\n✅ Resultado da importação:')
  console.log(importResp.data)
}

rodar().catch((error) => {
  console.error('\n❌ Erro:', error.response?.data || error.message)
})
