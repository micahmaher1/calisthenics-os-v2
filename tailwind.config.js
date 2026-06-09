/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        mono:    ["'JetBrains Mono'", "monospace"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      colors: {
        surface: {
          900: "#0a0a0a",
          800: "#111111",
          700: "#1a1a1a",
          600: "#222222",
          500: "#2a2a2a",
          400: "#333333",
        },
      },
      animation: {
        "fade-in":   "fadeIn 0.4s ease forwards",
        "slide-up":  "slideUp 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  // Safelist all dynamic color classes used in skill tree
  safelist: [
    // Branch colors - text
    "text-orange-400", "text-sky-400", "text-red-400", "text-purple-400",
    "text-green-400", "text-green-300", "text-yellow-400", "text-amber-400",
    // Branch colors - bg
    "bg-orange-500/10", "bg-sky-500/10", "bg-red-500/10", "bg-purple-500/10",
    "bg-green-500/10", "bg-yellow-500/10",
    // Branch colors - border
    "border-orange-500/30", "border-sky-500/30", "border-red-500/30", "border-purple-500/30",
    "border-green-500/30", "border-green-500/20", "border-yellow-500/30",
    // Branch colors - shadow
    "shadow-orange-500/40", "shadow-sky-500/40", "shadow-red-500/40", "shadow-purple-500/40",
    // Progress bars
    "bg-orange-400", "bg-sky-400", "bg-red-400", "bg-purple-400", "bg-green-400", "bg-yellow-400",
  ],
  plugins: [],
};
