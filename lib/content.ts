import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** Уровень сложности задачи. */
export type Difficulty = "easy" | "medium" | "hard";

/** Метаданные модуля (content/modules/module-XX.json). */
export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Идентификаторы задач в порядке прохождения. */
  tasks: string[];
}

/** Frontmatter задачи. */
export interface TaskMeta {
  id: string;
  module: string;
  title: string;
  difficulty: Difficulty;
  estimated_minutes: number;
  verified_date: string | null;
}

/** Задача: метаданные + Markdown-тело. */
export interface Task extends TaskMeta {
  /** Markdown после frontmatter (Цель / Инструкция / Критерий / Подсказки). */
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const MODULES_DIR = path.join(CONTENT_DIR, "modules");
const TASKS_DIR = path.join(CONTENT_DIR, "tasks");

function isDifficulty(v: unknown): v is Difficulty {
  return v === "easy" || v === "medium" || v === "hard";
}

function assertModule(data: unknown, file: string): Module {
  const m = data as Partial<Module>;
  if (
    typeof m.id !== "string" ||
    typeof m.title !== "string" ||
    typeof m.description !== "string" ||
    typeof m.icon !== "string" ||
    !Array.isArray(m.tasks) ||
    !m.tasks.every((t) => typeof t === "string")
  ) {
    throw new Error(`Некорректные метаданные модуля: ${file}`);
  }
  return m as Module;
}

function assertTaskMeta(data: Record<string, unknown>, file: string): TaskMeta {
  const { id, module: mod, title, difficulty, estimated_minutes, verified_date } = data;
  if (
    typeof id !== "string" ||
    typeof mod !== "string" ||
    typeof title !== "string" ||
    !isDifficulty(difficulty) ||
    typeof estimated_minutes !== "number" ||
    !(verified_date === null || typeof verified_date === "string" || verified_date instanceof Date)
  ) {
    throw new Error(`Некорректный frontmatter задачи: ${file}`);
  }
  return {
    id,
    module: mod,
    title,
    difficulty,
    estimated_minutes,
    verified_date:
      verified_date instanceof Date ? verified_date.toISOString().slice(0, 10) : verified_date,
  };
}

/** Все модули, отсортированные по id. */
export function getModules(): Module[] {
  return fs
    .readdirSync(MODULES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      assertModule(JSON.parse(fs.readFileSync(path.join(MODULES_DIR, f), "utf-8")), f),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** Модуль по id или null. */
export function getModule(id: string): Module | null {
  return getModules().find((m) => m.id === id) ?? null;
}

/** Задача по id (например, "01-00") или null. */
export function getTask(id: string): Task | null {
  const file = path.join(TASKS_DIR, `task-${id}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));
  return { ...assertTaskMeta(data, file), body: content.trim() };
}

/** Задачи модуля в порядке, заданном в метаданных модуля. */
export function getModuleTasks(moduleId: string): Task[] {
  const mod = getModule(moduleId);
  if (!mod) return [];
  return mod.tasks
    .map((tid) => getTask(tid))
    .filter((t): t is Task => t !== null);
}

/** Все задачи курса в порядке прохождения: модули по id, внутри — по списку модуля. */
export function getCourseOrder(): string[] {
  return getModules().flatMap((m) => m.tasks);
}

/**
 * Сосед задачи для навигации «предыдущая/следующая».
 * Порядок сквозной: за последней задачей модуля идёт первая задача следующего.
 */
export function getAdjacentTaskIds(taskId: string): {
  prev: string | null;
  next: string | null;
} {
  const order = getCourseOrder();
  const i = order.indexOf(taskId);
  return {
    prev: i > 0 ? order[i - 1] : null,
    next: i >= 0 && i < order.length - 1 ? order[i + 1] : null,
  };
}
