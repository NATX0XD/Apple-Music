const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      dark: {
        colors: {
          background: "#0a0a0f",
          foreground: "#ffffff",
          primary: {
            DEFAULT: "#a855f7",
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#6366f1",
          },
        },
      },
      light: {
        colors: {
          background: "#f5f5f7",
          foreground: "#1d1d1f",
          primary: {
            DEFAULT: "#7c3aed",
            foreground: "#ffffff",
          },
        },
      },
    },
  })],
};
