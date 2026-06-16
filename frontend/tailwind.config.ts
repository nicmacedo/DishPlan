import { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dish: {
          // Primário — Verde Floresta
          50: "#f0f9f7",
          100: "#d9f0ec",
          200: "#b3e1d9",
          300: "#7ecac0",
          400: "#4faaa0",
          500: "#2e8c82",
          600: "#1f6e66",
          primary: "#184642", // Verde original
          700: "#154037",
          800: "#103029",
          900: "#0a1e1b",
          950: "#050f0e",

          // Accent — Âmbar Dourado
          accent: "#D4A345", // Original
          "accent-light": "#E8BC6B",
          "accent-dark": "#B8892E",

          // Folha — Verde Claro
          leaf: "#9FC184",
          "leaf-light": "#BDD4A8",
          "leaf-dark": "#7BA35E",

          // Background
          bg: "#FAFAFA",
          "bg-dark": "#0D1F1E",
        },
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "sans-serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backgroundImage: {
        "dish-gradient":
          "linear-gradient(135deg, #184642 0%, #1f6e66 50%, #2e8c82 100%)",
        "dish-gradient-dark":
          "linear-gradient(135deg, #0a1e1b 0%, #184642 50%, #1f6e66 100%)",
        "accent-gradient":
          "linear-gradient(135deg, #D4A345 0%, #E8BC6B 100%)",
        "leaf-gradient":
          "linear-gradient(135deg, #9FC184 0%, #BDD4A8 100%)",
      },
      boxShadow: {
        dish: "0 4px 24px rgba(24, 70, 66, 0.25)",
        "dish-lg": "0 8px 40px rgba(24, 70, 66, 0.35)",
        accent: "0 4px 24px rgba(212, 163, 69, 0.35)",
        "accent-lg": "0 8px 40px rgba(212, 163, 69, 0.5)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;