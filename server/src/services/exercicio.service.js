// Service de geração de exercícios.
// Modos disponíveis: Cartões clássicos, Verdadeiro/Falso, Jogo da memória,
// Combinar palavra→definição.

import { prisma } from '../config/database.js'

// Sorteia um item aleatório de um array
const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)]

// Embaralha um array (não altera o original, devolve uma cópia embaralhada)
const embaralhar = (lista) => {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

const buscarDeckComFlashcards = async (deckId, ownerId) => {
  const deck = await prisma.deck.findFirst({
    where: { id: Number(deckId), ownerId },
    include: { flashcards: true },
  })
  if (!deck) {
    throw new Error('Deck não encontrado')
  }
  return deck
}

export const exercicioService = {
  // ------------------------------------------------------------
  // MODO 1: Cartões clássicos
  // Devolve os flashcards do deck em ordem embaralhada. O aluno vê a
  // frente, tenta lembrar, e confere o verso por conta própria.
  // ------------------------------------------------------------
  gerarCartoesClassicos: async (deckId, ownerId) => {
    const deck = await buscarDeckComFlashcards(deckId, ownerId)

    if (deck.flashcards.length === 0) {
      throw new Error('O deck não tem flashcards')
    }

    const cartoes = embaralhar(deck.flashcards).map((c) => ({
      flashcardId: c.id,
      front: c.front,
      back: c.back,
    }))

    return { deckId: deck.id, cartoes }
  },

  // ------------------------------------------------------------
  // MODO 2: Verdadeiro ou Falso
  // Gera UMA pergunta por vez (front real + back certo ou trocado).
  // ------------------------------------------------------------
  gerarVerdadeiroFalso: async (deckId, ownerId) => {
    const deck = await buscarDeckComFlashcards(deckId, ownerId)

    if (deck.flashcards.length < 2) {
      throw new Error('O deck precisa ter pelo menos 2 flashcards para gerar Verdadeiro ou Falso')
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
    }
  },

  // ------------------------------------------------------------
  // MODO 3: Jogo da memória
  // Devolve N pares (front + back) já "explodidos" em cartas separadas
  // e embaralhadas, prontas pro frontend distribuir na grade do jogo.
  // Cada carta tem um "parId" — as duas cartas com o mesmo parId formam
  // o par correto (uma é o front, outra é o back do mesmo flashcard).
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
  // Devolve duas listas separadas (palavras e definições), cada uma
  // embaralhada de forma independente. O flashcardId em cada item serve
  // de gabarito para o frontend conferir se o aluno ligou certo.
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
