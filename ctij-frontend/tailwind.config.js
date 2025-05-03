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
      colors: {},
      borderRadius: {},
      padding: {},
      boxShadow: {
        "ann-card": "0 2px 5px #0003", // Corrected syntax
      },
    },
  },

  plugins: [require("@tailwindcss/forms")],
};
