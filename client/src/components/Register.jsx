import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGeneralContext } from "../context/GeneralContext.js";

export default function Register() {
  const navigate = useNavigate();
  const { register, status } = useGeneralContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    usertype: "user",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await register(form);
      navigate(data.user.usertype === "admin" ? "/admin" : "/profile");
    } catch {
      return;
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(event) => setForm({ ...form, username: event.target.value })}
      />
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
      <div className="role-selector">
        <button
          className={form.usertype === "user" ? "role-pill active" : "role-pill"}
          type="button"
          onClick={() => setForm({ ...form, usertype: "user" })}
        >
          User
        </button>
        <button
          className={form.usertype === "admin" ? "role-pill active" : "role-pill"}
          type="button"
          onClick={() => setForm({ ...form, usertype: "admin" })}
        >
          Admin
        </button>
      </div>
      <button className="primary-button" type="submit" disabled={status.loading}>
        {status.loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
