import { PICKUP_THRESHOLD } from "../config/collection.js";
export function validPoint(point) {
  return Number.isFinite(point?.lat) && Number.isFinite(point?.lng) && Math.abs(point.lat) <= 90 && Math.abs(point.lng) <= 180;
}
export function distanceMeters(a, b) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(b.lat - a.lat), dLng = radians(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
export function binPickup(bin) {
  const [lng, lat] = bin.coordinates?.coordinates || [];
  if (!validPoint({ lat, lng })) return null;
  return { id: String(bin._id), name: bin.name, lat, lng, fillLevel: bin.fillLevel, status: bin.status === "collected" ? "picked" : "pending", type: "pickup" };
}
export function destination(location) {
  if (!validPoint(location)) return null;
  return { id: location.type === "bmc" ? "home" : "warehouse", locationId: String(location._id), name: location.name, lat: location.lat, lng: location.lng, type: location.type === "bmc" ? "home" : "warehouse" };
}
// Nearest-neighbour order within the eligible (red) queue, not a claim of optimal road routing.
export function orderPickups(pickups, origin) {
  const remaining = [...pickups], ordered = [];
  let current = origin;
  while (remaining.length) {
    remaining.sort((a, b) => validPoint(current) ? distanceMeters(current, a) - distanceMeters(current, b) || a.id.localeCompare(b.id) : b.fillLevel - a.fillLevel || a.id.localeCompare(b.id));
    const next = remaining.shift(); ordered.push(next); current = next;
  }
  return ordered;
}
export function taskState(bins, truck, locations, driver) {
  const home = destination(locations.find((l) => l.type === "bmc"));
  const warehouse = destination(locations.find((l) => l.type === "dumpyard"));
  const planned = new Set((truck?.pickupIds || []).map(String));
  const isActive = truck?.status === "collecting" || truck?.status === "returning";
  const pending = bins.filter((bin) => bin.status !== "collected" && bin.fillLevel >= PICKUP_THRESHOLD && (!isActive || planned.has(String(bin._id)))).map(binPickup).filter(Boolean);
  const carried = bins.filter((bin) => bin.status === "collected" && String(bin.collectedBy) === String(driver) && !bin.dumpedAt);
  const returning = truck?.status === "returning";
  const routeOrder = returning ? [] : orderPickups(pending, truck?.currentLocation || home);
  const setupRequired = !home || !warehouse;
  const warehouseStatus = returning ? "completed" : carried.length && !pending.length ? "available" : "locked";
  const homeState = home ? { ...home, status: returning ? "available" : "locked" } : null;
  const warehouseState = warehouse ? { ...warehouse, status: warehouseStatus } : null;
  return {
    home: homeState, warehouse: warehouseState,
    pickups: [...routeOrder, ...carried.map(binPickup).filter(Boolean)], routeOrder,
    nextTarget: setupRequired ? null : returning ? homeState : routeOrder[0] || (warehouseStatus === "available" ? warehouseState : null),
    liveLocation: validPoint(truck?.currentLocation) ? truck.currentLocation : null,
    deliveryComplete: returning, setupRequired,
    cargoCount: carried.length, tripStatus: truck?.status || "idle",
  };
}
