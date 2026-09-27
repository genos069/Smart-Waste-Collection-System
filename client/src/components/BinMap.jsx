import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from "react-leaflet";
import { formatCoordinates } from "../utils/adminData";

const DEFAULT_CENTER = [19.35767343338887, 84.87177676956604];
function MapEvents({ onSelect, focus }) {
  const map = useMap();
  useMapEvents({ click(event) { onSelect?.({ lat: event.latlng.lat, lng: event.latlng.lng }); } });
  useEffect(() => {
    if (focus && Number.isFinite(focus.lat) && Number.isFinite(focus.lng)) {
      map.flyTo([focus.lat, focus.lng], 16, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    }
  }, [focus, map]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}
export default function BinMap({ bins = [], selectedCoords, setSelectedCoords, focus }) {
  const located = bins.filter((bin) => Number.isFinite(bin.lat) && Number.isFinite(bin.lng));
  const center = located.length ? [located[0].lat, located[0].lng] : DEFAULT_CENTER;
  return <MapContainer center={center} zoom={13} className="bin-network-map" scrollWheelZoom={false}>
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <MapEvents onSelect={setSelectedCoords} focus={focus} />
    {located.map((bin) => {
      const color = bin.fill >= 75 ? "#d6534c" : bin.fill >= 50 ? "#dc921f" : "#157a4f";
      return <CircleMarker key={bin.id} center={[bin.lat, bin.lng]} radius={7 + bin.fill / 12} pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}>
        <Popup><strong>{bin.name}</strong><br />{bin.fill}% full · {bin.status}<br />{formatCoordinates(bin)}</Popup>
      </CircleMarker>;
    })}
    {selectedCoords && <CircleMarker center={[selectedCoords.lat, selectedCoords.lng]} radius={10} pathOptions={{ color: "#2563eb", fillOpacity: 0.7 }}><Popup>New bin location</Popup></CircleMarker>}
  </MapContainer>;
}
