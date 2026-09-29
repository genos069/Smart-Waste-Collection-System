import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Bin from "../assets/bin.svg";
export default function Navbar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    if (saving) return;
    setSaving(true); setError("");
    try { await logout(); setUser(null); navigate("/login", { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  return <><nav className="driver-navbar" aria-label="Driver navigation">
    <Link to="/" className="driver-brand"><img src={Bin} alt="" /><span>Smart Waste Collection</span></Link>
    <button type="button" onClick={signOut} disabled={saving}><LogOut size={18} />{saving ? "Signing out…" : "Log out"}</button>
  </nav>{error && <p role="alert" className="form-error">{error}</p>}</>;
}
