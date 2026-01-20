import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">Splitwise</Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          {user ? (
            <>
              <span className="user-greeting">Hello, {user.name}</span>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Expenses</Link>
              <Link to="/groups" onClick={() => setIsMenuOpen(false)}>Groups</Link>
              <Link to="/add" onClick={() => setIsMenuOpen(false)}>Add Expense</Link>
              <Link to="/balances" onClick={() => setIsMenuOpen(false)}>Balances</Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="btn btn-danger logout-btn">Logout</button>
            </>
          ) : (
             <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Signup</Link>
             </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
