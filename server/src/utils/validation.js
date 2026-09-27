export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function text(value, field, max = 120) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new HttpError(400, `${field} is required and must be at most ${max} characters`);
  return value.trim();
}
export function email(value) {
  const result = text(value, "Email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new HttpError(400, "A valid email is required");
  return result;
}
export function password(value) {
  if (typeof value !== "string" || value.length < 8 || Buffer.byteLength(value, "utf8") > 72) throw new HttpError(400, "Password must be at least 8 characters and at most 72 UTF-8 bytes");
  return value;
}
export function coordinates(lat, lng) {
  const number = (value) => typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  const result = { lat: number(lat), lng: number(lng) };
  if (!Number.isFinite(result.lat) || !Number.isFinite(result.lng) || Math.abs(result.lat) > 90 || Math.abs(result.lng) > 180) throw new HttpError(400, "Valid latitude (-90 to 90) and longitude (-180 to 180) are required");
  return result;
}
export function objectId(value) {
  if (typeof value !== "string" || !/^[a-f0-9]{24}$/i.test(value)) throw new HttpError(400, "Invalid ID");
  return value;
}
export function role(value) {
  if (!["admin", "driver"].includes(value)) throw new HttpError(400, "Role must be admin or driver");
  return value;
}
export function batch(value) {
  if (!Array.isArray(value) || !value.length || value.length > 100) throw new HttpError(400, "Expected between 1 and 100 records");
  return value;
}
