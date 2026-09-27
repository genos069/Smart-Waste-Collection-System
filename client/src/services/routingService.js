export async function getRoute(points) {
  if (!points || points.length < 2) return null;

  const coords = points.map(p => `${p[1]},${p[0]}`).join(";");

  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not load driving route");
  const data = await res.json();

  if (!data.routes || data.routes.length === 0) return null;

  return data.routes[0];
}

