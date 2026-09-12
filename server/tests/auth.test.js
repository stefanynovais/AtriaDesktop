// tests/auth.test.js
//
// Testes das rotas críticas de autenticação: registro (com código da ETEC),
// login, e a rota protegida /auth/profile.
//
// Como rodar:
//   npx vitest run tests/auth.test.js

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

const sufixo = Date.now()
const emailValido = `teste.auth.${sufixo}@teste.com`
const senha = '123456'

describe('Auth', () => {
  describe('POST /api/auth/register', () => {
    it('cria um usuário novo com o código da ETEC correto (201)', async () => {
      const resposta = await request(app).post('/api/auth/register').send({
        name: 'Usuário de Teste',
        email: emailValido,
        password: senha,
        role: 'COMUM',
        codigoEtec: '043',
      })

      expect(resposta.status).toBe(201)
      expect(resposta.body.token).toBeDefined()
      expect(resposta.body.user.email).toBe(emailValido)
      expect(resposta.body.user.password).toBeUndefined()
    })

    it('rejeita cadastro com código da ETEC errado (400)', async () => {
      const resposta = await request(app).post('/api/auth/register').send({
        name: 'Outro Usuário',
        email: `outro.${sufixo}@teste.com`,
        password: senha,
        role: 'COMUM',
        codigoEtec: '044',
      })

      expect(resposta.status).toBe(400)
      expect(resposta.body.message).toBe('Código da ETEC inválido')
    })

    it('rejeita cadastro com email já existente (400)', async () => {
      const resposta = await request(app).post('/api/auth/register').send({
        name: 'Outro Usuário',
        email: emailValido, // mesmo email do primeiro teste
        password: senha,
        role: 'COMUM',
        codigoEtec: '043',
      })

      expect(resposta.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('autentica com credenciais corretas (200)', async () => {
      const resposta = await request(app).post('/api/auth/login').send({
        email: emailValido,
        password: senha,
      })

      expect(resposta.status).toBe(200)
      expect(resposta.body.token).toBeDefined()
    })

    it('rejeita login com senha errada (401)', async () => {
      const resposta = await request(app).post('/api/auth/login').send({
        email: emailValido,
        password: 'senha-errada',
      })

      expect(resposta.status).toBe(401)
    })
  })

  describe('GET /api/auth/profile', () => {
    let token

    beforeAll(async () => {
      const login = await request(app).post('/api/auth/login').send({
        email: emailValido,
        password: senha,
      })
      token = login.body.token
    })

    it('retorna os dados do usuário logado quando o token é válido', async () => {
      const resposta = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)

      expect(resposta.status).toBe(200)
      expect(resposta.body.email).toBe(emailValido)
    })

    it('rejeita acesso sem token (401)', async () => {
      const resposta = await request(app).get('/api/auth/profile')
      expect(resposta.status).toBe(401)
    })
  })
})