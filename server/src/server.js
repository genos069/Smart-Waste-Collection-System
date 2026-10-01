import mongoose from "mongoose";
import app from "./app.js";
import { env, validateEnv } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { startBinSimulator } from "./jobs/binFillSimulator.js";
import Location from "./models/Location.js";

let server, stopSimulation = () => {};
async function shutdown() {
  stopSimulation();
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
}
try {
  validateEnv();
  await connectDatabase();

  const bmc = await Location.findOneAndUpdate(
    { type: "bmc" },
    {
      name: "BMC",
      type: "bmc",
      lat: 19.35503498642438,
      lng: 84.8749107773317,
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  const dumpyard = await Location.findOneAndUpdate(
    { type: "dumpyard" },
    {
      name: "Dumpyard",
      type: "dumpyard",
      lat: 19.359399007257537,
      lng: 84.87256406382211,
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );
  
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
