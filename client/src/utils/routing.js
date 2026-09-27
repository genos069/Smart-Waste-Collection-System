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
