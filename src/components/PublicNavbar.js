import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PublicNavbar = () => {
  const history = useHistory();
  const location = useLocation();
  return (
    <nav className="navbar">
      <h1>Incident Tracker</h1>
      <div className="links">
        <Link to="/">Home</Link>
        {location.pathname === "/signup" ? (
          <Link
            to="/"
            style={{
              color: "white",
              backgroundColor: "#f1356d",
              borderRadius: "8px",
            }}
          >
            Sign in
          </Link>
        ) : (
          <Link
            to="/signup"
            style={{
              color: "white",
              backgroundColor: "#f1356d",
              borderRadius: "8px",
            }}
          >
            Sign up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
