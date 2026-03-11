import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGeneralContext } from "../context/GeneralContext.js";

export default function Login() {
  const navigate = useNavigate();
  const { login, status } = useGeneralContext();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await login(form);
      navigate(data.user.usertype === "admin" ? "/admin" : "/profile");
    } catch {
      return;
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
      />
      <button className="primary-button" type="submit" disabled={status.loading}>
        {status.loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
