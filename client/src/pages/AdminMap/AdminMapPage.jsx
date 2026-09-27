import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BinMap from "../../components/BinMap";
import Icon from "../../components/admin/Icon";
import RequestState from "../../components/admin/RequestState";
import { createBin, getBins } from "../../services/binService";
import useRemoteData from "../../hooks/useRemoteData";
import { normalizeBin } from "../../utils/adminData";

export default function AdminMapPage() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin-dashboard");
  const { data, loading, error, refresh } = useRemoteData(getBins);
  const bins = useMemo(() => (data?.data || []).map(normalizeBin), [data]);
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const lat = Number(coords.lat);
  const lng = Number(coords.lng);
  const valid = coords.lat !== "" && coords.lng !== "" && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  const selectedCoords = valid ? { lat, lng } : null;
  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    if (!name.trim() || !valid) { setSubmitError("Enter a bin name and valid latitude and longitude."); return; }
    setSaving(true); setSubmitError("");
    try { await createBin({ name: name.trim(), lat, lng }); navigate("/all-bins"); }
    catch (err) { setSubmitError(err.message); }
    finally { setSaving(false); }
  };

  return <div className="admin-redesign"><div className="map-page">
    <header className="compact-header">
      <button className="back-button" aria-label="Back to dashboard" onClick={onBack}>←</button>
      <div><p className="eyebrow">Network inventory</p><h1>Add a smart bin</h1></div>
      {valid && <span className="coordinate-pill"><i />{lat.toFixed(5)}, {lng.toFixed(5)}</span>}
    </header>
    <div className="map-workspace">
      <div className="picker-map">
        {!loading && <BinMap bins={bins} selectedCoords={selectedCoords} setSelectedCoords={setCoords} />}
        <div className="map-instruction"><span className="soft-icon green"><Icon name="map" /></span><span><strong>Choose a location</strong><small>Click the map or enter coordinates in the form</small></span></div>
      </div>
      <aside className="map-form-panel">
        <span className="step">01</span><h2>Bin details</h2>
        <p className="subtitle">Give this collection point a clear name and select its location.</p>
        <RequestState loading={loading} error={error} onRetry={refresh} />
        <form onSubmit={submit}>
          <label>Location name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. BMC Market Street" /></label>
          <label>Latitude<input required type="number" step="any" min="-90" max="90" value={coords.lat} onChange={(event) => setCoords({ ...coords, lat: event.target.value })} placeholder="e.g. 19.35767" /></label>
          <label>Longitude<input required type="number" step="any" min="-180" max="180" value={coords.lng} onChange={(event) => setCoords({ ...coords, lng: event.target.value })} placeholder="e.g. 84.87178" /></label>
          <div className="setup-note"><Icon name="leaf" /><p><strong>Ready to monitor</strong><span>This bin will appear on your dashboard and in the collection network after saving.</span></p></div>
          {submitError && <p className="request-message error-message" role="alert">{submitError}</p>}
          <button className="primary-button full-button" disabled={saving}><Icon name="plus" />{saving ? "Saving…" : "Add bin to network"}</button>
          <button type="button" className="secondary-button full-button" onClick={onBack}>Cancel</button>
        </form>
      </aside>
    </div>
  </div></div>;
}
