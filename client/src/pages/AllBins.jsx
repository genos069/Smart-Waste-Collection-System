import { useMemo, useState } from "react";
import Icon from "../components/admin/Icon";
import RequestState from "../components/admin/RequestState";
import { useNavigate } from "react-router-dom";
import { getBins, deleteBin, deleteAllBins } from "../services/binService";
import useRemoteData from "../hooks/useRemoteData";
import { normalizeBin, formatCoordinates } from "../utils/adminData";

export default function AllBins() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin-dashboard");
  const onAdd = () => navigate("/admin-map");
  const { data, loading, error, refresh } = useRemoteData(getBins, 15000);
  const bins = useMemo(() => (data?.data || []).map(normalizeBin), [data]);
  const [actionError, setActionError] = useState("");
  const [removing, setRemoving] = useState(false);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All status");
  const filtered = useMemo(() => bins.filter((bin) => (filter === "All status" || bin.status === filter) && `${bin.name} ${formatCoordinates(bin)}`.toLowerCase().includes(query.toLowerCase())), [bins, query, filter]);
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const remove = async (ids, all = false) => {
    if (removing || !window.confirm(all ? "Permanently delete every bin?" : `Remove ${ids.length} selected bin(s)?`)) return;
    setRemoving(true); setActionError("");
    try {
      if (all) await deleteAllBins();
      else {
        const results = await Promise.allSettled(ids.map(deleteBin));
        const failures = results.filter((result) => result.status === "rejected");
        if (failures.length) setActionError(`${failures.length} bin(s) could not be removed: ${failures[0].reason.message}`);
      }
      setSelected([]);
      await refresh();
    } catch (err) { setActionError(err.message); }
    finally { setRemoving(false); }
  };

  return (
    <div className="admin-redesign"><div className="page">
      <header className="page-header">
        <button className="back-button" aria-label="Back to dashboard" onClick={onBack}>←</button>
        <div className="header-grow"><p className="eyebrow">Network inventory</p><h1>Bin management</h1><p className="subtitle">Monitor capacity and manage every connected bin in one place.</p></div>
        <button className="primary-button" onClick={onAdd}><Icon name="plus" /> Add new bin</button>
      </header>
      <RequestState loading={loading} error={actionError || error} onRetry={refresh} />
      <section className="data-card">
        <div className="data-toolbar bin-toolbar">
          <label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search bins" placeholder="Search by name or coordinates..." /></label>
          <select aria-label="Filter by status" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All status</option><option>Healthy</option><option>Filling</option><option>Needs pickup</option><option>Critical</option><option>Collected</option></select>
          <button className="secondary-button" onClick={refresh}>Refresh</button>
          {bins.length > 0 && <button className="danger-button" disabled={removing} onClick={() => remove([], true)}>Delete all</button>}
          {selected.length > 0 && <button className="danger-button" disabled={removing} onClick={() => remove(selected)}>Remove {selected.length} selected</button>}
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th><input type="checkbox" aria-label="Select all" checked={filtered.length > 0 && filtered.every((bin) => selected.includes(bin.id))} onChange={() => setSelected(filtered.every((bin) => selected.includes(bin.id)) ? [] : filtered.map((bin) => bin.id))} /></th><th>Bin location</th><th>Fill level</th><th>Status</th><th>Coordinates</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{filtered.map((bin) => (
              <tr key={bin.id} className={selected.includes(bin.id) ? "selected-row" : ""}>
                <td><input type="checkbox" checked={selected.includes(bin.id)} onChange={() => toggle(bin.id)} aria-label={`Select ${bin.name}`} /></td>
                <td><span className="location-icon"><Icon name="bin" /></span><span className="member-copy"><strong>{bin.name}</strong><small>Collection point</small></span></td>
                <td><div className="fill-cell"><span className="progress-track"><i className={bin.fill >= 75 ? "critical-bar" : bin.fill >= 50 ? "warning-bar" : ""} style={{ width: `${bin.fill}%` }} /></span><strong>{bin.fill}%</strong></div></td>
                <td><span className={`bin-status status-${bin.status.toLowerCase().replace(" ", "-")}`}><i />{bin.status}</span></td>
                <td className="muted mono">{formatCoordinates(bin)}</td>
                <td><button className="delete-button" disabled={removing} onClick={() => remove([bin.id])}>Remove</button></td>
              </tr>
            ))}</tbody>
          </table>
          {!loading && !error && filtered.length === 0 && <div className="empty-state"><h3>No bins found</h3><p>{bins.length ? "Try another search or status filter." : "Add your first bin to start monitoring."}</p></div>}
        </div>
        <div className="table-footer">Showing {filtered.length} of {bins.length} connected bins</div>
      </section>
    </div></div>
  );
}
