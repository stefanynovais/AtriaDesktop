import { estatisticaService } from '../services/estatistica.service.js'

export const registrarResultado = async (req, res, next) => {
  try {
    const resultado = await estatisticaService.registrarResultado(req.body, req.user.id)
    res.status(201).json(resultado)
  } catch (error) {
    next(error)
  }
}

export const getEstatisticasAluno = async (req, res, next) => {
  try {
    const estatisticas = await estatisticaService.getEstatisticasAluno(req.user.id)
    res.json(estatisticas)
  } catch (error) {
    next(error)
  }
}

export const getEstatisticasTurma = async (req, res, next) => {
  try {
    const { id } = req.params
    const estatisticas = await estatisticaService.getEstatisticasTurma(id)
    res.json(estatisticas)
  } catch (error) {
    next(error)
  }
}
