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
          blue: "#0062FF",
          blueHover: "#0052D9",
          navy: "#0A1128",
          dark: "#0F172A",
          slate: "#64748B",
          light: "#F8FAFC",
        },
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#0062FF", // STC Electric Blue
          DEFAULT: "#0062FF",
          hover: "#0052D9",
          foreground: "#FFFFFF",
        },
        sidebar: {
          DEFAULT: "#0B132B",
          hover: "#1C2541",
          active: "#0062FF",
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
