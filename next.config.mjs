/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // Статический экспорт: сборка кладёт готовый сайт в out/ (GitHub Pages).
  output: "export",
  // Сайт живёт на malefic89-cell.github.io/claude-code-course/.
  // В dev basePath не нужен — локально приложение остаётся на корне.
  basePath: isProd ? "/claude-code-course" : "",
  // Каждая страница — папка с index.html: надёжные URL на статическом хостинге.
  trailingSlash: true,
};

export default nextConfig;
