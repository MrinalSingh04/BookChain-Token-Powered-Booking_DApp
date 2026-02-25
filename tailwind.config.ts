import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        acid: "#c8ff00",
        "acid-dim": "#9fbf00",
        slate: {
          950: "#0a0d14",
          900: "#0f1420",
          800: "#151c2e",
          700: "#1e2840",
        },
        neon: {
          green: "#c8ff00",
          blue: "#00d4ff",
          pink: "#ff2d78",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-in": "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #c8ff0033, 0 0 10px #c8ff0022" },
          "100%": { boxShadow: "0 0 20px #c8ff0066, 0 0 40px #c8ff0044" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
