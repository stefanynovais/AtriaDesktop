import { Link } from "react-router-dom";
import { FaHome, FaFolder, FaUser, FaInfoCircle } from "react-icons/fa";

import "./style.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">

        <Link to="/home">
          <FaHome />
        </Link>

        <Link to="/decks">
          <FaFolder />
        </Link>

        <Link to="/perfil">
          <FaUser />
        </Link>

      </div>

      <div className="sidebar-bottom">
        <Link to="/info">
          <FaInfoCircle />
        </Link>
      </div>
    </aside>
  );
}