import "./styles.css";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="navbar">

      {showSearch && (
        <div className="wrap-search">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="search-input"
          />

          <span className="focus-search"></span>
        </div>
      )}

      <FaSearch
        className="search-icon"
        onClick={() => setShowSearch(!showSearch)}
      />

    </div>
  );
}