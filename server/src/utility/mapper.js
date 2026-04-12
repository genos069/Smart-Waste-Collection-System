export const normalizeBins = (bins) => {
  return bins
    .filter((bin) => bin.coordinates?.coordinates?.length === 2)
    .map((bin) => ({
      id: bin._id,
      name: bin.name,
      lat: bin.coordinates.coordinates[1],
      lng: bin.coordinates.coordinates[0],
      fillLevel: bin.fillLevel,
      status: bin.status,
    }));
};

export const mapBinsToPickups = (bins = []) => {
  return bins
    .filter(
      (bin) =>
        bin?.fillLevel >= 70 &&
        typeof bin.lat === "number" &&
        typeof bin.lng === "number",
    )
    .map((bin) => ({
      id: bin.id,
      name: bin.name,
      lat: bin.lat,
      lng: bin.lng,
      status: "pending",
    }));
};
