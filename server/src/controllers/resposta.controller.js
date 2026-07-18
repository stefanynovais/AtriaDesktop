import { respostaService } from '../services/resposta.service.js'

export const registrarResposta = async (req, res, next) => {
  try {
    const { flashcardId, acertou } = req.body
    const resposta = await respostaService.registrar(flashcardId, acertou, req.user.id)
    res.status(201).json(resposta)
  } catch (error) {
    next(error)
  }
}
