export async function getRoute(points) {
  if (!points || points.length < 2) return null;

  const coords = points.map(p => `${p[1]},${p[0]}`).join(";");

  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes || data.routes.length === 0) return null;

  return data.routes[0];
}

export function extractSteps(route) {
  if (!route || !route.legs) return [];

  let steps = [];

  route.legs.forEach(leg => {
    leg.steps.forEach(step => {
      steps.push({
        instruction: step.maneuver.instruction,
        distance: step.distance,
        location: step.maneuver.location
      });
    });
  });

  return steps;
}