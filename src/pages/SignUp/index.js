import { Alert } from "@mui/material";
import React, { useState } from "react";
import { createUser } from "../../server/authentication";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUser(email, password, username);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };
  return (
    <div className="create">
      <p style={{ marginBottom: 20 }}>
        {error && <Alert severity="error">{error}</Alert>}
      </p>
      <h2>Sign up</h2>
      {error && <p>{error.message}</p>}
      <form onSubmit={handleSignup}>
        <label>Username</label>
        <input
          type="username"
          required
          value={username}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
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
          <button>Sign up</button>
        </div>
      </form>
    </div>
  );
};
export default Signup;
