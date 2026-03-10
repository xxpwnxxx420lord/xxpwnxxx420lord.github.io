import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg: "#232323",
        surface: "#2c2c2c",
        border: "#3a3a3a",
        muted: "#888888",
        accent: "#e2c882",
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography"), heroui({
    themes: {
      dark: {
        colors: {
          background: "#232323",
          foreground: "#f0ede8",
          primary: {
            DEFAULT: "#e2c882",
            foreground: "#232323",
          },
          default: {
            DEFAULT: "#2c2c2c",
            foreground: "#f0ede8",
          },
        },
      },
    },
  })],
};
export default config;
