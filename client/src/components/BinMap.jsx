import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [19.35767343338887, 84.87177676956604];

function getColor(status) {
  switch (status) {
    case "red": return "red";
    case "orange": return "orange";
    case "green": return "green";
    default: return "gray";
  }
}

export default function BinMap({ setSelectedCoords = () => { } }) {

  const [bins, setBins] = useState([]);
  const [liveLocation, setLiveLocation] = useState(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setSelectedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setLiveLocation({
          lat: latitude,
          lng: longitude,
        });
      },
      (err) => {
        console.error("Location error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="w-full h-screen">
      <MapContainer center={DEFAULT_CENTER} zoom={13} className="w-full h-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {liveLocation && (
          <CircleMarker
            center={[liveLocation.lat, liveLocation.lng]}
            radius={8}
            color="blue"
            fillColor="blue"
            fillOpacity={0.7}
          >
            <Popup>
              📍 You are here
              <br />
              [{liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}]
            </Popup>
          </CircleMarker>
        )}
        <MapClickHandler />

        {bins.map((b) => {
          if (!b.coordinates?.coordinates?.length) return null;
          const [lng, lat] = b.coordinates.coordinates;

          return (
            <CircleMarker
              key={b._id + b.status + b.currentFill} // force re-render on updates
              center={[lat, lng]}
              radius={5 + fillPercent * 15} // bigger circle = more full
              color={getColor(b.status)}
              fillColor={getColor(b.status)}
              fillOpacity={0.5}
            >
              <Popup>
                <b>{b.name}</b>
                <br />
                Status:{" "}
                <span style={{ color: getColor(b.status), fontWeight: 600 }}>
                  {b.status}
                </span>
                <br />
                Coordinates: [{lat.toFixed(4)}, {lng.toFixed(4)}]
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
