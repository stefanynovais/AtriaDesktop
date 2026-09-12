// testar_apkg_limite.mjs
//
// Testa o upload de .apkg SEM precisar do Thunder Client (que exige plano
// pago pra mandar arquivo). Usa axios + form-data, que já estão instalados
// no seu package.json.
//
// Como rodar:
//   1. Coloca esse arquivo dentro de server/
//   2. Coloca os dois arquivos de teste (Deck_Teste_Pequeno.apkg e
//      Arquivo_Grande_Teste.apkg) também dentro de server/ (ou ajusta os
//      caminhos abaixo)
//   3. node testar_apkg_limite.mjs

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const API_URL = 'http://localhost:4000/api'
const EMAIL = 'professor.novo2@teste.com'
const SENHA = '123456'

const testarUpload = async (caminhoArquivo, token, nomeDoTeste) => {
  console.log(`\n--- ${nomeDoTeste} ---`)
  try {
    const form = new FormData()
    form.append('arquivo', fs.createReadStream(caminhoArquivo))
    form.append('titulo', nomeDoTeste)

    const resposta = await axios.post(`${API_URL}/importar/apkg`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    })

    console.log('✅ Sucesso:', resposta.status)
    console.log(JSON.stringify(resposta.data, null, 2))
  } catch (erro) {
    if (erro.response) {
      console.log(`Status: ${erro.response.status}`)
      console.log(JSON.stringify(erro.response.data, null, 2))
    } else {
      console.log('Erro de conexão:', erro.message)
    }
  }
}

const rodar = async () => {
  console.log('Fazendo login...')
  const login = await axios.post(`${API_URL}/auth/login`, { email: EMAIL, password: SENHA })
  const token = login.data.token
  console.log('Login OK.')

  await testarUpload('./Deck_Teste_Pequeno.apkg', token, 'Teste arquivo pequeno (deve funcionar)')
  await testarUpload('./Arquivo_Grande_Teste.apkg', token, 'Teste arquivo grande (deve dar 400)')
}

rodar().catch((e) => console.error('Erro inesperado:', e.message))
