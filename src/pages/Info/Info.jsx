
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import logo from "../../assets/logo_atria_branca.png";
import "./style.css";

const equipe = [
  { nome: "Ana Júlia Assumpção Oliveira", funcao: "Protótipo, Social Media e Frontend" },
  { nome: "Luana Gabriella dos Reis", funcao: "Artigo científico, Bentotec e Backend" },
  { nome: "Muryllo Jesus Alves Linhares", funcao: "Backend e banco de dados" },
  { nome: "Stefany Novais do Nascimento", funcao: "Protótipo e Backend" },
];

export default function Info() {
  return (
    <DashboardLayout hideHeader hideDots>
      <div className="tela">
        <div className="tela-overlay"></div>

        <main className="tela-conteudo">
          <img src={logo} alt="Atria" className="tela-logo" />

          <section className="info-sobre">
            <h1 className="tela-titulo">Sobre nós</h1>

            <div className="tela-card">
              <p>
                O projeto Atria dedica-se a mudar a vida de estudantes autodidatas
                oferecendo uma ferramenta 100% gratuita que trabalha com o
                aprendizado ativo e dinâmico. Nossas soluções jogáveis e ferramenta
                de streaks facilitam o processo de aprendizado e apresentam
                melhores resultados.
              </p>

              <p>
                A idealização do projeto foi feita em 2025 por quatro estudantes
                da ETEC Bento Quirino como projeto de conclusão de curso.
              </p>
            </div>
          </section>

          <section className="info-equipe">
            <h2 className="info-equipe-titulo">Conheça a equipe!</h2>

            <div className="info-equipe-grade">
              {equipe.map((pessoa) => (
                <div className="info-equipe-card" key={pessoa.nome}>
                  <div className="info-equipe-avatar" aria-hidden="true">
                    <span>👤</span>
                  </div>

                  <h3>{pessoa.nome}</h3>
                  <p>{pessoa.funcao}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </DashboardLayout>
  );
}
