import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { sendError } from '../utils/response.js'

// Verifica se a requisição tem um token JWT válido no header Authorization.
// Se válido, anexa os dados do usuário em req.user e segue para o próximo middleware/controller.
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Token não fornecido', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.jwtSecret)
    req.user = payload // { id, email, role }
    next()
  } catch (error) {
    return sendError(res, 'Token inválido ou expirado', 401)
  }
}

// Restringe o acesso a determinadas roles (ex: apenas PROFESSOR).
// Uso: router.post('/turmas', authMiddleware, requireRole('PROFESSOR'), createTurma)
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 'Acesso não autorizado para este perfil', 403)
    }
    next()
  }
}
