import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "matcha-deep": "var(--matcha-deep)",
        forest: "var(--forest)",
        sage: "var(--sage)",
        "sage-tint": "var(--sage-tint)",
        "sage-wash": "var(--sage-wash)",
        stone: "var(--stone)",
        cream: "var(--cream)",
        charcoal: "var(--charcoal)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        milk: "var(--milk)",
        ceramic: "var(--ceramic)",
        rice: "var(--rice)",
        "warn-fill": "var(--warn-fill)",
        "error-border": "var(--error-border)",
        "error-text": "var(--error-text)"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"]
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "999px"
      },
      boxShadow: {
        sm: "0 1px 2px rgba(43,43,43,0.04), 0 1px 1px rgba(43,43,43,0.03)",
        md: "0 4px 12px rgba(43,43,43,0.06), 0 2px 4px rgba(43,43,43,0.04)",
        lg: "0 16px 32px rgba(43,43,43,0.08), 0 4px 8px rgba(43,43,43,0.04)",
        glass: "var(--glass-shadow)",
        "glass-strong": "var(--glass-shadow-strong)",
        focus: "0 0 0 3px var(--sage-wash)"
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 0.61, 0.36, 1)",
        "in-out-soft": "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "240ms"
      },
      letterSpacing: {
        eyebrow: "0.16em",
        display: "0"
      },
      minHeight: {
        tap: "44px"
      },
      minWidth: {
        tap: "44px"
      }
    }
  },
  plugins: []
};

export default config;
