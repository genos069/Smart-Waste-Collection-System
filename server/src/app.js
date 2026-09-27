import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
app.disable("x-powered-by");
if (env.trustProxyHops) app.set("trust proxy", env.trustProxyHops);
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
// Cookie-authenticated cross-site writes must come from the configured frontend.
app.use("/api", (req, res, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.headers.origin && req.headers.origin !== env.clientUrl) return res.status(403).json({ message: "Untrusted request origin" });
  next();
});
app.use("/api", routes);
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found" }));
app.use(errorHandler);
export default app;
