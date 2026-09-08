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

/** Человекочитаемый номер модуля: "00" → "0", "01" → "1". Id задач ("01-03") не трогаем. */
export function moduleNumber(id: string): string {
  return String(Number.parseInt(id, 10));
}

/** Оценка времени: 45 → «≈ 45 мин», 90 → «≈ 1,5 ч», 120 → «≈ 2 ч». */
export function duration(minutes: number): string {
  if (minutes < 60) return `≈ ${minutes} мин`;
  const hours = Math.round((minutes / 60) * 2) / 2;
  return `≈ ${String(hours).replace(".", ",")} ч`;
}

const tasksWord = (n: number): string => pluralRu(n, "задача", "задачи", "задач");

export const t = {
  siteTitle: "Claude Code Course",
  siteDescription: "Практический курс по работе в Claude Code",

  nav: {
    programme: "Программа",
  },

  rail: {
    title: "Карта курса",
    total: (done: number, total: number): string =>
      `${done} из ${total} ${pluralRu(total, "задачи", "задач", "задач")}`,
  },

  home: {
    eyebrow: (modules: number, tasks: number): string =>
      `Практический курс · ${modules} ${pluralRu(modules, "модуль", "модуля", "модулей")} · ${tasks} ${tasksWord(tasks)}`,
    /** Заголовок из двух частей: обычная и выделенная курсивом. */
    titleStart: "Claude Code, ",
    titleEmphasis: "освоенный руками",
    titleEnd: ", а не по видео.",
    intro:
      "Каждая задача выполняется в вашем терминале и заканчивается проверяемым результатом. Опыт разработки не требуется: git, командная строка и пути объясняются в момент, когда они нужны.",
    start: "Начать курс",
    resume: (taskId: string): string => `Продолжить · ${taskId}`,
    viewProgramme: "Посмотреть программу",
    progressTitle: "Ваш прогресс",
    progressOf: (total: number): string => `из ${total} ${pluralRu(total, "задачи", "задач", "задач")}`,
    progressNext: (taskId: string, title: string): string => `Следующая: ${taskId}. ${title}`,
    progressDone: "Курс пройден целиком.",
    programmeTitle: "Программа",
    programmeNote: "Модули открыты в любом порядке",
    moduleNotStarted: (n: number): string => `${n} ${tasksWord(n)} · не начат`,
    moduleInProgress: (done: number, total: number, nextId: string): string =>
      `${done} из ${total} ${tasksWord(total)} · продолжить с ${nextId}`,
    moduleComplete: (n: number): string => `${n} ${tasksWord(n)} · пройден`,
  },

  module: {
    heading: (id: string, title: string): string => `Модуль ${moduleNumber(id)}. ${title}`,
    taskCount: (n: number): string => `${n} ${tasksWord(n)}`,
    backToModules: "← Все модули",
    remaining: (done: number, total: number, minutesLeft: number): string =>
      minutesLeft > 0
        ? `${done} из ${total} · ${duration(minutesLeft)} осталось`
        : `${done} из ${total} · модуль пройден`,
  },

  task: {
    minutes: (n: number): string => `≈ ${n} мин`,
    eyebrow: (moduleId: string, taskId: string): string =>
      `Модуль ${moduleNumber(moduleId)} · задача ${taskId}`,
    statusDone: "Выполнено",
    backToModule: (id: string): string => `← Модуль ${moduleNumber(id)}`,
    markDone: "Отметить выполненной",
    unmarkDone: "Выполнено — снять отметку",
    prevTask: "Предыдущая",
    nextTask: "Следующая",
    marginTitle: "На полях",
    hintsSummary: "Подсказки",
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
