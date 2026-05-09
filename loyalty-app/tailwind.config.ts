import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#20251d",
        paper: "#fbf8ef",
        matcha: "#6f8f45",
        moss: "#3f5732",
        oat: "#e7dcc7",
        steam: "#f5efe3",
        persimmon: "#c96d3a"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(43, 54, 34, 0.12)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-serif", "Georgia"]
      }
    }
  },
  plugins: []
};

export default config;
