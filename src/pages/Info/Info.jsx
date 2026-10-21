import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import logo from "../../assets/logo_atria_branca.png";
import "./style.css";

export default function Info() {
  return (
    <DashboardLayout hideHeader hideDots>
      <div className="tela">
        <div className="tela-overlay"></div>
        <div className="tela-conteudo">
          <img src={logo} alt="Atria" className="tela-logo" />
          <h2 className="tela-titulo">Sobre nós</h2>
          <div className="tela-card">
            <p>
              O projeto Atria dedica-se a mudar a vida de estudantes autodidatas oferecendo uma ferramenta 100% gratuita que trabalha com o aprendizado ativo e dinâmico. Nossas soluções jogáveis e ferramenta de streaks facilitam o processo de aprendizado e apresentam melhores resultados.
            </p>
            <p>
              A idealização do projeto foi feita em 2025 por quatro estudantes da ETEC Bento Quirino como projeto de conclusão de curso.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}