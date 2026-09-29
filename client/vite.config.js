import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const apiUrl = process.env.VITE_API_URL || env.VITE_API_URL;
  if (command === "build") {
    let url;
    try { url = new URL(apiUrl); } catch { throw new Error("Set VITE_API_URL to the deployed HTTPS backend URL before building."); }
    if (url.protocol !== "https:") throw new Error("Production VITE_API_URL must use HTTPS.");
    if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) throw new Error("Production VITE_API_URL must point to your deployed backend, not localhost.");
  }
  return { plugins: [react(), tailwindcss()] };
});
