import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { LayoutComponents } from '../../components/LayoutComponents/LayoutComponents';
import { useAuth } from '../../contexts/AuthContext';
import { etecs } from '../../data/etecs';
import './InstitutionalRegister.css';

const InstitutionalRegister = () => {
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [codigoEtec, setCodigoEtec] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { registrar } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await registrar(nome, email, password, 'INSTITUCIONAL', codigoEtec);
      navigate('/home');
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="register-page">
      <LayoutComponents>
        <form className="login-form" onSubmit={handleRegister}>
          <span className="login-form-title">Cadastro</span>

          <div className="form-columns">
            <div className="form-column">
              <div className="input-field-box">
                <label>Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="input-field-box">
                <label>Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-column">
              <div className="input-field-box">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="input-field-box">
                <label>Código da ETEC</label>
                <select value={codigoEtec} onChange={(e) => setCodigoEtec(e.target.value)}>
                  <option value="">Selecione</option>
                  {etecs.map((etec) => (
                    <option key={etec.codigo} value={etec.codigo}>
                      {etec.codigo} - {etec.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {erro && <span className="login-error">{erro}</span>}

          <div className="container-login-form-btn">
            <button className="login-form-btn" type="submit" disabled={carregando}>
              {carregando ? 'Criando...' : 'Cadastrar'}
            </button>
          </div>

          <div className="text-center">
            <span className="txt1">Já possui conta?</span>
            <Link to="/login" className="txt2">
              {' '}
              Fazer login.
            </Link>
          </div>
        </form>
      </LayoutComponents>
    </div>
  );
};

export default InstitutionalRegister;
