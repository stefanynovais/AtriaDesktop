import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import api from "../../services/api";
import logo from "../../assets/logo_atria_branca.png";
import jogoMemoriaImg from "../../assets/botao_jogo_memoria.png";
import verdadeiroFalsoImg from "../../assets/botao_verdadeiro_falso.png";
import apresentarCartoesImg from "../../assets/botao_apresentar_cartoes.png";
import "../Decks/style.css";
import "../GamesScreen/GamesScreen.css";
import "./style.css";

// Mesmos modos da tela de lições, na mesma ordem
const MODOS = [
  { nome: "Jogo da memória", img: jogoMemoriaImg, rota: "jogo-da-memoria" },
  { nome: "Verdadeiro ou falso", img: verdadeiroFalsoImg, rota: "verdadeiro-ou-falso" },
  { nome: "Apresentar cartões", img: apresentarCartoesImg, rota: "apresentar-cartoes" },
];

export default function Jogos() {
  const navigate = useNavigate();
  const [modoEscolhido, setModoEscolhido] = useState(null);
  const [decks, setDecks] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.get("/decks")
      .then((res) => setDecks(Array.isArray(res.data) ? res.data : []))
      .catch(() => setErro("Não foi possível carregar os baralhos."))
      .finally(() => setCarregando(false));
  }, []);

  // Primeira etapa: escolher o modo
  if (!modoEscolhido) {
    return (
      <DashboardLayout hideHeader hideDots>
        <div className="games-page">
          <div className="games-stars-overlay"></div>

          <div className="games-section">
            <h1>O que você deseja aprender hoje?</h1>

            <div className="games-options">
              {MODOS.map((modo) => (
                <button
                  key={modo.rota}
                  type="button"
                  className="games-option-btn"
                  onClick={() => setModoEscolhido(modo)}
                >
                  <img src={modo.img} alt={modo.nome} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Segunda etapa: escolher o baralho para esse modo
  return (
    <DashboardLayout hideHeader hideDots>
      <div className="tela">
        <div className="tela-overlay"></div>
        <div className="tela-conteudo">
          <img src={logo} alt="Atria" className="tela-logo" />
          <h2 className="tela-titulo">{modoEscolhido.nome}</h2>

          <button
            type="button"
            className="jogos-btn-voltar"
            onClick={() => setModoEscolhido(null)}
          >
            ← Voltar aos modos
          </button>

          {carregando && <p className="tela-vazio">Carregando...</p>}
          {erro && <p className="tela-vazio">{erro}</p>}
          {!carregando && !erro && decks.length === 0 && (
            <p className="tela-vazio">Nenhum baralho ainda.</p>
          )}

          <div className="tela-lista">
            {decks.map((d) => (
              <div
                key={d.id}
                className="tela-item"
                onClick={() => navigate(`/games/${d.id}/${modoEscolhido.rota}`)}
              >
                {d.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
