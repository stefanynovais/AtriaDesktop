// TurmasAluno.jsx
//
// Seção do Perfil do aluno: entrar numa turma com o código do professor e
// ver as turmas em que está, com os baralhos de cada uma.
// Usa as rotas POST /turmas/entrar e GET /turmas.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../MinhasTurmas/style.css";

const mensagemDeErro = (error, padrao) =>
  error.response?.data?.message || padrao;

export default function TurmasAluno() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregarTurmas = async () => {
    const resposta = await api.get("/turmas");
    setTurmas(Array.isArray(resposta.data) ? resposta.data : []);
  };

  useEffect(() => {
    let cancelado = false;

    api.get("/turmas")
      .then((resposta) => {
        if (!cancelado) setTurmas(Array.isArray(resposta.data) ? resposta.data : []);
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

  const entrar = async (e) => {
    e.preventDefault();
    const codigoLimpo = codigo.trim().toUpperCase();
    if (!codigoLimpo) return;

    setEnviando(true);
    setErro("");
    setSucesso("");
    try {
      await api.post("/turmas/entrar", { codigo: codigoLimpo });
      setCodigo("");
      setSucesso("Você entrou na turma!");
      await carregarTurmas();
    } catch (error) {
      setErro(mensagemDeErro(error, "Não foi possível entrar na turma. Confira o código."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="turmas-bloco">
      <h3 className="turmas-titulo">Minhas turmas</h3>

      <form className="turmas-form" onSubmit={entrar}>
        <input
          className="turmas-input"
          type="text"
          placeholder="Código da turma"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          maxLength={20}
        />
        <button className="turmas-btn" type="submit" disabled={enviando || !codigo.trim()}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {erro && <p className="turmas-erro">{erro}</p>}
      {sucesso && <p className="turmas-aviso">{sucesso}</p>}
      {carregando && <p className="turmas-aviso">Carregando turmas...</p>}
      {!carregando && turmas.length === 0 && (
        <p className="turmas-aviso">Você ainda não está em nenhuma turma.</p>
      )}

      {turmas.map((turma) => (
        <div key={turma.id} className="turmas-card">
          <div className="turmas-card-topo">
            <strong className="turmas-nome">{turma.nome}</strong>
          </div>

          <div className="turmas-decks">
            {turma.decks?.length ? (
              turma.decks.map((td) => (
                <button
                  key={td.deck?.id ?? td.id}
                  type="button"
                  className="turmas-deck-pill turmas-deck-botao"
                  onClick={() => navigate(`/games/${td.deck.id}`)}
                >
                  {td.deck?.title}
                </button>
              ))
            ) : (
              <span className="turmas-aviso">Nenhum baralho nesta turma ainda.</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}