import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button type="button" className="theme-switch" onClick={toggleTheme}
    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-pressed={theme === "dark"}>
    {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
  </button>;
}
