import { Link } from "react-router-dom";
import { auth } from "../server/firebase";
import { FiUser } from "react-icons/fi";
const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Issue Tracker</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link
          to="/create"
          style={{
            color: "white",
            backgroundColor: "#f1356d",
            borderRadius: "8px",
          }}
        >
          New Issue
        </Link>
        <div className="dropdown">
          <p className="text">
            <FiUser style={{ marginRight: 5 }} />
            {auth.currentUser.displayName}
          </p>
          <div className="dropdown-content">
            <Link
              to="/"
              style={{ color: "#f1356d", fontWeight: "bold" }}
              onClick={() => auth.signOut()}
              to="/"
            >
              Sign out
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
