import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/server', (req, res) => {
    res.status(200).json({ msg: "Server is Running" })
})

if (process.env.NODE_ENV === 'production') {

    const buildPath = path.join(__dirname, '../../client/dist');

    app.use(express.static(buildPath));

    app.get('/{*any}', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

const startServer = () => {
  try {
    app.listen(PORT, () => console.log("Server is running on port:", PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();

