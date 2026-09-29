import { useEffect, useMemo, useState } from "react";
import MapView from "../components/MapView";
import StatusPanel from "../components/StatusPanel";
import { getTasks } from "../services/taskService";
import { updateLocation } from "../services/truckService";
import { updateStatus } from "../services/workflowService";
import { haversineDistance } from "../utils/haversine";
import { getRoute } from "../services/routingService";
import { extractSteps } from "../utils/routing";
import useRemoteData from "../hooks/useRemoteData";

export default function DriverDashboard() {
  const { data: tasks, loading, error, refresh } = useRemoteData(getTasks, 5000);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(() => navigator.geolocation ? "" : "Geolocation is not supported by this browser");
  const [actionError, setActionError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [directions, setDirections] = useState(null);
  const currentTarget = tasks?.nextTarget || null;
  const targetId = currentTarget?.id;
  const targetLat = currentTarget?.lat, targetLng = currentTarget?.lng;
  const distanceToTarget = useMemo(() => currentTarget && userLocation ? haversineDistance(userLocation.lat, userLocation.lng, currentTarget.lat, currentTarget.lng) : null, [currentTarget, userLocation]);

  useEffect(() => {
    let active = true;
    const watcher = navigator.geolocation?.watchPosition(async ({ coords }) => {
      const loc = { lat: coords.latitude, lng: coords.longitude };
      try { await updateLocation(loc); if (active) { setUserLocation(loc); setLocationError(""); } }
      catch (err) { if (active) setLocationError(err.message); }
    }, (err) => { if (active) setLocationError(err.message); }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 });
    return () => { active = false; if (watcher !== undefined) navigator.geolocation.clearWatch(watcher); };
  }, []);

  useEffect(() => {
    if (!userLocation || !targetId) return;
    let active = true;
    getRoute([[userLocation.lat, userLocation.lng], [targetLat, targetLng]]).then((route) => {
      if (active) setDirections(route ? { targetId, geo: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]), steps: extractSteps(route), eta: Math.round(route.duration / 60) } : null);
    }).catch(() => { if (active) setDirections(null); });
    return () => { active = false; };
  }, [userLocation, targetId, targetLat, targetLng]);

  const handleAction = async () => {
    if (!currentTarget || isProcessing) return;
    setIsProcessing(true); setActionError("");
    try {
      if (!navigator.geolocation) throw new Error("Geolocation is not supported");
      const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }));
      const freshLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      await updateLocation(freshLocation);
      setUserLocation(freshLocation);
      await updateStatus({ type: currentTarget.type, id: currentTarget.id });
      await refresh();
    } catch (err) { setActionError(err.message); }
    finally { setIsProcessing(false); }
  };
  const route = directions?.targetId === targetId ? directions : null;
  return <div className="layout">
    <aside className="sidebar">
      {loading && <p role="status">Loading collection tasks…</p>}
      {(error || actionError || locationError) && <p role="alert" className="error">{error || actionError || locationError}</p>}
      {tasks?.setupRequired && <p role="alert">Ask an administrator to configure BMC and dumpyard coordinates.</p>}
      {tasks && <StatusPanel distanceToTarget={distanceToTarget} eta={route?.eta} steps={route?.steps || []} nextStep={route?.steps?.[0]} currentTarget={currentTarget} canPickup={distanceToTarget !== null && distanceToTarget <= 100 && !locationError} isProcessing={isProcessing} onAction={handleAction} />}
    </aside>
    <section className="map-wrap"><MapView tasks={tasks} userLocation={userLocation} routeGeo={route?.geo} /></section>
  </div>;
}
