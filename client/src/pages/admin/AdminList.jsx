import { useAuth } from "../../context/AuthContext";
import { useMemo, useState } from "react";
import Icon from "../../components/admin/Icon";
import RequestState from "../../components/admin/RequestState";
import { useNavigate } from "react-router-dom";
import { getAdmins, deleteAdmin } from "../../services/adminService";
import { formatDate } from "../../utils/adminData";
import useRemoteData from "../../hooks/useRemoteData";

export default function AdminList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, refresh } = useRemoteData(getAdmins);
  const admins = useMemo(() => (data?.data || []).map((admin) => ({ ...admin, id: admin._id })), [data]);
  const [actionError, setActionError] = useState("");
  const [removing, setRemoving] = useState(null);
  const onBack = () => navigate("/admin-dashboard");
  const onCreate = () => navigate("/create-users");
  const onDelete = async (id) => {
    if (removing !== null || id === user?.id) return;
    if (!window.confirm("Remove this account? This cannot be undone.")) return;
    setRemoving(id); setActionError("");
    try { await deleteAdmin(id); await refresh(); }
    catch (err) { setActionError(err.message); }
    finally { setRemoving(null); }
  };
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => admins.filter((admin) => `${admin.firstName} ${admin.lastName} ${admin.email}`.toLowerCase().includes(query.toLowerCase())), [admins, query]);

  return (
    <div className="admin-redesign"><div className="page">
      <header className="page-header">
        <button className="back-button" aria-label="Back to dashboard" onClick={onBack}>←</button>
        <div className="header-grow"><p className="eyebrow">Administration</p><h1>Team access</h1><p className="subtitle">Manage the people who can access your EcoTrack workspace.</p></div>
        <button className="primary-button" onClick={onCreate}><Icon name="plus" /> Add member</button>
      </header>
      <RequestState loading={loading} error={actionError || error} onRetry={refresh} />
      <section className="data-card">
        <div className="data-toolbar">
          <label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search team members" placeholder="Search team members..." /></label>
          <div className="toolbar-summary"><span className="live-dot" /> {admins.length} registered members</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>Permission level</th><th>Created</th><th>Last updated</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {filtered.map((admin, index) => (
                <tr key={admin.id}>
                  <td><div className={`member-avatar color-${index % 4}`}>{admin.firstName?.[0]}{admin.lastName?.[0]}</div><span className="member-copy"><strong>{admin.firstName} {admin.lastName}</strong><small>{admin.email}</small></span></td>
                  <td><span className="role-pill">{admin.type}</span></td>
                  <td className="muted">{formatDate(admin.createdAt)}</td>
                  <td className="muted">{formatDate(admin.updatedAt)}</td>
                  <td><button className="delete-button" disabled={removing !== null || admin.id === user?.id} title={admin.id === user?.id ? "You cannot remove your own account" : "Remove account"} onClick={() => onDelete(admin.id)}>{removing === admin.id ? "Removing…" : "Remove"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !error && filtered.length === 0 && <div className="empty-state"><span className="soft-icon green"><Icon name="users" /></span><h3>No team members found</h3><p>Try a different name or email address.</p></div>}
        </div>
        <div className="table-footer">Showing {filtered.length} of {admins.length} members</div>
      </section>
    </div></div>
  );
}
