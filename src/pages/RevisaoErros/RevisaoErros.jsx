// RevisaoErros.jsx
//
// Revisão dos erros do aluno. Mostra uma palavra que ele errou da última
// vez e 4 opções de tradução. Se errar de novo, a palavra continua na
// revisão; se acertar, ela sai (a última resposta passa a ser certa).
// Usa GET /exercicios/revisao-multipla e POST /exercicios/revisao-multipla/responder.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import api from "../../services/api";
import "./style.css";

export default function RevisaoErros() {
  const navigate = useNavigate();
  const [pergunta, setPergunta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [escolhido, setEscolhido] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [iniciada, setIniciada] = useState(false);

  const carregarPergunta = async () => {
    setCarregando(true);
    setErro("");
    setEscolhido(null);
    setResultado(null);
    try {
      const resposta = await api.get("/exercicios/revisao-multipla");
      setPergunta(resposta.data);
    } catch (error) {
      setPergunta(null);
      setErro(error.response?.data?.message || "Não foi possível carregar a revisão.");
    } finally {
      setCarregando(false);
    }
  };

  const responder = async (opcaoId) => {
    if (resultado || enviando) return;
    setEnviando(true);
    setEscolhido(opcaoId);
    try {
      const resposta = await api.post("/exercicios/revisao-multipla/responder", {
        token: pergunta.token,
        escolhidoId: opcaoId,
      });
      setResultado(resposta.data);
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível registrar a resposta.");
    } finally {
      setEnviando(false);
    }
  };

  const comecar = () => {
    setIniciada(true);
    carregarPergunta();
  };

  const renderizarConteudo = () => {
    if (!iniciada) {
      return (
        <div className="revisao-intro">
          <h2 className="revisao-intro-titulo">Revisão de erros</h2>
          <p className="revisao-intro-texto">
            Aqui você revisa as palavras que errou nos baralhos que estudou. Escolha a tradução
            certa entre as opções. Se acertar, a palavra sai da revisão. Se errar de novo, ela
            continua na lista.
          </p>
          <button type="button" className="revisao-btn" onClick={comecar}>
            Começar
          </button>
        </div>
      );
    }

    if (carregando) return <p className="revisao-aviso">Carregando revisão...</p>;

    if (!pergunta) {
      return (
        <div className="revisao-vazio">
          <p className="revisao-aviso">{erro || "Não há palavras para revisar agora."}</p>
          <button type="button" className="revisao-btn" onClick={() => navigate("/perfil")}>
            Voltar ao perfil
          </button>
        </div>
      );
    }

    return (
      <>
        <p className="revisao-contador">
          Palavras para revisar: {pergunta.totalPalavrasParaRevisar}
        </p>

        <div className="revisao-cartao">
          {pergunta.imagemUrl && (
            <img src={pergunta.imagemUrl} alt="" className="revisao-imagem" />
          )}
          <h2 className="revisao-palavra">{pergunta.front}</h2>
        </div>

        <div className="revisao-opcoes">
          {pergunta.opcoes.map((opcao) => {
            let classe = "revisao-opcao";
            if (resultado) {
              if (opcao.id === escolhido && resultado.acertou) classe += " certa";
              else if (opcao.id === escolhido) classe += " errada";
            }
            return (
              <button
                key={opcao.id}
                type="button"
                className={classe}
                onClick={() => responder(opcao.id)}
                disabled={!!resultado || enviando}
              >
                {opcao.texto}
              </button>
            );
          })}
        </div>

        {resultado && resultado.acertou && pergunta.totalPalavrasParaRevisar === 1 && (
          <div className="revisao-feedback">
            <p className="revisao-acerto">
              Isso mesmo! Você revisou todas as palavras. Muito bem!
            </p>
            <button type="button" className="revisao-btn" onClick={() => navigate("/perfil")}>
              Voltar ao início
            </button>
          </div>
        )}

        {resultado && !(resultado.acertou && pergunta.totalPalavrasParaRevisar === 1) && (
          <div className="revisao-feedback">
            <p className={resultado.acertou ? "revisao-acerto" : "revisao-erro"}>
              {resultado.acertou
                ? "Parabéns! Você acertou."
                : `Não foi dessa vez! Mas você terá outra chance. `}
            </p>
            <button type="button" className="revisao-btn" onClick={carregarPergunta}>
              Próxima palavra
            </button>
          </div>
        )}

        {erro && <p className="revisao-erro">{erro}</p>}
      </>
    );
  };

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="revisao-pagina">
        <div className="revisao-coluna">
          <button type="button" className="revisao-voltar" onClick={() => navigate("/perfil")}>
            ← Voltar
          </button>
          <h1 className="revisao-titulo">Revisar meus erros</h1>
          {renderizarConteudo()}
        </div>
      </div>
    </DashboardLayout>
  );
}

