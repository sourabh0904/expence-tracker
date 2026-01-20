import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">Splitwise</Link>
        <div className="nav-links">
          {user ? (
            <>
              <span>Hello, {user.name}</span>
              <Link to="/">Expenses</Link>
              <Link to="/groups">Groups</Link>
              <Link to="/add">Add Expense</Link>
              <Link to="/balances">Balances</Link>
              <button onClick={logout} className="btn btn-danger" style={{ marginLeft: "10px" }}>Logout</button>
            </>
          ) : (
             <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
             </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
