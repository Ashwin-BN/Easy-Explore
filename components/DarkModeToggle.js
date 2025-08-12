import { useTheme } from "../context/ThemeContext";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid var(--border-color)",
        background: "var(--card-bg)",
        color: "var(--text-color)",
        cursor: "pointer"
      }}
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
