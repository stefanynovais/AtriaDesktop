import express from 'express'
import { login, register, profile } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

// Define endpoints de autenticação e associa funções do controller
const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.get('/profile', authMiddleware, profile)

export default router
