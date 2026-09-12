import express from 'express'
import multer from 'multer'
import { importarApkg } from '../controllers/ankiImport.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = express.Router()

// ------------------------------------------------------------
// LIMITE DE TAMANHO DE ARQUIVO — decisão documentada
//
// Por que 15MB?
//   O parser do Atria só extrai o TEXTO das notas (front/back) do banco
//   SQLite interno do .apkg — ele nunca lê áudio nem imagem embutidos no
//   arquivo. Isso significa que um deck só de texto, mesmo com milhares
//   de flashcards, costuma pesar poucos KB a poucas centenas de KB.
//
//   Arquivos .apkg muito grandes (dezenas/centenas de MB) quase sempre
//   têm esse peso por causa de mídia (áudio/imagem) que o sistema vai
//   IGNORAR mesmo assim — ou seja, aceitar um arquivo gigante não traria
//   nenhum benefício real, só arriscaria travar o servidor durante o
//   processamento.
// ------------------------------------------------------------
const LIMITE_MB = 15
const LIMITE_BYTES = LIMITE_MB * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LIMITE_BYTES },
})

router.use(authMiddleware)

// Envolve o multer manualmente pra capturar o erro dele e devolver uma
// mensagem clara, em vez do erro genérico que o multer lançaria sozinho.
router.post('/apkg', (req, res, next) => {
  upload.single('arquivo')(req, res, (erro) => {
    if (erro instanceof multer.MulterError) {
      if (erro.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'error',
          message: `Arquivo muito grande. O limite é de ${LIMITE_MB}MB — decks de texto (mesmo grandes) costumam pesar bem menos que isso; arquivos maiores geralmente têm áudio/imagem embutidos, que o sistema não utiliza.`,
        })
      }
      return res.status(400).json({
        status: 'error',
        message: 'Não foi possível processar o arquivo enviado.',
      })
    }

    if (erro) {
      return res.status(400).json({ status: 'error', message: erro.message })
    }

    next()
  })
}, importarApkg)

export default router