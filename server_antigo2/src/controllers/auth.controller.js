import { authService } from '../services/auth.service.js'

// Controller que responde a /api/auth/login e /api/auth/register
// Ele recebe a requisição, chama o serviço e devolve a resposta ao cliente.

export const login = async (req, res, next) => {
  try {
    const credentials = req.body
    const result = await authService.login(credentials)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const register = async (req, res, next) => {
  try {
    const userData = req.body
    const result = await authService.register(userData)
    res.status(201).json(result)
  } catch (error) {
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
