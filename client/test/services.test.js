import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { normalizeApiBase, request } from "../src/services/api.js";
import { deleteBin } from "../src/services/binService.js";
import { login } from "../src/services/authService.js";
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

test("API base accepts origin, /api and trailing slashes", () => {
  for (const value of [undefined, "", "http://localhost:4000", "http://localhost:4000/", "http://localhost:4000/api/"]) {
    assert.equal(normalizeApiBase(value), "http://localhost:4000/api");
  }
  assert.equal(normalizeApiBase("https://example.com/api"), "https://example.com/api");
});
test("bin deletion includes authentication cookies and encoded IDs", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:4000/api/deleteBin/a%2Fb");
    assert.equal(options.method, "DELETE");
    assert.equal(options.credentials, "include");
    return Response.json({ success: true });
  };
  assert.deepEqual(await deleteBin("a/b"), { success: true });
});
test("login sends JSON and returns parsed user data", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:4000/api/login");
    assert.equal(options.headers["Content-Type"], "application/json");
    assert.equal(options.credentials, "include");
    assert.deepEqual(JSON.parse(options.body), { email: "test@example.com", password: "example" });
    return Response.json({ user: { type: "admin" } });
  };
  assert.deepEqual(await login({ email: "test@example.com", password: "example" }), { user: { type: "admin" } });
});
test("request surfaces message, error and non-JSON HTTP failures", async () => {
  for (const [response, message] of [[Response.json({ message: "Admins only" }, { status: 403 }), "Admins only"], [Response.json({ error: "Bin not found" }, { status: 404 }), "Bin not found"], [new Response("Bad gateway", { status: 502 }), "Request failed (502)"]]) {
    globalThis.fetch = async () => response;
    await assert.rejects(request("/test"), (error) => error.message === message && error.status === response.status);
  }
});

test("a successful HTML fallback is rejected instead of masquerading as empty API data", async () => {
  globalThis.fetch = async () => new Response("<!doctype html><html></html>");
  await assert.rejects(request("/allBins"), /invalid response/);
});
test("network failures and timeouts have actionable messages", async () => {
  globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
  await assert.rejects(request("/login"), /Could not reach the server/);
  globalThis.fetch = async () => { throw new DOMException("Timeout", "TimeoutError"); };
  await assert.rejects(request("/login"), /took too long/);
});
test("requests have a timeout and preserve an explicit cancellation signal", async () => {
  const controller = new AbortController();
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.signal, controller.signal);
    return new Response(null, { status: 204 });
  };
  assert.equal(await request("/test", { signal: controller.signal }), null);
});
