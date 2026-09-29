import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setError(""); setMessage("");
    try {
      const data = await forgotPassword(email.trim());
      setMessage(data.resetToken ? `${data.message} Development token: ${data.resetToken}` : data.message);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  return <main className="auth-page"><section className="auth-card">
    <h1>Forgot password?</h1><p>Enter your account email to receive a reset token. Tokens expire after 10 minutes.</p>
    <form onSubmit={submit} aria-busy={saving}>
      <label htmlFor="reset-email">Email</label><input id="reset-email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && <p className="form-success" role="status">{message}</p>}
      <button className="auth-submit" disabled={saving}>{saving ? "Sending…" : "Send reset instructions"}</button>
    </form>
    <div className="auth-links"><Link to="/reset-password">I have a reset token</Link><Link to="/login">Back to sign in</Link></div>
  </section></main>;
}
