import Logo from '../Logo/Logo';
import Navbar from '../Navbar/Navbar';
import './style.css';

export default function Header() {
  return (
    <header className="header">
      <Logo />
      <Navbar />
    </header>
  );
}
