export const formatLocation = (loc) => {
  if (!loc?.coordinates?.coordinates?.length) return null;

  return {
    id: loc._id,
    name: loc.name,
    lat: loc.coordinates.coordinates[1],
    lng: loc.coordinates.coordinates[0],
    status: loc.type
  };
}