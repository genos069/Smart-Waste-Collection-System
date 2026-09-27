import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/ENV.js";
import routes from "./routes/index.js";

const app = express();
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found" }));
// Express 5 forwards rejected async handlers here as well.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.status === 400 ? "Invalid request body" : "Server error" });
});
export default app;
