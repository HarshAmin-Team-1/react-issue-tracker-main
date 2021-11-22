import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../server/firebase";
const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin,
      });
      alert("Password reset email sent.");
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="create">
      <h2>Enter Your Email Below</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="LoginButton">
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPass;
