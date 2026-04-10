import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from './ThemeContext';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';

export function GithubContributions() {
  const { mode } = useTheme();

  // react-github-calendar v5 expects ThemeInput: { dark: string[], light: string[] }
  const calendarTheme = {
    dark: ['#0d1117', '#0e2d1e', '#006d32', '#26a641', '#39d353'],
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  };

  const darkColors = ['#0d1117', '#0e2d1e', '#006d32', '#26a641', '#39d353'];
  const lightColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  const legendColors = mode === 'dark' ? darkColors : lightColors;

  return (
    <motion.div
      className="flex flex-col items-center mb-10 px-4 w-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Github size={18} style={{ color: "var(--accent)" }} />
        </div>
        <h3
          style={{
            color: "var(--text1)",
            fontSize: 20,
            fontWeight: 600,
            transition: "color 0.4s",
          }}
        >
          GitHub Contributions
        </h3>
      </div>

      {/* Calendar Card */}
      <div
        className="w-full max-w-5xl rounded-2xl overflow-hidden"
        style={{
          background: mode === "dark"
            ? "linear-gradient(145deg, #111111 0%, #161b22 100%)"
            : "linear-gradient(145deg, #ffffff 0%, #f6f8fa 100%)",
          border: mode === "dark"
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(0,0,0,0.08)",
          boxShadow: mode === "dark"
            ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 8px 40px rgba(0,0,0,0.07)",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
        }}
      >
        {/* Card top bar */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: mode === "dark"
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(0,0,0,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: "var(--text2)",
              fontFamily: "monospace",
            }}
          >
            github.com / Destaanugra1
          </span>
        </div>

        {/* Calendar area */}
        <div
          className="overflow-x-auto flex justify-center"
          style={{ padding: "24px 20px 28px" }}
        >
          <GitHubCalendar
            username="Destaanugra1"
            colorScheme={mode}
            theme={calendarTheme}
            style={{
              color: mode === "dark" ? "#8b949e" : "#57606a",
            }}
            blockRadius={3}
            blockSize={13}
            fontSize={12}
          />
        </div>

        {/* Legend row */}
        <div
          style={{
            padding: "12px 20px 16px",
            borderTop: mode === "dark"
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(0,0,0,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--text2)" }}>Less</span>
          {legendColors.map((c, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: c,
                border: mode === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)",
              }}
            />
          ))}
          <span style={{ fontSize: 11, color: "var(--text2)" }}>More</span>
        </div>
      </div>
    </motion.div>
  );
}
