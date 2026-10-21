import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import api from "../../services/api";
import logo from "../../assets/logo_atria_branca.png";
import "./style.css";

export default function Decks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.get("/decks")
      .then((res) => setDecks(Array.isArray(res.data) ? res.data : []))
      .catch(() => setErro("Não foi possível carregar os baralhos."))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="tela">
        <div className="tela-overlay"></div>
        <div className="tela-conteudo">
          <img src={logo} alt="Atria" className="tela-logo" />
          <h2 className="tela-titulo">Decks</h2>

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
                onClick={() => navigate(`/games/${d.id}`)}
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