import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeBin, summarizeBins, formatCoordinates } from "../src/utils/adminData.js";

test("maps MongoDB GeoJSON and fill thresholds to the redesign", () => {
  const base = { _id: "bin-id", name: "Market", coordinates: { coordinates: [84.87, 19.35] } };
  for (const [fillLevel, status] of [[0, "Healthy"], [49, "Healthy"], [50, "Filling"], [74, "Filling"], [75, "Needs pickup"], [90, "Critical"], [100, "Critical"]]) {
    const bin = normalizeBin({ ...base, fillLevel });
    assert.equal(bin.status, status);
    assert.equal(bin.id, "bin-id");
    assert.equal(bin.lat, 19.35);
    assert.equal(bin.lng, 84.87);
  }
});
test("empty, missing, and out-of-range data do not crash or show NaN", () => {
  assert.deepEqual(summarizeBins([]), { total: 0, critical: 0, above90: 0, collected: 0, average: 0 });
  assert.equal(formatCoordinates(normalizeBin({})), "Location unavailable");
  assert.equal(normalizeBin({ fillLevel: 200 }).fill, 100);
  assert.equal(normalizeBin({ fillLevel: -10 }).fill, 0);
  assert.equal(normalizeBin({ coordinates: { coordinates: [200, 100] } }).lat, null);
  assert.equal(formatCoordinates(normalizeBin({ coordinates: { coordinates: [0, 0] } })), "0.0000, 0.0000");
});
test("summary uses saved values and excludes collected bins from the queue", () => {
  const bins = [{ fillLevel: 75 }, { fillLevel: 90 }, { fillLevel: 0, status: "collected" }].map(normalizeBin);
  assert.deepEqual(summarizeBins(bins), { total: 3, critical: 2, above90: 1, collected: 1, average: 55 });
});
