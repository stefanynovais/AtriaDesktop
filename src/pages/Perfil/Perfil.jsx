import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useAuth } from "../../contexts/useAuth";
import api from "../../services/api";
import logo from "../../assets/logo_atria_branca.png";
import "./style.css";

export default function Perfil() {
  const { user } = useAuth();

  const [estatisticas, setEstatisticas] = useState(null);
  const [carregandoStats, setCarregandoStats] = useState(true);
  const [erroStats, setErroStats] = useState("");

  useEffect(() => {
    let cancelado = false;

    const carregar = async () => {
      try {
        const resposta = await api.get("/estatisticas/aluno");
        if (!cancelado) setEstatisticas(resposta.data);
      } catch (error) {
        if (!cancelado) {
          setErroStats(
            error.response?.data?.message || "Não foi possível carregar as estatísticas."
          );
        }
      } finally {
        if (!cancelado) setCarregandoStats(false);
      }
    };

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  const renderizarEstatisticas = () => {
    if (carregandoStats) return <p className="tela-vazio">Carregando estatísticas...</p>;
    if (erroStats) return <p className="tela-vazio">{erroStats}</p>;
    if (!estatisticas || estatisticas.totalRespostas === 0) {
      return <p className="tela-vazio">Você ainda não respondeu nenhum flashcard.</p>;
    }

    return (
      <div className="tela-card">
        <p><strong>Respostas:</strong> {estatisticas.totalRespostas}</p>
        <p><strong>Acertos:</strong> {estatisticas.totalAcertos}</p>
        <p><strong>Erros:</strong> {estatisticas.totalErros}</p>
        <p><strong>Aproveitamento:</strong> {estatisticas.aproveitamento}%</p>
        <p><strong>Palavras aprendidas:</strong> {estatisticas.numeroPalavrasAprendidas}</p>
        <p><strong>Palavras para revisar:</strong> {estatisticas.numeroPalavrasParaRevisar}</p>
      </div>
    );
  };

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="tela">
        <div className="tela-overlay"></div>
        <div className="tela-conteudo">
          <img src={logo} alt="Atria" className="tela-logo" />
          <h2 className="tela-titulo">Perfil</h2>

          {!user && <p className="tela-vazio">Carregando...</p>}

          {user && (
            <div className="tela-card">
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Perfil:</strong> {user.role === "PROFESSOR" ? "Professor" : "Aluno"}</p>
            </div>
          )}

          {user && user.role !== "PROFESSOR" && (
            <>
              <h3 className="tela-subtitulo">Estatísticas</h3>
              {renderizarEstatisticas()}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
