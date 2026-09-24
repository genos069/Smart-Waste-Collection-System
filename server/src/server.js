import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/ENV.js";
import { connectDB } from "./lib/db.js";
import routes from "./routes/allRoutes.js";
import { simulateBinFill } from "./simulation/binFilling.js";

const app = express();

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ msg: "Server is Running" });
});

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
