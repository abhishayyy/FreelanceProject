import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link className="brand" to="/">FreelanceHub</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/login">Login</Link>
        <Link className="button small" to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
}


export default Navbar;
