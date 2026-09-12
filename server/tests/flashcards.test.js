// tests/flashcards.test.js
//
// Testes das rotas críticas de flashcards: criar (com imagemUrl), listar,
// editar, apagar, e checagem de permissão entre usuários diferentes.
//
// Como rodar:
//   npx vitest run tests/flashcards.test.js

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

const sufixo = Date.now()
const emailDono = `dono.${sufixo}@teste.com`
const emailOutro = `outro.${sufixo}@teste.com`
const senha = '123456'

describe('Flashcards', () => {
  let tokenDono
  let tokenOutro
  let deckId
  let flashcardId

  beforeAll(async () => {
    const registroDono = await request(app).post('/api/auth/register').send({
      name: 'Dono do Deck', email: emailDono, password: senha, role: 'PROFESSOR', codigoEtec: '043',
    })
    tokenDono = registroDono.body.token

    const registroOutro = await request(app).post('/api/auth/register').send({
      name: 'Outro Usuário', email: emailOutro, password: senha, role: 'PROFESSOR', codigoEtec: '043',
    })
    tokenOutro = registroOutro.body.token

    const deck = await request(app)
      .post('/api/decks')
      .set('Authorization', `Bearer ${tokenDono}`)
      .send({ title: 'Deck de Teste Automatizado' })
    deckId = deck.body.id
  })

  describe('POST /api/flashcards', () => {
    it('cria um flashcard com imagemUrl (201)', async () => {
      const resposta = await request(app)
        .post('/api/flashcards')
        .set('Authorization', `Bearer ${tokenDono}`)
        .send({
          deckId,
          front: 'Hello',
          back: 'Olá',
          nivel: 'FACIL',
          imagemUrl: 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg',
        })

      expect(resposta.status).toBe(201)
      expect(resposta.body.front).toBe('Hello')
      expect(resposta.body.imagemUrl).toContain('pexels.com')
      flashcardId = resposta.body.id
    })

    it('rejeita criar flashcard num deck que não é do usuário (404)', async () => {
      const resposta = await request(app)
        .post('/api/flashcards')
        .set('Authorization', `Bearer ${tokenOutro}`)
        .send({ deckId, front: 'Goodbye', back: 'Tchau' })

      expect(resposta.status).toBe(404)
    })
  })

  describe('GET /api/flashcards/:deckId', () => {
    it('lista os flashcards do deck do dono', async () => {
      const resposta = await request(app)
        .get(`/api/flashcards/${deckId}`)
        .set('Authorization', `Bearer ${tokenDono}`)

      expect(resposta.status).toBe(200)
      expect(resposta.body.some((f) => f.id === flashcardId)).toBe(true)
    })
  })

  describe('PUT /api/flashcards/:id', () => {
    it('o dono consegue editar o próprio flashcard', async () => {
      const resposta = await request(app)
        .put(`/api/flashcards/${flashcardId}`)
        .set('Authorization', `Bearer ${tokenDono}`)
        .send({ front: 'Hello', back: 'Olá (editado)' })

      expect(resposta.status).toBe(200)
      expect(resposta.body.back).toBe('Olá (editado)')
    })

    it('rejeita edição por quem não é dono (404)', async () => {
      const resposta = await request(app)
        .put(`/api/flashcards/${flashcardId}`)
        .set('Authorization', `Bearer ${tokenOutro}`)
        .send({ front: 'Hackeado', back: 'Hackeado' })

      expect(resposta.status).toBe(404)
    })
  })

  describe('DELETE /api/flashcards/:id', () => {
    it('rejeita apagar um flashcard que não é do usuário (404)', async () => {
      const resposta = await request(app)
        .delete(`/api/flashcards/${flashcardId}`)
        .set('Authorization', `Bearer ${tokenOutro}`)

      expect(resposta.status).toBe(404)
    })

    it('o dono consegue apagar o próprio flashcard (204)', async () => {
      const resposta = await request(app)
        .delete(`/api/flashcards/${flashcardId}`)
        .set('Authorization', `Bearer ${tokenDono}`)

      expect(resposta.status).toBe(204)
    })
  })
})
