import './Landing.css';
import TopBar from '../../components/TopBar/TopBar';
import LiquidGlass from '../../components/LiquidGlass/LiquidGlass';
import BottomBar from '../../components/BottomBar/BottomBar';

const tecnologias = ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'];

const equipe = [
  { nome: 'Ana Júlia', funcao: 'Frontend e design' },
  { nome: 'Luana Gabriella', funcao: 'Frontend, design e documentação' },
  { nome: 'Stefany', funcao: 'Backend e circuito' },
  { nome: 'Integrante 4', funcao: 'Backend e circuito' },
];

function Landing() {
  return (
    <>
      <TopBar />

      {/* ==================== Hero ==================== */}
      <section className="topbg">
        <h1>
          Learn with
          <br />
          flashcards!
        </h1>

        <LiquidGlass>
          <p>
            O Atria é uma plataforma gratuita de estudos que combina flashcards com aprendizagem
            baseada em jogos. Nosso objetivo é oferecer uma ferramenta acessível para estudantes
            autodidatas revisarem conteúdo próprio de forma ativa, dinâmica e no próprio ritmo,
            sem depender de metodologias tradicionais e repetitivas de memorização.
          </p>
        </LiquidGlass>

        {/* Curva no FINAL da seção */}
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

      {/* ==================== Problema e solução ==================== */}
      <section className="white split-section">
        <div className="split-content">
          <h1>O problema e a solução:</h1>
          <p>
            Muitos estudantes autodidatas têm dificuldade em manter constância nos estudos e em
            encontrar métodos de revisão que realmente fixem o conteúdo. Métodos tradicionais, como
            releitura passiva de anotações, costumam ser pouco eficazes e desmotivantes, o que afeta
            principalmente estudantes que precisam se preparar sozinhos e, na maioria das vezes,
            não tem acesso a uma plataforma paga. Com o Atria, é possível utilizar as técnicas de
            memorização com flashcards e retenção de conteúdo através de jogos com o seu próprio
            material. Basta importar seu conteúdo e o Atria transforma em cartões de estudo prontos
            para revisão ativa, no seu próprio ritmo.
          </p>
        </div>
      </section>

      {/* ==================== Funcionalidades ==================== */}
      <section className="white info-section">
        <h1>Principais funcionalidades</h1>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Importação de conteúdo</h3>
            <p>Importe arquivos .apkg e .txt e transforme em flashcards automaticamente.</p>
          </div>
          <div className="feature-card">
            <h3>Jogo da memória</h3>
            <p>Revise pareando conceitos de forma lúdica e divertida.</p>
          </div>
          <div className="feature-card">
            <h3>Verdadeiro ou falso</h3>
            <p>Teste seu conhecimento respondendo afirmações sobre o conteúdo estudado.</p>
          </div>
          <div className="feature-card">
            <h3>Apresentação de cartões</h3>
            <p>Revise no formato clássico de flashcards, cartão a cartão.</p>
          </div>
        </div>
      </section>

      {/* ==================== Equipe ==================== */}
      <section id="equipe" className="white info-section">
        <h1>Nossa equipe</h1>
        <div className="team-grid">
          {equipe.map((membro) => (
            <div key={membro.nome} className="team-card">
              <h3>{membro.nome}</h3>
              <p>{membro.funcao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== Tecnologias ==================== */}
      <section className="white info-section">
        <h1>Tecnologias utilizadas</h1>
        <div className="tech-list">
          {tecnologias.map((tech) => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>
      </section>

      {/* ==================== CTA final ==================== */}
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