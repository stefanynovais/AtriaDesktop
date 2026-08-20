// Service de geração de exercícios.
// Modos disponíveis: Cartões clássicos, Flashcard único (autoavaliação),
// Verdadeiro/Falso (com filtro de nível), Jogo da memória, Combinar.

import { prisma } from '../config/database.js'

const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)]

const embaralhar = (lista) => {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

const buscarDeckComFlashcards = async (deckId, ownerId, nivel = null) => {
  const deck = await prisma.deck.findFirst({
    where: { id: Number(deckId), ownerId },
    include: {
      flashcards: nivel ? { where: { nivel } } : true,
    },
  })
  if (!deck) {
    throw new Error('Deck não encontrado')
  }
  return deck
}

export const exercicioService = {
  // ------------------------------------------------------------
  // MODO 1: Cartões clássicos (lista embaralhada inteira)
  // ------------------------------------------------------------
  gerarCartoesClassicos: async (deckId, ownerId, nivel = null) => {
    const deck = await buscarDeckComFlashcards(deckId, ownerId, nivel)

    if (deck.flashcards.length === 0) {
      throw new Error('O deck não tem flashcards')
    }

    const cartoes = embaralhar(deck.flashcards).map((c) => ({
      flashcardId: c.id,
      front: c.front,
      back: c.back,
      nivel: c.nivel,
    }))

    return { deckId: deck.id, cartoes }
  },

  // ------------------------------------------------------------
  // MODO NOVO: Flashcard único — pega UM card aleatório, com o
  // verso REAL (não inverte com outro card). Usado no modo de
  // autoavaliação: o próprio usuário diz se sabia ou não.
  // ------------------------------------------------------------
  gerarFlashcardUnico: async (deckId, ownerId, nivel = null) => {
    const deck = await buscarDeckComFlashcards(deckId, ownerId, nivel)

    if (deck.flashcards.length === 0) {
      throw new Error(
        nivel ? `O deck não tem flashcards no nível ${nivel}` : 'O deck não tem flashcards'
      )
    }

    const card = sortear(deck.flashcards)

    return {
      deckId: deck.id,
      flashcardId: card.id,
      front: card.front,
      back: card.back,
      nivel: card.nivel,
    }
  },

  // ------------------------------------------------------------
  // MODO 2: Verdadeiro ou Falso (mantido, caso queiram usar depois)
  // ------------------------------------------------------------
  gerarVerdadeiroFalso: async (deckId, ownerId, nivel = null) => {
    const deck = await buscarDeckComFlashcards(deckId, ownerId, nivel)

    if (deck.flashcards.length < 2) {
      throw new Error(
        nivel
          ? `O deck não tem flashcards suficientes no nível ${nivel}`
          : 'O deck precisa ter pelo menos 2 flashcards para gerar Verdadeiro ou Falso'
      )
    }

    const cardBase = sortear(deck.flashcards)
    const ehVerdadeiro = Math.random() < 0.5

    let backMostrado = cardBase.back

    if (!ehVerdadeiro) {
      const outros = deck.flashcards.filter((c) => c.id !== cardBase.id)
      const cardErrado = sortear(outros)
      backMostrado = cardErrado.back
    }

    return {
      deckId: deck.id,
      flashcardId: cardBase.id,
      front: cardBase.front,
      backMostrado,
      correto: ehVerdadeiro,
      nivel: cardBase.nivel,
    }
  },

  // ------------------------------------------------------------
  // MODO 3: Jogo da memória
  // ------------------------------------------------------------
  gerarJogoDaMemoria: async (deckId, ownerId, quantidade = 6) => {
    const deck = await buscarDeckComFlashcards(deckId, ownerId)

    if (deck.flashcards.length < 2) {
      throw new Error('O deck precisa ter pelo menos 2 flashcards para o jogo da memória')
    }

    const qtd = Math.min(Number(quantidade) || 6, deck.flashcards.length)
    const selecionados = embaralhar(deck.flashcards).slice(0, qtd)

    const cartas = []
    selecionados.forEach((card) => {
      cartas.push({ parId: card.id, flashcardId: card.id, tipo: 'front', texto: card.front })
      cartas.push({ parId: card.id, flashcardId: card.id, tipo: 'back', texto: card.back })
    })

    return { deckId: deck.id, cartas: embaralhar(cartas) }
  },

  // ------------------------------------------------------------
  // MODO 4: Combinar palavra → definição
  // ------------------------------------------------------------
  gerarCombinarPares: async (deckId, ownerId, quantidade = 6) => {
    const deck = await buscarDeckComFlashcards(deckId, ownerId)

    if (deck.flashcards.length < 2) {
      throw new Error('O deck precisa ter pelo menos 2 flashcards para combinar pares')
    }

    const qtd = Math.min(Number(quantidade) || 6, deck.flashcards.length)
    const selecionados = embaralhar(deck.flashcards).slice(0, qtd)

    const pares = embaralhar(
      selecionados.map((c) => ({ flashcardId: c.id, palavra: c.front }))
    )
    const definicoes = embaralhar(
      selecionados.map((c) => ({ flashcardId: c.id, definicao: c.back }))
    )

    return { deckId: deck.id, pares, definicoes }
  },
}