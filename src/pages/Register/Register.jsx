import { LayoutComponents } from '../../components/LayoutComponents/LayoutComponents';
import { useState } from 'react';
import starAtria from '../../assets/star.png';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const { registrar } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault(); // evita recarregar a página
    setErro('');
    setCarregando(true);

    try {
      // role "COMUM" = usuário comum/aluno (cadastro público)
      await registrar(name, email, password, 'COMUM');
      navigate('/home');
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <LayoutComponents>
      <form className="login-form" onSubmit={handleRegister}>
        <span className="login-form-title"> Criar Conta </span>

        <span className="login-form-title">
          <img src={starAtria} alt="ATRIA" />
        </span>

        <div className="wrap-input">
          <input
            className={name !== '' ? 'has-val input' : 'input'}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className="focus-input" data-placeholder="Nome"></span>
        </div>

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
            {carregando ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </div>

        <div className="text-center">
          <span className="txt1">Já possui conta?</span>
          <Link to="/login" className="txt2">
            {' '}
            Acessar com Email e Senha.
          </Link>
        </div>
      </form>
    </LayoutComponents>
  );
};
