import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

import starAtria from '../../assets/star.png';
import { LayoutComponents } from '../../components/LayoutComponents/LayoutComponents';
import { useAuth } from '../../contexts/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // evita recarregar a página
    setErro('');
    setCarregando(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      // erro.response.data.message vem da própria API (ex: "Credenciais inválidas")
      setErro(error.response?.data?.message || 'Não foi possível fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <LayoutComponents>
      <form className="login-form" onSubmit={handleLogin}>
        <span className="login-form-title"> Seja bem-vindo ao Atria! </span>

        <span className="login-form-title">
          <img src={starAtria} alt="ATRIA" />
        </span>

        <div className="wrap-input">
          <input
            className={email !== '' ? 'has-val input' : 'input'}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="focus-input" data-placeholder="Email"></span>
        </div>

        <div className="wrap-input">
          <input
            className={password !== '' ? 'has-val input' : 'input'}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="focus-input" data-placeholder="Password"></span>
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
  );
};

export default Login;
