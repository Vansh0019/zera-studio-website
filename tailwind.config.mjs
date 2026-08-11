/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      colors: {
        ink: "#050505",
        paper: "#fbfaf8",
        bone: "#f2f0eb",
        line: "#dedbd2",
        plum: "#7c3ef2",
        rose: "#f15caf",
        cyan: "#67d8d2"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(5, 5, 5, 0.12)",
        hard: "0 18px 0 rgba(5, 5, 5, 0.08)"
      }
    }
  },
  plugins: []
};
