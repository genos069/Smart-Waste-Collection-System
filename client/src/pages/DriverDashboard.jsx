import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import StatusPanel from "../components/StatusPanel";
import { apiGet, apiPost } from "../services/api";
import { haversineDistance } from "../utils/haversine";
import { getRoute, extractSteps } from "../utils/routing";

const PROXIMITY_LIMIT_METERS = 50000;

export default function DriverDashboard() {
  const [tasks, setTasks] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [currentTarget, setCurrentTarget] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [canPickup, setCanPickup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [routeGeo, setRouteGeo] = useState(null);
  const [steps, setSteps] = useState([]);
  const [eta, setEta] = useState(null);

  const loadTasks = async () => {
    const data = await apiGet("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
    const t = setInterval(loadTasks, 5000);
    return () => clearInterval(t);
  }, []);


  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(loc);
        await apiPost("/location", loc);
      },
      console.error,
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  useEffect(() => {
    if (!tasks || !userLocation) return;

    let next = null;
    const pending = tasks.pickups.filter(p => p.status === "pending");

    if (pending.length > 0) {
      let nearest = pending[0];
      let minDist = Infinity;

      pending.forEach(p => {
        const d = haversineDistance(
          userLocation.lat,
          userLocation.lng,
          p.lat,
          p.lng
        );

        if (d < minDist) {
          minDist = d;
          nearest = p;
        }
      });

      next = nearest;
    } else if (
      tasks.pickups.every(p => p.status === "picked") &&
      tasks.warehouse.status !== "completed"
    ) {
      next = tasks.warehouse;
    }

    setCurrentTarget(next);

    if (next) {
      const dist = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        next.lat,
        next.lng
      );

      setDistanceToTarget(dist);
      setCanPickup(dist <= PROXIMITY_LIMIT_METERS);
    } else {
      setDistanceToTarget(null);
      setCanPickup(false);
    }
  }, [tasks, userLocation]);

  useEffect(() => {
    if (!userLocation || !currentTarget) return;

    const points = [
      [userLocation.lat, userLocation.lng],
      [currentTarget.lat, currentTarget.lng]
    ];

    getRoute(points).then(route => {
      if (!route) return;

      setRouteGeo(route.geometry.coordinates.map(c => [c[1], c[0]]));
      setSteps(extractSteps(route));
      setEta(Math.round(route.duration / 60));
    });
  }, [userLocation, currentTarget]);

  const handleAction = async () => {
    if (!currentTarget) return;

    setIsProcessing(true);
    setCanPickup(false);

    const type =
      currentTarget.id === "warehouse" ? "warehouse" : "pickup";

    await apiPost("/update-status", {
      type,
      id: currentTarget.id
    });

    setCurrentTarget(null);
    setDistanceToTarget(null);

    setTimeout(loadTasks, 300);
    setIsProcessing(false);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <StatusPanel
          distanceToTarget={distanceToTarget}
          eta={eta}
          steps={steps}
          nextStep={steps[0]}
          currentTarget={currentTarget}
          canPickup={canPickup}
          isProcessing={isProcessing}
          onAction={handleAction}
        />
      </aside>

      <section className="map-wrap">
        <MapView
          tasks={tasks}
          userLocation={userLocation}
          routeGeo={routeGeo}
        />
      </section>
    </div>
  );
}