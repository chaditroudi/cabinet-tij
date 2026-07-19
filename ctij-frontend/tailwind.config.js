/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit', // Enable JIT mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        pulse: "pulse 1.5s infinite",
      },
      gridTemplateColumns: {
        custom: "repeat(3, minmax(0px, 1fr))",
      },
      display: ["custom-group-hover"],

      fontSize: {},
      width: {
        available: "stretch", // Custom utility for width
      },
      fontFamily: {
        display: ["Spectral", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        navy: {
          50: "#F3F5F9",
          100: "#E7EAF1",
          600: "#2E4372",
          700: "#24365C",
          800: "#1B2A4A",
          900: "#14213D",
        },
        gold: {
          500: "#C8A24B",
          600: "#A9853A",
        },
        sang: {
          500: "#B23A48",
          600: "#9A2F3C",
        },
        paper: {
          DEFAULT: "#F7F5EF",
          card: "#FFFFFF",
          border: "#E7E2D6",
        },
        ink: "#1B2437",
        muted: "#5B6473",
      },
      borderRadius: {},
      padding: {},
      boxShadow: {
        "ann-card": "0 2px 5px #0003", // legacy — kept until Search is redesigned
        soft: "0 1px 2px rgb(20 33 61 / 0.04), 0 8px 24px rgb(20 33 61 / 0.06)",
        "soft-lg":
          "0 2px 4px rgb(20 33 61 / 0.05), 0 16px 40px rgb(20 33 61 / 0.10)",
      },
    },
  },

  plugins: [require("@tailwindcss/forms")],
};
