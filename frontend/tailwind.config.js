/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#EEF2FF",
          100: "#DCE4FF",
          400: "#6E8CFE",
          500: "#456EFE",
          600: "#3557E0",
          700: "#2843B8",
        },
        ink: {
          900: "#0A0F1F",
          800: "#111830",
          700: "#1B2340",
          500: "#5B6478",
          300: "#A9B0C0",
          100: "#EEF0F5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(69, 110, 254, 0.10)",
        lift: "0 12px 40px -12px rgba(69, 110, 254, 0.25)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg,#456EFE 0%,#6E8CFE 100%)",
        "hero-glow":
          "radial-gradient(1200px 500px at 20% 0%, rgba(69,110,254,0.12), transparent 60%)",
      },
      animation: {
        "fade-up": "fadeUp .5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-500px 0" }, "100%": { backgroundPosition: "500px 0" } },
      },
    },
  },
  plugins: [],
};