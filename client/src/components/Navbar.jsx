import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../theme/ThemeContext";

const Navbar = () => {
  const { isLight, setIsLight } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">PhishViz</div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-center ${isOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setIsOpen(false)}>Dashboard</NavLink>
        <NavLink to="/url-check" onClick={() => setIsOpen(false)}>URL Checker</NavLink>
        <NavLink to="/email-analyzer" onClick={() => setIsOpen(false)}>Email Analysis</NavLink>
        <NavLink to="/qr-scanner" onClick={() => setIsOpen(false)}>QR Scanner</NavLink>
        <NavLink to="/attack-analysis" onClick={() => setIsOpen(false)}>Attacks</NavLink>
        <NavLink to="/geo" onClick={() => setIsOpen(false)}>Geo Map</NavLink>
        <NavLink to="/quiz" onClick={() => setIsOpen(false)}>Quiz 🎮</NavLink>
      </div>

      <button
        className="theme-btn"
        onClick={() => setIsLight(!isLight)}
        title="Toggle theme"
      >
        {isLight ? "🌙" : "☀️"}
      </button>
    </nav>
  );
};

export default Navbar;
