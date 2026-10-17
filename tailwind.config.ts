import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#16A34A",
          greenHover: "#15803D",
          navy: "#0A1128",
          dark: "#0F172A",
          slate: "#64748B",
          light: "#F8FAFC",
        },
        primary: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          DEFAULT: "#16A34A",
          hover: "#15803D",
          foreground: "#FFFFFF",
        },
        sidebar: {
          DEFAULT: "#0B132B",
          hover: "#1C2541",
          active: "#16A34A",
          border: "#1E293B",
          text: "#94A3B8",
          textActive: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 98, 255, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        "card-hover": "0 14px 28px -4px rgba(0, 98, 255, 0.12), 0 6px 12px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
