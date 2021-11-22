import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h2>Sorry</h2>
      <p style={{ marginTop: 10 }}>That page cannot be found</p>
      <div style={{ marginTop: 30 }}>
        <Link style={{ color: "#f1356d" }} to="/">
          Back to the homepage...
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
