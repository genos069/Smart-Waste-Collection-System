import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getBins } from "../services/binService";
import { logout } from "../services/authService";
import useRemoteData from "../hooks/useRemoteData";
import { normalizeBin, summarizeBins, formatDate, formatCoordinates } from "../utils/adminData";
import BinMap from "../components/BinMap";
import Icon from "../components/admin/Icon";
import RequestState from "../components/admin/RequestState";

const navItems = [
  { id: "dashboard", label: "Overview", icon: "grid" },
  { id: "map", label: "Live map", icon: "map" },
  { id: "bins", label: "Bin management", icon: "bin" },
  { id: "admins", label: "Team access", icon: "users" },
];

export default function AdminDashboard() {
  const navigateTo = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { data, loading, error, updatedAt, refresh } = useRemoteData(getBins, 15000);
  const bins = (data?.data || []).map(normalizeBin);
  const { critical, above90, collected, average } = summarizeBins(bins);
  const [active, setActive] = useState("dashboard");
  const [focus, setFocus] = useState(null);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const name = user?.name || "Administrator";
  const paths = { bins: "/all-bins", admins: "/user-list", "add-bin": "/admin-map", "create-admin": "/create-users" };
  const onNavigate = (id) => navigateTo(paths[id]);
  const navigate = (id) => {
    if (paths[id]) return onNavigate(id);
    setActive(id);
  };
  const signOut = async () => {
    setLoggingOut(true);
    try { await logout(); setUser(null); navigateTo("/login", { replace: true }); }
    catch (err) { setLogoutError(err.message); }
    finally { setLoggingOut(false); }
  };

  return (
    <div className="admin-redesign"><div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Icon name="leaf" size={23} /></span>
          <span>EcoTrack</span>
        </div>
        <p className="nav-label">Workspace</p>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} aria-label={item.label} title={item.label} onClick={() => navigate(item.id)}>
              <Icon name={item.icon} /><span>{item.label}</span>
              {item.id === "bins" && critical > 0 && <span className="nav-count">{critical}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <span className="sidebar-card-icon"><Icon name="leaf" /></span>
          <strong>Cleaner city, smarter routes.</strong>
          <p>{bins.length} bins monitored across your collection network.</p>
        </div>
        <div className="profile">
          <span className="avatar">{name.slice(0, 2).toUpperCase()}</span>
          <span><strong>{name}</strong><small>Administrator</small></span>
          <span className="status-dot" />
        </div>
        <button className="nav-item logout-button" onClick={signOut} disabled={loggingOut} aria-label="Log out">{loggingOut ? "…" : "Log out"}</button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</p><h1>Welcome, {name}</h1></div>
          <div className="top-actions">
            <button className="secondary-button" onClick={refresh}>Refresh</button>
            <button className="primary-button" onClick={() => onNavigate("add-bin")}><Icon name="plus" /> Add new bin</button>
          </div>
        </header>

        <RequestState loading={loading} error={error || logoutError} onRetry={refresh} />
        {updatedAt && <p className="sync-note">Last synced {updatedAt.toLocaleTimeString()} · Refreshes every 15 seconds</p>}
        <section className="stats-grid stagger">
          <article className="stat-card">
            <div className="stat-top"><span className="soft-icon green"><Icon name="bin" /></span><span className="trend positive">Inventory</span></div>
            <p>Total smart bins</p><strong>{data ? bins.length : "—"}</strong><small>Registered collection points</small>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span className="soft-icon amber"><Icon name="bell" /></span><span className="trend urgent">Action needed</span></div>
            <p>Awaiting pickup</p><strong>{data ? critical : "—"}</strong><small>{above90} at or above 90%</small>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span className="soft-icon blue"><Icon name="route" /></span><span className="trend positive">Current status</span></div>
            <p>Collected bins</p><strong>{data ? collected : "—"}</strong><small>Marked collected by drivers</small>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span className="soft-icon violet"><Icon name="leaf" /></span><span className="trend positive">Capacity</span></div>
            <p>Average fill level</p><strong>{data ? `${average}%` : "—"}</strong><small>Across registered bins</small>
          </article>
        </section>

        <section className={`dashboard-grid ${active === "map" ? "expanded-map" : ""}`}>
          <article className="panel map-panel">
            <div className="panel-heading"><div><p className="eyebrow">Live operations</p><h2>City bin network</h2></div><button className="text-button" onClick={() => setActive(active === "map" ? "dashboard" : "map")}>{active === "map" ? "Overview" : "View full map"} <span>→</span></button></div>
            <div className="map-canvas">
              {!loading && <BinMap bins={bins} focus={focus} />}
              <div className="map-legend"><span><i className="healthy" />Healthy</span><span><i className="warning" />Filling</span><span><i className="critical" />Pickup</span></div>
            </div>
          </article>

          <article className="panel priority-panel">
            <div className="panel-heading"><div><p className="eyebrow">Priority queue</p><h2>Needs attention</h2></div><span className="trend urgent">{critical} pending</span></div>
            <div className="priority-list">
              {!loading && !error && !critical && <div className="empty-state"><h3>{bins.length ? "No pickups waiting" : "No bins yet"}</h3><p>{bins.length ? "All bins are below the pickup threshold." : "Add your first collection point to get started."}</p></div>}
              {bins.filter((bin) => bin.fill >= 75 && bin.status !== "Collected").slice().sort((a, b) => b.fill - a.fill).slice(0, 4).map((bin) => (
                <div className="priority-row" key={bin.id}>
                  <span className={`fill-ring ${bin.fill >= 75 ? "red" : bin.fill >= 50 ? "orange" : "green"}`} style={{ "--fill": `${bin.fill * 3.6}deg` }}><i>{bin.fill}</i></span>
                  <span className="priority-info"><strong>{bin.name}</strong><small>{formatCoordinates(bin)} · {formatDate(bin.updatedAt)}</small></span>
                  <button className="row-action" disabled={bin.lat === null} onClick={() => { setFocus(bin); setActive("map"); }}>Locate</button>
                </div>
              ))}
            </div>
            <button className="panel-footer" onClick={() => onNavigate("bins")}>View all bins <span>→</span></button>
          </article>
        </section>
      </main>
    </div></div>
  );
}
