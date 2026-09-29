import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

function FitBounds({ points, disable }) {
  const map = useMap();

  useEffect(() => {
    if (disable) return;
    if (!points || points.length === 0) return;

    map.fitBounds(points, { padding: [50, 50] });
  }, [points, disable, map]);

  return null;
}

function LiveFollow({ userLocation }) {
  const map = useMap();
  const hasCentered = useRef(false);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  useEffect(() => {
    if (!userLocation) return;

    const { lat, lng } = userLocation;

    // FIRST TIME: hard zoom + center
    if (!hasCentered.current) {
      map.setView([lat, lng], 18, {
        animate: true,
      });
      hasCentered.current = true;
      return;
    }

    // NEXT UPDATES: smooth follow
    map.panTo([lat, lng], {
      animate: true,
    });
  }, [userLocation, map]);

  return null;
}

export default function MapView({ tasks, userLocation, routeGeo }) {

  const boundsPoints = [];

  const userIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [32, 32],
  });

  const pickupIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
  });

  const warehouseIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
  });

  if (userLocation) boundsPoints.push([userLocation.lat, userLocation.lng]);
  tasks?.pickups?.forEach(p => boundsPoints.push([p.lat, p.lng]));
  if (tasks?.warehouse) boundsPoints.push([tasks.warehouse.lat, tasks.warehouse.lng]);

  return (

    <MapContainer
      center={[19.314882638974783, 84.794008015073]}
      zoom={15}
      className="map"
    >
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <LiveFollow userLocation={userLocation} />

      <FitBounds points={boundsPoints} disable={!!userLocation} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {tasks?.pickups?.map(p => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pickupIcon}
        >
          <Popup>{p.name} ({p.status})</Popup>
        </Marker>
      ))}

      {tasks?.warehouse && (
        <Marker position={[tasks.warehouse.lat, tasks.warehouse.lng]} icon={warehouseIcon}>
          <Popup>Warehouse</Popup>
        </Marker>
      )}

      {routeGeo && (
        <Polyline positions={routeGeo} pathOptions={{ color: "blue" }} />
      )}
    </MapContainer>
  );
}