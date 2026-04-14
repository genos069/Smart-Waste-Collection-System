import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

function FitBounds({ points, disable }) {
  const map = useMap();
  const hasFit = useRef(false);

  useEffect(() => {
    if (disable) return;
    if (!points || points.length === 0) return;

    map.fitBounds(points, { padding: [50, 50] });
    hasFit.current = true;
  }, [points, disable, map]);

  return null;
}

function LiveFollow({ userLocation }) {
  const map = useMap();
  const hasCentered = useRef(false);

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

  const [followUser] = useState(true);

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

  const binIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
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
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <LiveFollow userLocation={userLocation} />

      <FitBounds points={boundsPoints} disable={followUser && !!userLocation} />


      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
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