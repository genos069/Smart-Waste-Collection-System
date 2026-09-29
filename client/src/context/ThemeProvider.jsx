import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const storageKey = "smart-waste-theme";
function readPreference() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === "dark" || saved === "light" ? saved : "system";
  } catch { return "system"; }
}
export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const theme = preference === "system" ? (systemDark ? "dark" : "light") : preference;
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => setSystemDark(event.matches);
    const onStorage = (event) => { if (event.key === storageKey || event.key === null) setPreference(readPreference()); };
    query.addEventListener("change", onChange);
    window.addEventListener("storage", onStorage);
    return () => { query.removeEventListener("change", onChange); window.removeEventListener("storage", onStorage); };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const value = useMemo(() => ({
    theme,
    toggleTheme() {
      const next = theme === "dark" ? "light" : "dark";
      setPreference(next);
      try { localStorage.setItem(storageKey, next); } catch { /* Theme still works when storage is unavailable. */ }
    },
  }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
