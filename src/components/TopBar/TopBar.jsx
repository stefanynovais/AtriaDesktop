import './TopBar.css';
import logo from '../../assets/logo_atria_branca.png';

function TopBar() {
  return (
    <header className="topbar">
      <img src={logo} alt="Atria" className="topbar-logo" />

      <div className="topbar-buttons">
        <button className="btn-login">Login</button>
        <button className="btn-signup">Sign Up</button>
      </div>
    </header>
  );
}

export default TopBar;