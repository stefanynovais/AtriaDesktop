import { authService } from '../services/auth.service.js'

export const login = async (req, res, next) => {
  try {
    const credentials = req.body
    const result = await authService.login(credentials)
    res.status(200).json(result)
  } catch (error) {
    if (error.message === 'Credenciais inválidas' || error.message === 'Código da ETEC inválido') {
      return res.status(401).json({ status: 'error', message: error.message })
    }
    next(error)
  }
}

export const register = async (req, res, next) => {
  try {
    const userData = req.body
    const result = await authService.register(userData)
    res.status(201).json(result)
  } catch (error) {
    // erros de VALIDAÇÃO (dado errado que o usuário mandou) viram 400,
    // em vez de cair no erro genérico 500 do resto do sistema
    if (error.message === 'Código da ETEC inválido' || error.message === 'Usuário já existe') {
      return res.status(400).json({ status: 'error', message: error.message })
    }
    next(error)
  }
}

export const profile = async (req, res, next) => {
  try {
    const result = await authService.getProfile(req.user.id)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}