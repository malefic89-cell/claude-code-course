# Claude Code Course

Практический курс по работе в Claude Code: модули → задачи → чек-листы →
трекер прогресса. Каждая задача выполняется в реальном терминале,
приложение даёт инструкцию и критерий выполнения.

Сайт: https://malefic89-cell.github.io/claude-code-course/

## Запуск

```bash
npm ci
npm run dev      # http://localhost:3000
npm run lint     # обязателен перед коммитом
npm run build    # статический экспорт в out/
```

Сборка тянет шрифты с Google Fonts (next/font/google) — нужна сеть.

## Где что

- `content/` — модули (JSON) и задачи (Markdown с frontmatter). Правятся без кода.
- `app/`, `components/` — интерфейс (Next.js App Router, Tailwind).
- `lib/content.ts`, `lib/progress.ts`, `lib/i18n.ts`, `lib/theme.ts` — границы
  между контентом, прогрессом, строками и темой; описаны в CONTRACT.md.
- CLAUDE.md — правила проекта, PLAN.md — план и статусы, docs/pilot.md — пилот.

## Деплой

GitHub Pages, автоматически по push в `main` (`.github/workflows/deploy.yml`).
