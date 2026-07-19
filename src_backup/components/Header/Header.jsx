import Logo from '../Logo';
import Navbar from '../Navbar';
import './style.css';

export default function Header() {
  return (
    <header className="header">
      <Logo />
      <Navbar />
    </header>
  );
}
