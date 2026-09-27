import { test, before, after, mock } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import Admin from "../src/models/Admin.js";
import Bin from "../src/models/Bin.js";
import Truck from "../src/models/Truck.js";
import Location from "../src/models/Location.js";
let server, base;
const originalSecret = process.env.JWT_SECRET;
before(async () => {
  process.env.JWT_SECRET = "route-test-only";
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(() => {
  server.close();
  mock.restoreAll();
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});
const call = (path, method = "GET", body, headers = {}) => fetch(base + path, {
  method, headers: { "Content-Type": "application/json", ...headers },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});
test("health, unknown routes and malformed JSON return JSON responses", async () => {
  assert.equal((await call("/health")).status, 200);
  const missing = await call("/missing");
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).message, "API route not found");
  const bad = await fetch(base + "/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  assert.equal(bad.status, 400);
  assert.equal((await bad.json()).message, "Invalid request body");
});
test("all previously protected routes still reject unauthenticated callers", async () => {
  for (const [method, path] of [["GET", "/me"], ["GET", "/allBins"], ["GET", "/allAdmins"], ["GET", "/adminsById/123"], ["DELETE", "/deleteBin/123"], ["DELETE", "/deleteAllBins"], ["DELETE", "/deleteAdmin/123"], ["PUT", "/updateAdmin/123"], ["POST", "/createAdmins"]]) {
    assert.equal((await call(path, method)).status, 401, path);
  }
});
test("auth handlers, cookie clearing and role protection remain wired", async () => {
  mock.method(Admin, "findOne", async () => null);
  assert.equal((await call("/login", "POST", { email: "missing", password: "test" })).status, 400);
  assert.equal((await call("/forgot-password", "POST", { email: "missing" })).status, 404);
  assert.equal((await call("/reset-password", "POST", { token: "bad", newPassword: "test" })).status, 400);
  const logout = await call("/logout", "POST");
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get("set-cookie"), /token=;/);
  mock.method(Admin, "findById", () => ({ select: async () => ({ _id: "driver", firstName: "Test", type: "driver" }) }));
  const headers = { Cookie: `token=${jwt.sign({ id: "driver" }, process.env.JWT_SECRET)}` };
  assert.equal((await call("/allAdmins", "GET", undefined, headers)).status, 403);
  assert.deepEqual(await (await call("/me", "GET", undefined, headers)).json(), { user: { id: "driver", name: "Test", type: "driver" } });
});
test("bin, task, truck, location and workflow modules dispatch correctly", async () => {
  mock.method(Bin, "find", async () => []);
  mock.method(Truck, "findOne", async () => null);
  mock.method(Location, "find", async () => []);
  mock.method(Bin, "insertMany", async (rows) => rows);
  mock.method(Location, "insertMany", async (rows) => rows);
  mock.method(Bin, "findById", async () => null);
  mock.method(Truck, "create", async (row) => row);
  assert.equal((await call("/tasks")).status, 200);
  assert.equal((await call("/pickups", "POST", {})).status, 400);
  assert.equal((await call("/collect-bin", "POST", { id: "missing" })).status, 404);
  assert.equal((await call("/seed/bins", "POST", [])).status, 200);
  assert.equal((await call("/seed/locations", "POST", [])).status, 200);
  assert.equal((await call("/location", "POST", { lat: 0, lng: 0 })).status, 200);
  assert.equal((await call("/update-status", "POST", {})).status, 400);
  assert.equal((await call("/update-status", "POST", { type: "unknown" })).status, 400);
});
