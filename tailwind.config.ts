import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Палитра «Журнал»: белый лист, чернила, один акцент (ультрафиолет).
      // Акцент задан CSS-переменной в globals.css — оттенок меняется в одном месте.
      colors: {
        ink: "#141216",
        body: "#3d3944",
        muted: "#6b6672",
        dim: "#c9c4d1",
        line: "#e6e3ea",
        faint: "#eeecf1",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          line: "var(--accent-line)",
        },
      },
      // Переменные объявляет next/font/google в app/layout.tsx.
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
