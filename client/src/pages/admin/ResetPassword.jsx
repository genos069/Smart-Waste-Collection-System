import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { passwordError } from "../../utils/validation";
export default function ResetPassword() {
  const { setUser } = useAuth();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setError(""); setMessage("");
    const invalid = passwordError(password);
    if (invalid || password !== confirm) { setError(invalid || "Passwords do not match."); return; }
    setSaving(true);
    try {
      const data = await resetPassword({ token: token.trim(), newPassword: password });
      setUser(null); setMessage(data.message); setToken(""); setPassword(""); setConfirm("");
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  return <main className="auth-page"><section className="auth-card">
    <h1>Reset password</h1><p>Paste the token from your email and choose a new password.</p>
    <form onSubmit={submit} aria-busy={saving}>
      <label htmlFor="token">Reset token</label><input id="token" required pattern="[a-fA-F0-9]{64}" title="Enter the 64-character token from your email" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value.trim())} />
      <label htmlFor="new-password">New password</label><input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
      <label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      <button className="auth-submit" disabled={saving}>{saving ? "Resetting…" : "Reset password"}</button>
    </form><div className="auth-links"><Link to="/forgot-password">Request a new token</Link><Link to="/login">Back to sign in</Link></div>
  </section></main>;
}
