import starAtria from '../../assets/star.png';
import './style.css';

export default function Logo() {
  return (
    <div className="logo-container">
      <img src={starAtria} alt="Atria" className="logo" />

      <h1 className="logo-text">Atria</h1>
    </div>
  );
}
