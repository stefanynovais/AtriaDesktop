import { useState } from 'react';
import './LandingPage.css';

export default function LandingPage() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <header>
        <nav id="navbar">
          <a href="#home" className="nav-logo-link">
            <span className="logo-emoji">🛸</span>
            <span className="logo-texto">Atria</span>
          </a>

          <ul id="nav_list" className={menuAberto ? 'ativo' : ''}>
            <li className="nav-item active">
              <a href="#home">Sobre Nós</a>
            </li>
            <li className="nav-item">
              <a href="#metodologia">Metodologia</a>
            </li>
            <li className="nav-item">
              <a href="#contato">Contato</a>
            </li>
          </ul>

          <div className="nav-buttons">
            <a href="/login" className="btn-outline">
              Login
            </a>
            <a href="/register" className="btn-default">
              Cadastrar
            </a>
          </div>

          <button
            id="mobile_menu"
            aria-label="Abrir menu"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </nav>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section id="home">
          <div className="estrelas" aria-hidden="true"></div>

          <div id="cta">
            <span className="section-subtitle">Aprenda de um jeito diferente</span>
            <h1 className="title">
              Aprenda idiomas de forma <span>divertida</span> com Flashcards
            </h1>
            <p className="description">
              A Atria é uma plataforma de aprendizado de idiomas que utiliza flashcards,
              interatividade e gamificação para tornar o processo de estudo mais ágil, eficiente e
              envolvente.
            </p>
            <p className="description">
              Aprenda novas palavras, revise conteúdos e fortaleça sua memória de maneira simples e
              dinâmica. Transforme seus momentos de estudo em uma experiência divertida enquanto
              acompanha sua evolução.
            </p>
            <div id="cta_buttons">
              <a href="/login" className="btn-default">
                Login
              </a>
              <a href="/register" className="btn-outline-light">
                Cadastrar
              </a>
            </div>
          </div>

          <div id="banner">
            <div className="banner-placeholder">
              <i className="fa-solid fa-layer-group"></i>
            </div>
          </div>
        </section>

        {/* ================= ONDA + APRENDA DO SEU JEITO ================= */}
        <section id="aprenda-jeito">
          <svg className="onda-topo" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,0 500,60 C650,120 750,20 900,70 C1000,105 1100,40 1200,0 L1200,0 L0,0 Z"></path>
          </svg>
          <div className="secao-conteudo">
            <h2 className="section-title-clara">Aprenda do seu jeito!</h2>
            <p className="section-description-clara">
              Com o Atria, é possível utilizar as técnicas de memorização com flashcards e retenção
              de conteúdo através de jogos, no seu próprio ritmo — sem pressão, sem prazo, e sem
              custo nenhum.
            </p>
          </div>
        </section>

        {/* ================= STREAKS ================= */}
        <section id="streaks">
          <h2 className="section-title-clara">Acompanhe seu progresso com os Streaks!</h2>
          <div className="streaks-card">
            <div className="streaks-card-header">
              <span className="logo-emoji">🛸</span>
              <span className="logo-texto-pequeno">Atria</span>
              <i
                className="fa-solid fa-circle-user"
                style={{ marginLeft: 'auto', fontSize: '22px' }}
              ></i>
            </div>
            <div className="streaks-card-body">
              <div className="barras">
                <div className="barra barra-verde" style={{ height: '70%' }}></div>
                <div className="barra barra-rosa" style={{ height: '35%' }}></div>
                <div className="barra barra-azul" style={{ height: '55%' }}></div>
              </div>
              <div className="streaks-info">
                <p>30% de acertos no último deck</p>
                <p>65,6% de acertos em todos os decks hoje</p>
                <p>47,7% de média diária</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LIVRE DE TRANSAÇÕES ================= */}
        <section id="gratis">
          <h2 className="section-title-clara">Livre de transações!</h2>
          <div className="gratis-conteudo">
            <p className="section-description-clara">
              No Atria, não há barreiras para te impedir de atingir seu aprendizado personalizado
              ideal, isso inclui barreiras financeiras — o site é 100% gratuito, tendo como foco a
              retenção de conteúdo do estudante, e não o lucro.
            </p>
            <div className="gratis-icone">
              <i className="fa-solid fa-hand-holding-dollar"></i>
            </div>
          </div>
        </section>

        {/* ================= METODOLOGIA ================= */}
        <section id="metodologia">
          <div className="section-content">
            <div className="section-text">
              <span className="section-subtitle">Nossa Metodologia</span>
              <h2 className="section-title">
                Aprenda de forma <span>ágil, interativa e eficiente.</span>
              </h2>
              <p className="section-description">
                A Atria utiliza flashcards como base para tornar o aprendizado de novos idiomas mais
                rápido e eficiente. Nossa metodologia foi desenvolvida para facilitar a memorização
                e ajudar você a revisar os conteúdos de maneira prática.
              </p>
              <p className="section-description">
                Através de uma experiência interativa e gamificada, estudar se torna mais dinâmico.
                Você aprende novas palavras, expressões e conceitos enquanto acompanha seu
                progresso.
              </p>
            </div>

            <div className="methodology-cards">
              <div className="methodology-card">
                <div className="methodology-icon">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <h3>Aprendizado Ágil</h3>
                <p>Estude de maneira rápida e objetiva, aproveitando melhor o seu tempo.</p>
              </div>
              <div className="methodology-card">
                <div className="methodology-icon">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <h3>Memorização</h3>
                <p>
                  Utilize flashcards para fortalecer sua memória e facilitar a retenção de novos
                  conteúdos.
                </p>
              </div>
              <div className="methodology-card">
                <div className="methodology-icon">
                  <i className="fa-solid fa-gamepad"></i>
                </div>
                <h3>Gamificação</h3>
                <p>
                  Transforme seus estudos em uma experiência interativa, divertida e motivadora.
                </p>
              </div>
              <div className="methodology-card">
                <div className="methodology-icon">
                  <i className="fa-solid fa-language"></i>
                </div>
                <h3>Aprendizado de Idiomas</h3>
                <p>Amplie seu vocabulário e desenvolva seus conhecimentos em diferentes idiomas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTATO ================= */}
        <section id="contato">
          <div className="contact-content">
            <span className="section-subtitle">Entre em contato</span>
            <h2 className="section-title">
              Vamos <span>conversar?</span>
            </h2>
            <p className="section-description">
              Tem alguma dúvida, sugestão ou gostaria de saber mais sobre a Atria? Entre em contato
              conosco. Estamos prontos para ajudar você nessa jornada de aprendizado.
            </p>

            <div className="contact-options">
              <a href="mailto:contato@atria.com" className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <h3>E-mail</h3>
                  <p>contato@atria.com</p>
                </div>
              </a>
              <a href="#" className="contact-item">
                <i className="fa-brands fa-instagram"></i>
                <div>
                  <h3>Instagram</h3>
                  <p>@atria</p>
                </div>
              </a>
              <a href="#" className="contact-item">
                <i className="fa-solid fa-headset"></i>
                <div>
                  <h3>Suporte</h3>
                  <p>Fale com nossa equipe</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section id="cta-final">
          <div className="estrelas" aria-hidden="true"></div>
          <h2 className="cta-final-titulo">Comece sua jornada de aprendizado aqui!</h2>
          <a href="/register" className="btn-default btn-cta-final">
            Criar minha conta
          </a>
        </section>
      </main>

      <footer>
        <div className="footer-conteudo">
          <div className="footer-logo">
            <span className="logo-emoji">🛸</span>
            <span className="logo-texto">Atria</span>
          </div>
          <div className="footer-links">
            <a href="#home">Sobre nós</a>
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
