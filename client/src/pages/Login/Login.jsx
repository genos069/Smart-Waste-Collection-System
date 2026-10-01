import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./Login.css"

const DEMO_DRIVER = {
  email: "driver@example.com",
  password: "0123456789",
};

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function useDemoDriver() {
    setEmail(DEMO_DRIVER.email);
    setPassword(DEMO_DRIVER.password);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setError("");
    setSaving(true);
    try {
      const { user } = await login({ email: email.trim(), password });
      if (!["admin", "driver"].includes(user?.type))
        throw new Error("This account does not have dashboard access.");
      setUser(user);
      navigate(
        user.type === "admin" ? "/admin-dashboard" : "/truck-dashboard",
        { replace: true },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Berhampur Municipal Corporation</p>
        <h1>Welcome back</h1>
        <p>Sign in to manage your waste collection network.</p>
        <form onSubmit={submit} aria-busy={saving}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="auth-submit" disabled={saving}>
            {saving ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="demo-login">
          <div className="demo-login-header">
            <span>Demo access</span>
            <span className="demo-badge">Driver</span>
          </div>

          <p>
            Want to explore the driver dashboard? Use the demo account below.
          </p>

          <button
            type="button"
            className="demo-button"
            onClick={useDemoDriver}
            disabled={saving}
          >
            Use Demo Driver Account
          </button>
        </div>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/">Back to home</Link>
        </div>
      </section>
    </main>
  );
}
