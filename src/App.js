import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./server/firebase";
import AuthRouter from "./routes/auth";
import PublicRouter from "./routes/public";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  async function onUserChange(user) {
    setUser(user);
    setLoading(false);
  }
  onAuthStateChanged(
    auth,
    onUserChange,
    (err) => console.warn(err),
    () => {
      setLoading(false);
      window.location.reload();
    }
  );

  return (
    <>
      <Router>
        {loading ? (
          <div> Loading...</div>
        ) : user ? (
          <AuthRouter />
        ) : (
          <PublicRouter />
        )}
      </Router>
    </>
  );
}

export default App;
