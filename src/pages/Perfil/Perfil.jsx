import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useAuth } from "../../contexts/useAuth";
import api from "../../services/api";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import MinhasTurmas from "../../components/MinhasTurmas/MinhasTurmas";
import TurmasAluno from "../../components/TurmasAluno/TurmasAluno";
import BotaoModoLetras from "../../components/ModoLetras/BotaoModoLetras";
import logo from "../../assets/logo_atria_branca.png";
import "./style.css";

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);

  const [estatisticas, setEstatisticas] = useState(null);
  const [carregandoStats, setCarregandoStats] = useState(true);
  const [erroStats, setErroStats] = useState("");

  const sair = () => {
    logout();
    navigate("/login", { replace: true });
  };

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

  const ehProfessor = user?.role === "PROFESSOR";
  const inicial = user?.name?.trim().charAt(0).toUpperCase() || "?";

  const renderizarEstatisticas = () => {
    if (carregandoStats) return <p className="perfil-aviso">Carregando estatísticas...</p>;
    if (erroStats) return <p className="perfil-aviso">{erroStats}</p>;
    if (!estatisticas || estatisticas.totalRespostas === 0) {
      return <p className="perfil-aviso">Você ainda não respondeu nenhum flashcard.</p>;
    }

    const indicadores = [
      { rotulo: "Respostas", valor: estatisticas.totalRespostas },
      { rotulo: "Acertos", valor: estatisticas.totalAcertos },
      { rotulo: "Erros", valor: estatisticas.totalErros },
      { rotulo: "Aprendidas", valor: estatisticas.numeroPalavrasAprendidas },
      { rotulo: "Para revisar", valor: estatisticas.numeroPalavrasParaRevisar },
    ];

    return (
      <>
        <div className="perfil-grade">
          {indicadores.map((item) => (
            <div key={item.rotulo} className="perfil-indicador">
              <span className="perfil-indicador-valor">{item.valor}</span>
              <span className="perfil-indicador-rotulo">{item.rotulo}</span>
            </div>
          ))}
        </div>

        <div className="perfil-aproveitamento">
          <div className="perfil-aproveitamento-topo">
            <span>Aproveitamento</span>
            <strong>{estatisticas.aproveitamento}%</strong>
          </div>
          <div className="perfil-barra">
            <div
              className="perfil-barra-preenchida"
              style={{ width: `${estatisticas.aproveitamento}%` }}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="tela">
        <div className="tela-overlay"></div>
        <div className="tela-conteudo perfil-coluna">
          <img src={logo} alt="Atria" className="tela-logo" />

          {!user && <p className="perfil-aviso">Carregando...</p>}

          {user && (
            <div className="perfil-cabecalho">
              <div className="perfil-avatar">{inicial}</div>
              <div className="perfil-info">
                <h2 className="perfil-nome">{user.name}</h2>
                <p className="perfil-email">{user.email}</p>
                <span className="perfil-pilula">{ehProfessor ? "Professor" : "Aluno"}</span>
              </div>
            </div>
          )}

          {user && !ehProfessor && (
            <div className="perfil-secao">
              <h3 className="perfil-secao-titulo">Seu progresso</h3>
              {renderizarEstatisticas()}
              <button
                type="button"
                className="perfil-btn-revisar"
                onClick={() => navigate("/revisao-erros")}
              >
                Revisar meus erros
              </button>
            </div>
          )}

          {user && ehProfessor && (
            <button
              type="button"
              className="perfil-btn-revisar"
              onClick={() => navigate("/decks-prontos")}
            >
              Decks prontos
            </button>
          )}

          {user && ehProfessor && <MinhasTurmas />}
          {user && !ehProfessor && <TurmasAluno />}

          {user && <BotaoModoLetras />}

          {user && (
            <button
              type="button"
              className="perfil-btn-sair"
              onClick={() => setConfirmandoSaida(true)}
            >
              <FaSignOutAlt />
              Sair da conta
            </button>
          )}
        </div>

        <ModalConfirmacao
          aberto={confirmandoSaida}
          mensagem="Deseja realmente sair?"
          onSim={sair}
          onNao={() => setConfirmandoSaida(false)}
        />
      </div>
    </DashboardLayout>
  );
}

