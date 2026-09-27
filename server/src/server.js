import app from "./app.js";
import { ENV } from "./lib/ENV.js";
import { connectDB } from "./lib/db.js";
import { simulateBinFill } from "./simulation/binFilling.js";

const startServer = async () => {
  try {
    await connectDB();
    setInterval(simulateBinFill, 30000);
    app.listen(ENV.PORT, () =>
      console.log("Server is running on port:", ENV.PORT),
    );
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};
startServer();
