// Adapt the MongoDB response to the redesigned UI in one place.
export function normalizeBin(bin) {
  const [lng, lat] = bin.coordinates?.coordinates || [];
  const fill = Math.min(100, Math.max(0, Number(bin.fillLevel) || 0));
  const valid = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  return {
    ...bin, id: bin._id, name: bin.name || "Unnamed bin", fill,
    lat: valid ? lat : null, lng: valid ? lng : null,
    status: bin.status === "collected" ? "Collected" : fill >= 90 ? "Critical" : fill >= 75 ? "Needs pickup" : fill >= 50 ? "Filling" : "Healthy",
  };
}
export function formatCoordinates(bin) {
  return bin.lat === null || bin.lng === null ? "Location unavailable" : `${bin.lat.toFixed(4)}, ${bin.lng.toFixed(4)}`;
}
export function formatDate(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Not recorded";
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
export function summarizeBins(bins) {
  return {
    total: bins.length,
    critical: bins.filter((bin) => bin.fill >= 75 && bin.status !== "Collected").length,
    above90: bins.filter((bin) => bin.fill >= 90 && bin.status !== "Collected").length,
    collected: bins.filter((bin) => bin.status === "Collected").length,
    average: bins.length ? Math.round(bins.reduce((sum, bin) => sum + bin.fill, 0) / bins.length) : 0,
  };
}
