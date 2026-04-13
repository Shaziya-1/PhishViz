import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext";

const Navbar = () => {
  const { isLight, setIsLight } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="logo">PhishViz</div>

      <div className="nav-center">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/url-check">URL Checker</NavLink>
        <NavLink to="/email-analyzer">Email Analysis</NavLink>
        <NavLink to="/qr-scanner">QR Scanner</NavLink>
        <NavLink to="/attack-analysis">Attacks</NavLink>
        <NavLink to="/geo">Geo Map</NavLink>
        <NavLink to="/quiz">Quiz 🎮</NavLink>
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
