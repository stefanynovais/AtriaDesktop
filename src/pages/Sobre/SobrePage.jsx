import './SobrePage.css';

const equipe = [
  { nome: 'Ana Júlia Assumpção Oliveira', funcao: 'Protótipo, Social Media e Frontend' },
  { nome: 'Luana Gabriella dos Reis', funcao: 'Artigo científico, Bentotec e Backend' },
  { nome: 'Muryllo Jesus Alves Linhares', funcao: 'Backend e banco de dados' },
  { nome: 'Stefany Novais do Nascimento', funcao: 'Protótipo e Backend' },
];

export default function SobrePage() {
  return (
    <>
      <header>
        <nav id="navbar-sobre">
          <a href="/" className="nav-logo-link">
            <span className="logo-emoji">🛸</span>
            <span className="logo-texto">Atria</span>
          </a>
          <div className="nav-buttons">
            <a href="/login" className="btn-default">
              Login
            </a>
            <a href="/register" className="btn-rosa">
              Sign up
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* ================= SOBRE NÓS ================= */}
        <section id="sobre-nos">
          <div className="estrelas" aria-hidden="true"></div>
          <div className="sobre-conteudo">
            <h1 className="sobre-titulo">Sobre nós</h1>
            <p className="sobre-texto">
              O projeto Atria dedica-se a mudar a vida de estudantes autodidatas oferecendo uma
              ferramenta 100% gratuita que trabalha com o aprendizado ativo e dinâmico. Nossas
              soluções jogáveis e ferramenta de streaks facilitam o processo de aprendizado e
              apresentam melhores resultados.
            </p>
            <p className="sobre-texto">
              A idealização do projeto foi feita em 2025 por quatro estudantes da ETEC Bento Quirino
              como projeto de conclusão de curso.
            </p>
          </div>
        </section>

        {/* ================= EQUIPE ================= */}
        <section id="equipe">
          <div className="estrelas" aria-hidden="true"></div>
          <h2 className="equipe-titulo">Conheça a equipe!</h2>

          <div className="equipe-grade">
            {equipe.map((pessoa) => (
              <div className="equipe-card" key={pessoa.nome}>
                <div className="equipe-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <h3>{pessoa.nome}</h3>
                <p>{pessoa.funcao}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-conteudo">
          <div className="footer-logo">
            <span className="logo-emoji">🛸</span>
            <span className="logo-texto">Atria</span>
          </div>
          <div className="footer-links">
            <a href="/sobre">Sobre nós</a>
            <a href="/login">Login</a>
            <a href="/register">Sign up</a>
          </div>
          <div className="footer-legal">
            <a href="#">Termos de uso</a>
            <a href="#">Política de privacidade</a>
          </div>
          <span className="footer-versao">Ver. Alpha</span>
        </div>
      </footer>
    </>
  );
}
