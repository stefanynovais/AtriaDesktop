import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useAuth } from "../../contexts/useAuth";
import logo from "../../assets/logo_atria_branca.png";
import "./style.css";

export default function Perfil() {
  const { user } = useAuth();

  return (
    <DashboardLayout hideHeader hideDots>
      <div className="tela">
        <div className="tela-overlay"></div>
        <div className="tela-conteudo">
          <img src={logo} alt="Atria" className="tela-logo" />
          <h2 className="tela-titulo">Perfil</h2>

          {!user && <p className="tela-vazio">Carregando...</p>}

          {user && (
            <div className="tela-card">
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Perfil:</strong> {user.role === "PROFESSOR" ? "Professor" : "Aluno"}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}