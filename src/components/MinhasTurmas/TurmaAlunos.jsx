// TurmaAlunos.jsx
//
// Painel do professor dentro de uma turma: lista os alunos com o
// desempenho nos baralhos da turma e, ao tocar em um aluno, mostra
// cada resposta. Usa GET /estatisticas/turma/:id e
// GET /estatisticas/turma/:id/aluno/:alunoId.

import { useEffect, useState } from "react";
import api from "../../services/api";

const formatarData = (valor) => {
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? ""
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

export default function TurmaAlunos({ turmaId }) {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [alunoAberto, setAlunoAberto] = useState(null);
  const [detalhe, setDetalhe] = useState(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);

  useEffect(() => {
    let cancelado = false;

    api
      .get(`/estatisticas/turma/${turmaId}`)
      .then((resposta) => {
        if (!cancelado) setAlunos(Array.isArray(resposta.data) ? resposta.data : []);
      })
      .catch((error) => {
        if (!cancelado) {
          setErro(error.response?.data?.message || "Não foi possível carregar os alunos.");
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [turmaId]);

  const abrirAluno = async (alunoId) => {
    if (alunoAberto === alunoId) {
      setAlunoAberto(null);
      setDetalhe(null);
      return;
    }

    setAlunoAberto(alunoId);
    setDetalhe(null);
    setCarregandoDetalhe(true);
    try {
      const resposta = await api.get(`/estatisticas/turma/${turmaId}/aluno/${alunoId}`);
      setDetalhe(resposta.data);
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível carregar as respostas.");
    } finally {
      setCarregandoDetalhe(false);
    }
  };

  if (carregando) return <p className="turmas-aviso">Carregando alunos...</p>;
  if (erro) return <p className="turmas-erro">{erro}</p>;
  if (alunos.length === 0) {
    return <p className="turmas-aviso">Nenhum aluno entrou nesta turma ainda.</p>;
  }

  return (
    <div className="turmas-alunos-lista">
      {alunos.map((item) => {
        const id = item.aluno.id;
        const aberto = alunoAberto === id;
        return (
          <div key={id} className="turmas-aluno">
            <button
              type="button"
              className="turmas-aluno-botao"
              onClick={() => abrirAluno(id)}
              aria-expanded={aberto}
            >
              <span className="turmas-aluno-nome">{item.aluno.name}</span>
              <span className="turmas-aluno-resumo">
                {item.totalRespostas} resposta(s) · {item.aproveitamento}% de acerto
              </span>
            </button>

            {aberto && (
              <div className="turmas-aluno-detalhe">
                {carregandoDetalhe && <p className="turmas-aviso">Carregando respostas...</p>}
                {detalhe && detalhe.respostas.length === 0 && (
                  <p className="turmas-aviso">Nenhuma resposta nos baralhos desta turma.</p>
                )}
                {detalhe &&
                  detalhe.respostas.map((r, i) => (
                    <div key={i} className="turmas-resposta">
                      <span className={r.acertou ? "turmas-acerto" : "turmas-erro-item"}>
                        {r.acertou ? "Acertou" : "Errou"}
                      </span>
                      <span className="turmas-resposta-texto">
                        {r.front} → {r.back}
                        {r.revisao && <span className="turmas-tag-revisao">Revisão</span>}
                      </span>
                      <span className="turmas-resposta-data">{formatarData(r.respondidoEm)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
