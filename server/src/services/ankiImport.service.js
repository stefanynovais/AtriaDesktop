// Service de importação de decks do Anki (.apkg).
//
// Um arquivo .apkg é, por baixo dos panos:
//   1. Um arquivo ZIP
//   2. Contendo um banco SQLite chamado "collection.anki2" (ou
//      "collection.anki21" em versões mais novas do Anki)
//   3. Esse banco tem uma tabela "notes", onde cada linha é uma "nota"
//      (conjunto de campos). O campo "flds" guarda todos os campos da
//      nota concatenados, separados pelo caractere invisível \x1f.
//
// Aqui simplificamos: pegamos o 1º campo como "front" e o 2º como "back"
// de cada nota — é o padrão mais comum em decks de vocabulário (a imensa
// maioria dos decks do tipo "Basic" do Anki segue esse formato).

import AdmZip from 'adm-zip';
import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Caminho do arquivo .wasm já instalado localmente em node_modules —
// evita que o sql.js tente baixar isso de um CDN externo (o que pode
// travar/demorar dependendo da rede).
const caminhoDoWasm = path.join(__dirname, '../../node_modules/sql.js/dist/sql-wasm.wasm');

const SEPARADOR_DE_CAMPOS = '\x1f';

// Extrai o banco collection.anki2 (ou .anki21) de dentro do .apkg
const extrairBancoDoZip = (bufferDoArquivo) => {
  const zip = new AdmZip(bufferDoArquivo);
  const entradas = zip.getEntries();

  // versões mais novas do Anki usam "collection.anki21", versões antigas usam "collection.anki2"
  const entradaBanco = entradas.find(
    (e) => e.entryName === 'collection.anki21' || e.entryName === 'collection.anki2',
  );

  if (!entradaBanco) {
    throw new Error(
      'Arquivo .apkg inválido: não foi encontrado o banco de dados do Anki dentro do zip',
    );
  }

  return entradaBanco.getData(); // Buffer com o conteúdo do SQLite
};

// Lê as notas do banco SQLite e devolve uma lista de { front, back }
const lerNotasDoBanco = async (bufferDoBanco) => {
  const SQL = await initSqlJs({ locateFile: () => caminhoDoWasm });
  const db = new SQL.Database(new Uint8Array(bufferDoBanco));

  const resultado = db.exec('SELECT flds FROM notes');
  db.close();

  if (resultado.length === 0) {
    return [];
  }

  const linhas = resultado[0].values; // array de arrays, ex: [["Hello\x1fOlá"], ["Goodbye\x1fTchau"]]

  const notas = linhas
    .map(([flds]) => {
      const campos = flds.split(SEPARADOR_DE_CAMPOS);
      return { front: campos[0]?.trim(), back: campos[1]?.trim() };
    })
    .filter((nota) => nota.front && nota.back); // ignora notas sem os 2 campos básicos

  return notas;
};

export const ankiImportService = {
  // Importa um arquivo .apkg, criando um Deck novo + todos os Flashcards
  // extraídos dele, já associados ao usuário logado.
  importarApkg: async (bufferDoArquivo, tituloDoDeck, ownerId) => {
    const bufferDoBanco = extrairBancoDoZip(bufferDoArquivo);
    const notas = await lerNotasDoBanco(bufferDoBanco);

    if (notas.length === 0) {
      throw new Error('Não foi possível encontrar nenhum flashcard válido nesse arquivo .apkg');
    }

    // cria o deck e todos os flashcards em uma única transação
    // (ou cria tudo, ou não cria nada, evitando deck "pela metade" se algo falhar no meio)
    const deckCriado = await prisma.$transaction(async (tx) => {
      const deck = await tx.deck.create({
        data: {
          title: tituloDoDeck,
          origem: 'Anki (.apkg)',
          ownerId,
        },
      });

      await tx.flashcard.createMany({
        data: notas.map((nota) => ({
          front: nota.front,
          back: nota.back,
          deckId: deck.id,
        })),
      });

      return deck;
    });

    return {
      deck: deckCriado,
      totalFlashcardsImportados: notas.length,
    };
  },
};
