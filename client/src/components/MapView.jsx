import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    map.fitBounds(points, { padding: [50, 50] });
  }, [points]);

  return null;
}

export default function MapView({ tasks, userLocation, routeGeo }) {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [20.296, 85.824];

  const boundsPoints = [];

  if (userLocation) boundsPoints.push([userLocation.lat, userLocation.lng]);
  tasks?.pickups?.forEach(p => boundsPoints.push([p.lat, p.lng]));
  if (tasks?.warehouse) boundsPoints.push([tasks.warehouse.lat, tasks.warehouse.lng]);

  return (
    <MapContainer center={center} zoom={16} className="map">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FitBounds points={boundsPoints} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {tasks?.pickups?.map(p => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup>{p.name} ({p.status})</Popup>
        </Marker>
      ))}

      {tasks?.warehouse && (
        <Marker position={[tasks.warehouse.lat, tasks.warehouse.lng]}>
          <Popup>Warehouse</Popup>
        </Marker>
      )}

      {routeGeo && (
        <Polyline positions={routeGeo} pathOptions={{ color: "blue" }} />
      )}
    </MapContainer>
  );
}