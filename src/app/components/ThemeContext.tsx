import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Mode = "light" | "dark";

const ThemeCtx = createContext<{ mode: Mode; toggle: () => void }>({
  mode: "light",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeCtx);

const darkVars: Record<string, string> = {
  "--bg": "#1a1210",       // warm charcoal, tidak hitam murni
  "--surface": "#231815",  // surface sedikit lebih terang
  "--accent": "#c0392b",   // merah vivid agar pop
  "--text1": "#f0ebe8",    // putih warm, tidak cold white
  "--text2": "#9e8e8a",    // abu warm tone
  "--nav": "#150e0c",      // nav sedikit lebih gelap dari bg
  "--btn-text": "#ffffff",
  "--overlay": "rgba(15,8,7,0.88)",
};

const lightVars: Record<string, string> = {
  "--bg": "#f5f5f5",
  "--surface": "#ffffff",
  "--accent": "#8b0000",
  "--text1": "#1a1a1a",
  "--text2": "#666666",
  "--nav": "#ffffff",
  "--btn-text": "#ffffff",
  "--overlay": "rgba(255,255,255,0.85)",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const vars = mode === "dark" ? darkVars : lightVars;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty("--transition-colors", "background 0.4s, color 0.4s, border-color 0.4s, box-shadow 0.4s");
  }, [mode]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return <ThemeCtx.Provider value={{ mode, toggle }}>{children}</ThemeCtx.Provider>;
}
