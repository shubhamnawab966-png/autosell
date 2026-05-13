/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#0a0f1a",
          900: "#0f1629",
          800: "#151d33",
          700: "#1e293b",
          600: "#273549",
        },
        accent: {
          DEFAULT: "#3b82f6",
          muted: "#2563eb",
          glow: "#60a5fa",
        },
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        panel: "0 0 0 1px rgb(51 65 85 / 0.35), 0 18px 50px -12px rgb(0 0 0 / 0.45)",
        glow: "0 0 40px -10px rgb(59 130 246 / 0.45)",
      },
    },
  },
  plugins: [],
};
