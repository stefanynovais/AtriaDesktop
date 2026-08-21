import './Landing.css';
import TopBar from '../../components/TopBar/TopBar';
import LiquidGlass from '../../components/LiquidGlass/LiquidGlass';
import BottomBar from '../../components/BottomBar/BottomBar';
import cardsImg from '../../assets/Cards.png';
import miniTelaImg from '../../assets/Mini_tela.png';
import moneyImg from '../../assets/money.png';

function Landing() {
  return (
    <>
      <TopBar />

      <section className="topbg">
        <h1>
          Learn with
          <br />
          flashcards!
        </h1>
        <LiquidGlass>
          <p>
            O uso de flashcards é uma técnica de estudo que trabalha com a memorização ativa,
            permitindo revisões rápidas e eficazes. Já o Game Based Learning é uma abordagem
            educacional que utiliza elementos de jogos digitais ou físicos para engajar, motivar e
            facilitar a aquisição de conhecimento. O resultado da combinação dessas duas técnicas é
            um ambiente onde o estudante pode revisar os conteúdos que escolher de sua própria
            maneira, além de se divertir enquanto aprende, o que resulta na maximização do
            aprendizado.
          </p>
        </LiquidGlass>
      </section>

      <section className="white split-section">
        <img src={cardsImg} alt="Flashcards" className="split-image" />
        <div className="split-content">
          <h1>Aprenda do seu jeito!</h1>
          <p>
            Com o Atria, é possível utilizar as técnicas de memorização com flashcards e retenção de
            conteúdo através de jogos com o seu próprio material. Aprenda de forma dinâmica e no seu
            próprio ritmo!
          </p>
        </div>
        <div className="wave">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </section>

      <section className="white split-section split-reverse-stack">
        <img src={miniTelaImg} alt="Painel de progresso" className="split-image" />
        <div className="split-content">
          <h1>
            Acompanhe seu progresso
            <br />
            com os Streaks!
          </h1>
        </div>
      </section>

      <section className="white split-section">
        <img src={moneyImg} alt="Economia" className="split-image" />
        <div className="split-content">
          <h1>Livre de transações!</h1>
          <p>
            No Atria, não há barreiras para te impedir de atingir seu aprendizado personalizado
            ideal, isso inclui barreiras financeiras, o site é 100% gratuiito, tendo como foco a
            retenção de conteúdo do estudante e não o lucro.
          </p>
        </div>
      </section>

      <section className="bottombg">
        <h1>
          Comece sua jornada de
          <br />
          aprendizado aqui!
        </h1>
        <BottomBar />
      </section>
    </>
  );
}

export default Landing;