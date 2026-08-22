import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { LayoutComponents } from '../../components/LayoutComponents/LayoutComponents';
import { useAuth } from '../../contexts/AuthContext';
import { etecs } from '../../data/etecs';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoConta, setTipoConta] = useState('comum');
  const [codigoEtec, setCodigoEtec] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <LayoutComponents>
        <form className="login-form" onSubmit={handleLogin}>
          <span className="login-form-title">Login</span>

          <div className="form-columns">
            <div className="form-column">
              <div className="input-field-box">
                <label>Nome ou email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-field-box">
                <label>Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="input-field-box">
                <label>Tipo de conta</label>
                <select
                  value={tipoConta}
                  onChange={(e) => setTipoConta(e.target.value)}
                >
                  <option value="comum">Comum</option>
                  <option value="institucional">Institucional</option>
                </select>
              </div>

              <div className="input-field-box">
                <label>Código da ETEC</label>
                <select
                  value={codigoEtec}
                  onChange={(e) => setCodigoEtec(e.target.value)}
                  disabled={tipoConta !== 'institucional'}
                >
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
              {carregando ? 'Entrando...' : 'Login'}
            </button>
          </div>

          <div className="text-center">
            <span className="txt1">Não possui conta?</span>
            <Link to="/register" className="txt2">
              {' '}
              Criar conta.
            </Link>
          </div>
        </form>
      </LayoutComponents>
    </div>
  );
};

export default Login;