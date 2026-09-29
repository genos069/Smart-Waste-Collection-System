export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  let message = err.message;
  if (err.code === 11000) { status = 409; message = "A record with these unique details already exists"; }
  else if (["ValidationError", "CastError", "StrictModeError"].includes(err.name)) { status = 400; message = "Invalid request data"; }
  else if (err.type === "entity.parse.failed") { status = 400; message = "Invalid JSON request body"; }
  if (status >= 500) { console.error("API error:", err.name, err.code || ""); message = "Server error. Please try again later."; }
  res.status(status).json({ success: false, message });
}
