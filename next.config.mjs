/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // Статический экспорт: сборка кладёт готовый сайт в out/ (GitHub Pages).
  output: "export",
  // Сайт живёт на malefic89-cell.github.io/claude-code-course/.
  // В dev basePath не нужен — локально приложение остаётся на корне.
  basePath: isProd ? "/claude-code-course" : "",
  // Тот же префикс для абсолютных путей в контенте (картинки в Markdown): Next
  // подставляет basePath только в Link и next/image, а не в обычные <img src="/…">.
  env: { NEXT_PUBLIC_BASE_PATH: isProd ? "/claude-code-course" : "" },
  // Каждая страница — папка с index.html: надёжные URL на статическом хостинге.
  trailingSlash: true,
};

export default nextConfig;
