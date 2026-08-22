import { useNavigate } from 'react-router-dom';
import './TopBar.css';
import logo from '../../assets/logo_atria_branca.png';

function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <img src={logo} alt="Atria" className="topbar-logo" />

      <div className="topbar-buttons">
        <button className="btn-login" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="btn-signup" onClick={() => navigate('/tipo-de-conta')}>
          Sign Up
        </button>
      </div>
    </header>
  );
}

export default TopBar;