import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      className="theme-switch"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
    >
      <span key={theme} className="theme-switch__motion" aria-hidden="true">
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </span>
    </button>
  );
}
