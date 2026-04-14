import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import { ENV } from "./lib/ENV.js";
import { connectDB } from "./lib/db.js";
import routes from "./routes/allRoutes.js";
import { simulateBinFill } from "./simulation/binFilling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

app.get("/server", (req, res) => {
  res.status(200).json({ msg: "Server is Running" });
});

if (ENV.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../../client/dist");

  app.use(express.static(buildPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    setInterval(simulateBinFill, 5000);
    app.listen(ENV.PORT, () =>
      console.log("Server is running on port:", ENV.PORT),
    );
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};
startServer();
