import mongoose from "mongoose";
import app from "./app.js";
import { env, validateEnv } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { startBinSimulator } from "./jobs/binFillSimulator.js";

let server, stopSimulation = () => {};
async function shutdown() {
  stopSimulation();
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
}
try {
  validateEnv();
  await connectDatabase();
  // Fail startup if uniqueness indexes cannot be created on existing data.
  await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
  server = app.listen(env.port, () => console.log(`Server listening on port ${env.port}`));
  server.on("error", async (err) => { console.error("HTTP startup failed:", err.message); await shutdown(); process.exitCode = 1; });
  if (env.simulateBins) stopSimulation = startBinSimulator();
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
} catch (err) {
  console.error("Startup failed:", err.message);
  await shutdown();
  process.exitCode = 1;
}
