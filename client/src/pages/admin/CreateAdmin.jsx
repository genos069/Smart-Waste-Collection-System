import { useState } from "react";
import Icon from "../../components/admin/Icon";
import { useNavigate } from "react-router-dom";
import { createAdmin } from "../../services/adminService";

export default function CreateAdmin() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin-dashboard");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", type: "admin" });
  const [visible, setVisible] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setError("");
    try {
      await createAdmin({ ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() });
      navigate("/user-list");
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-redesign"><div className="page">
      <header className="page-header">
        <button className="back-button" aria-label="Back to dashboard" onClick={onBack}>←</button>
        <div><p className="eyebrow">Team access</p><h1>Add a team member</h1><p className="subtitle">Create a secure account and choose the right permission level.</p></div>
      </header>
      <div className="form-layout">
        <form className="form-card" onSubmit={submit}>
          <div className="form-section-heading"><span className="step">01</span><div><h2>Personal details</h2><p>Enter the team member's basic information.</p></div></div>
          <div className="two-columns">
            <label>First name<input required name="firstName" value={form.firstName} onChange={update} placeholder="e.g. Amara" /></label>
            <label>Last name<input required name="lastName" value={form.lastName} onChange={update} placeholder="e.g. Green" /></label>
          </div>
          <label>Work email<input required type="email" name="email" value={form.email} onChange={update} placeholder="name@company.com" /></label>
          <div className="divider" />
          <div className="form-section-heading"><span className="step">02</span><div><h2>Access & security</h2><p>Assign their role and a temporary password.</p></div></div>
          <label>Permission level
            <select name="type" value={form.type} onChange={update}>
              <option value="admin">Administrator</option><option value="driver">Driver</option>
            </select>
          </label>
          <label>Temporary password
            <span className="input-with-action">
              <input required minLength={8} type={visible ? "text" : "password"} name="password" value={form.password} onChange={update} placeholder="Minimum 8 characters" />
              <button type="button" onClick={() => setVisible(!visible)}>{visible ? "Hide" : "Show"}</button>
            </span>
          </label>
          {error && <p className="request-message error-message" role="alert">{error}</p>}
          <div className="form-actions"><button type="button" className="secondary-button" onClick={onBack}>Cancel</button><button className="primary-button" disabled={saving}><Icon name="plus" /> {saving ? "Creating…" : "Create account"}</button></div>
        </form>
        <aside className="info-card">
          <span className="soft-icon green"><Icon name="users" /></span>
          <h3>Role permissions</h3>
          <p>Administrators manage bins and user accounts. Drivers access the collection dashboard and update pickup progress.</p>
          <ul><li>Administrator: bin and team management</li><li>Driver: collection dashboard</li><li>Role-based dashboard access</li></ul>
          <div className="security-note"><strong>Secure by default</strong><span>Share the initial password securely. Users can change it through the password reset flow.</span></div>
        </aside>
      </div>
    </div></div>
  );
}
