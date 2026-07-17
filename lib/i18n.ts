/**
 * Словарь строк интерфейса (задел под i18n).
 * Компоненты не хардкодят текст — берут строки только отсюда.
 * Для новой локали добавляется такой же объект с другим содержимым.
 */

/** Русские множественные формы: pluralRu(n, "задача", "задачи", "задач"). */
export function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export const t = {
  siteTitle: "Claude Code Course",
  siteDescription: "Практический курс по работе в Claude Code",

  home: {
    intro: "Обучение через практику: каждая задача выполняется в реальном терминале с Claude Code.",
    overallTitle: "Общий прогресс",
    tasksOf: (done: number, total: number): string =>
      `${done} из ${total} ${pluralRu(total, "задачи", "задач", "задач")}`,
    percent: (p: number): string => `${p}%`,
  },

  module: {
    heading: (id: string, title: string): string => `Модуль ${id}. ${title}`,
    taskCount: (n: number): string => `${n} ${pluralRu(n, "задача", "задачи", "задач")}`,
    backToModules: "← Все модули",
  },

  task: {
    minutes: (n: number): string => `~${n} мин`,
    statusDone: "Выполнено",
    backToModule: (id: string): string => `← Модуль ${id}`,
    markDone: "Отметить выполненной",
    unmarkDone: "✓ Выполнено — снять отметку",
    prevTask: "← Предыдущая",
    nextTask: "Следующая →",
  },

  difficulty: {
    easy: "легко",
    medium: "средне",
    hard: "сложно",
  },

  progress: {
    barLabel: "Прогресс",
  },
} as const;
