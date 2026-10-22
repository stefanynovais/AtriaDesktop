// MinhasTurmas.jsx
//
// Seção do Perfil do professor: lista as turmas, cria turma nova,
// mostra o código de entrada e vincula baralhos. Usa as rotas
// GET /turmas, POST /turmas e POST /turmas/:id/decks.

import { useEffect, useState } from "react";
import api from "../../services/api";
import TurmaAlunos from "./TurmaAlunos";
import "./style.css";

const mensagemDeErro = (error, padrao) =>
  error.response?.data?.message || padrao;

export default function MinhasTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [decks, setDecks] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [nomeNova, setNomeNova] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [deckPorTurma, setDeckPorTurma] = useState({});
  const [copiado, setCopiado] = useState(null);
  const [alunosAbertos, setAlunosAbertos] = useState({});

  const carregarTurmas = async () => {
    const resposta = await api.get("/turmas");
    setTurmas(Array.isArray(resposta.data) ? resposta.data : []);
  };

  useEffect(() => {
    let cancelado = false;

    Promise.all([api.get("/turmas"), api.get("/decks")])
      .then(([respTurmas, respDecks]) => {
        if (cancelado) return;
        setTurmas(Array.isArray(respTurmas.data) ? respTurmas.data : []);
        setDecks(Array.isArray(respDecks.data) ? respDecks.data : []);
      })
      .catch((error) => {
        if (!cancelado) setErro(mensagemDeErro(error, "Não foi possível carregar as turmas."));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const criarTurma = async (e) => {
    e.preventDefault();
    const nome = nomeNova.trim();
    if (!nome) return;

    setEnviando(true);
    setErro("");
    try {
      await api.post("/turmas", { nome });
      setNomeNova("");
      await carregarTurmas();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível criar a turma."));
    } finally {
      setEnviando(false);
    }
  };

  const vincularDeck = async (turmaId) => {
    const deckId = deckPorTurma[turmaId];
    if (!deckId) return;

    setErro("");
    try {
      await api.post(`/turmas/${turmaId}/decks`, { deckId: Number(deckId) });
      await carregarTurmas();
      setDeckPorTurma((atual) => ({ ...atual, [turmaId]: "" }));
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível vincular o baralho."));
    }
  };

  const copiarCodigo = async (codigo, turmaId) => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(turmaId);
      setTimeout(() => setCopiado(null), 1500);
    } catch {
      setErro("Não foi possível copiar o código. Copie manualmente.");
    }
  };

  return (
    <div className="turmas-bloco">
      <h3 className="turmas-titulo">Minhas turmas</h3>

      <form className="turmas-form" onSubmit={criarTurma}>
        <input
          className="turmas-input"
          type="text"
          placeholder="Nome da nova turma"
          value={nomeNova}
          onChange={(e) => setNomeNova(e.target.value)}
          maxLength={80}
        />
        <button className="turmas-btn" type="submit" disabled={enviando || !nomeNova.trim()}>
          {enviando ? "Criando..." : "Criar turma"}
        </button>
      </form>

      {erro && <p className="turmas-erro">{erro}</p>}
      {carregando && <p className="turmas-aviso">Carregando turmas...</p>}
      {!carregando && turmas.length === 0 && (
        <p className="turmas-aviso">Você ainda não criou nenhuma turma.</p>
      )}

      {turmas.map((turma) => (
        <div key={turma.id} className="turmas-card">
          <div className="turmas-card-topo">
            <div>
              <strong className="turmas-nome">{turma.nome}</strong>
              <span className="turmas-alunos">
                {turma.membros?.length ?? 0} aluno(s)
              </span>
            </div>
            <button
              type="button"
              className="turmas-codigo"
              onClick={() => copiarCodigo(turma.codigo, turma.id)}
              title="Copiar código de entrada"
            >
              Código: <strong>{turma.codigo}</strong>
              <span className="turmas-copiado">{copiado === turma.id ? " copiado!" : ""}</span>
            </button>
          </div>

          <div className="turmas-decks">
            {turma.decks?.length ? (
              turma.decks.map((td) => (
                <span key={td.deck?.id ?? td.id} className="turmas-deck-pill">
                  {td.deck?.title}
                </span>
              ))
            ) : (
              <span className="turmas-aviso">Nenhum baralho vinculado.</span>
            )}
          </div>

          <button
            type="button"
            className="turmas-btn turmas-ver-alunos"
            onClick={() =>
              setAlunosAbertos((atual) => ({ ...atual, [turma.id]: !atual[turma.id] }))
            }
          >
            {alunosAbertos[turma.id] ? "Ocultar alunos" : "Ver alunos"}
          </button>

          {alunosAbertos[turma.id] && <TurmaAlunos turmaId={turma.id} />}

          {decks.length > 0 && (
            <div className="turmas-vincular">
              <select
                className="turmas-input"
                value={deckPorTurma[turma.id] || ""}
                onChange={(e) =>
                  setDeckPorTurma((atual) => ({ ...atual, [turma.id]: e.target.value }))
                }
              >
                <option value="">Escolha um baralho</option>
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="turmas-btn"
                onClick={() => vincularDeck(turma.id)}
                disabled={!deckPorTurma[turma.id]}
              >
                Vincular
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
