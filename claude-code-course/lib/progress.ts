/**
 * Единственная точка работы с хранилищем прогресса.
 * MVP: localStorage. Позже реализация заменяется на серверную
 * без изменения компонентов — интерфейс остаётся прежним.
 *
 * Все функции безопасны на сервере (SSR): без window возвращают пустое состояние.
 */

const STORAGE_KEY = "ccc-progress-v1";

/** Прогресс: множество id выполненных задач. */
export interface Progress {
  done: string[];
}

function read(): Progress {
  if (typeof window === "undefined") return { done: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { done: [] };
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as Progress).done) &&
      (parsed as Progress).done.every((x) => typeof x === "string")
    ) {
      return parsed as Progress;
    }
    return { done: [] };
  } catch {
    return { done: [] };
  }
}

function write(p: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // localStorage может быть недоступен (приватный режим) — прогресс просто не сохранится.
  }
}

/** Текущий прогресс. */
export function getProgress(): Progress {
  return read();
}

/** Выполнена ли задача. */
export function isDone(taskId: string): boolean {
  return read().done.includes(taskId);
}

/** Отметить задачу выполненной. */
export function markDone(taskId: string): Progress {
  const p = read();
  if (!p.done.includes(taskId)) p.done = [...p.done, taskId];
  write(p);
  return p;
}

/** Снять отметку выполнения. */
export function unmarkDone(taskId: string): Progress {
  const p = read();
  p.done = p.done.filter((id) => id !== taskId);
  write(p);
  return p;
}

/** Полный сброс прогресса. */
export function reset(): Progress {
  const p: Progress = { done: [] };
  write(p);
  return p;
}

/** Счётчик выполненных среди переданных задач. */
export function countDone(taskIds: string[]): number {
  const done = new Set(read().done);
  return taskIds.filter((id) => done.has(id)).length;
}
