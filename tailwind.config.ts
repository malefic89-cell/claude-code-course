import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Палитра «Журнал»: семантические имена поверх CSS-переменных из globals.css.
      // Светлые и тёмные значения задаются там; компоненты не знают о теме.
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        body: "var(--body)",
        muted: "var(--muted)",
        dim: "var(--dim)",
        line: "var(--line)",
        faint: "var(--faint)",
        warn: "var(--warn)",
        danger: "var(--danger)",
        accent: {
          DEFAULT: "var(--accent)",
          fg: "var(--accent-fg)",
          soft: "var(--accent-soft)",
          line: "var(--accent-line)",
        },
        code: {
          bg: "var(--code-bg)",
          fg: "var(--code-fg)",
        },
      },
      // Переменные объявляет next/font/google в app/layout.tsx.
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        numeral: ["var(--font-numeral)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
