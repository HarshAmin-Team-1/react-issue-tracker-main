import { Alert } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signinUser } from "../../server/authentication";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [signingin, setSigningin] = useState(false);
  const handleSignin = async (e) => {
    setSigningin(true);
    e.preventDefault();
    try {
      await signinUser(email, password);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // alert("Wrong Email and/or Password.");
    } finally {
      setSigningin(false);
    }
  };
  return (
    <div className="create">
      <p style={{ marginBottom: 20 }}>
        {error && <Alert severity="error">{error}</Alert>}
      </p>

      <h2>Sign in</h2>
      <form onSubmit={handleSignin}>
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="LoginButton">
          <button disabled={signingin} style={{ opacity: signingin ? 0.5 : 1 }}>
            {signingin ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
      <div style={{ marginTop: 20 }}>
        <Link to="/forgotPassword">
          <h4 className="ForgotP">Forgot Password</h4>
        </Link>
      </div>
    </div>
  );
};
export default Signin;
