/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Archivo Variable", "Archivo", "Inter Variable", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        // "White" on this site is projector light on a warm black, not screen white. Every text-white/bg-white
        // utility picks this up; the paper (legal) pages use ink on paper and are unaffected.
        white: "#f3ede3",
        night: "#0b0908",
        ink: "#050505",
        paper: "#fbfaf8",
        bone: "#f2f0eb",
        line: "#dedbd2",
        // The one accent: the colour of the lamp. Used for the thing that is happening now, nowhere else.
        lamp: "#ffb547",
        // Track colours, muted the way a real editor's timeline is.
        tvideo: "#4a78c9",
        tbroll: "#3f8f9a",
        tgfx: "#b8643f",
        taudio: "#5a9e7c",
        // Named so they do not replace Tailwind's own blue/violet/purple scales.
        zblue: "#1d74d9",
        zviolet: "#5b4bff",
        zpurple: "#8a3ffc",
        // Used by the legal pages.
        plum: "#7c3ef2",
        rose: "#d93d6a",
        cyan: "#67d8d2"
      },
      borderRadius: {
        // One small radius for the whole site. Big soft corners on every card are a template look.
        xl: "8px",
        "2xl": "10px",
        "3xl": "12px"
      }
    }
  },
  plugins: []
};
