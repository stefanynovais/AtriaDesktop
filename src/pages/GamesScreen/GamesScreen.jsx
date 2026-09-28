import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import basicosImg from '../../assets/botao_basicos.png';
import jogoMemoriaImg from '../../assets/botao_jogo_memoria.png';
import verdadeiroFalsoImg from '../../assets/botao_verdadeiro_falso.png';
import apresentarCartoesImg from '../../assets/botao_apresentar_cartoes.png';
import './GamesScreen.css';

export default function GamesScreen() {
  const navigate = useNavigate();
  const { deckId } = useParams();

  const modos = [
    { nome: 'Básicos', img: basicosImg, rota: 'basicos' },
    { nome: 'Jogo da memória', img: jogoMemoriaImg, rota: 'jogo-da-memoria' },
    { nome: 'Verdadeiro ou falso', img: verdadeiroFalsoImg, rota: 'verdadeiro-ou-falso' },
    { nome: 'Apresentar cartões', img: apresentarCartoesImg, rota: 'apresentar-cartoes' },
  ];

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="games-page">
        <div className="games-stars-overlay"></div>

        <section className="games-section">
          <h1>O que você deseja aprender hoje?</h1>

          <div className="games-options">
            {modos.map((modo) => (
              <button
                key={modo.rota}
                className="games-option-btn"
                onClick={() => navigate(`/games/${deckId}/${modo.rota}`)}
              >
                <img src={modo.img} alt={modo.nome} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
