import { useState } from "react";
import { Navigate } from "react-router-dom";

import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import { useGeneralContext } from "../context/GeneralContext.js";

export default function Authentication() {
  const { status, user } = useGeneralContext();
  const [mode, setMode] = useState("register");

  if (user) {
    return <Navigate to={user.usertype === "admin" ? "/admin" : "/profile"} replace />;
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Register
          </button>
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
        </div>
        {status.error && <p className="message error">{status.error}</p>}
        {status.success && <p className="message success">{status.success}</p>}
        {mode === "register" ? <Register /> : <Login />}
      </div>
    </section>
  );
}
