import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

import starAtria from '../../assets/star.png';
import { LayoutComponents } from '../../components/LayoutComponents/LayoutComponents/LayoutComponents';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // evita recarregar a página

    // valida login
    navigate('/home');
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
            className={email !== '' ? 'has-val input' : 'input'} //if ternário: se o valor do email for diferente de vazio, adiciona-se a classe "has". Se ele estiver vazio, permanecer só com a classe input.
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />{' '}
          {/* captura o valor recebido */}
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

        <div className="container-login-form-btn">
          <button className="login-form-btn" type="submit">
            Login
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
