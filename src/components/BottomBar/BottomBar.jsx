import { useNavigate } from 'react-router-dom';
import './BottomBar.css';
import logo from '../../assets/logo_atria_branca.png';

function BottomBar() {
  const navigate = useNavigate();

  return (
    <footer className="bottombar">
      <div className="bottombar-left">
        <img src={logo} alt="Atria" className="bottombar-logo" />
        <button className="bottombar-about" onClick={() => navigate('/sobre')}>
          Sobre nós
        </button>
      </div>

      <div className="bottombar-buttons">
        <button className="bottombar-btn" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="bottombar-btn" onClick={() => navigate('/tipo-de-conta')}>
          Sign Up
        </button>
      </div>

      <p className="bottombar-alpha">ver. alpha</p>
    </footer>
  );
}

export default BottomBar;