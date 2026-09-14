/**
 * Единственная точка работы с хранилищем прогресса.
 * MVP: localStorage. Позже реализация заменяется на серверную
 * без изменения компонентов — интерфейс остаётся прежним.
 *
 * Все функции безопасны на сервере (SSR): без window возвращают пустое состояние.
 */

const STORAGE_KEY = "ccc-progress-v1";

/**
 * Прогресс: множество id выполненных задач и, после финала, ссылка на
 * опубликованный продукт ученика («Полку»). Ссылка — тоже часть прогресса:
 * при смене хранилища на серверное она переезжает вместе с ним.
 */
export interface Progress {
  done: string[];
  shelfUrl?: string;
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
      const p = parsed as Progress;
      return typeof p.shelfUrl === "string" && p.shelfUrl !== ""
        ? { done: p.done, shelfUrl: p.shelfUrl }
        : { done: p.done };
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
  emit();
}

/* ---- Подписка на изменения (для useSyncExternalStore в компонентах) ---- */

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

/** Подписка на изменения прогресса (включая другие вкладки). */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const EMPTY_PROGRESS: Progress = { done: [] };
let snapshotCache: { raw: string | null; progress: Progress } | null = null;

/**
 * Снимок прогресса для useSyncExternalStore: ссылочно стабилен,
 * пока содержимое хранилища не изменилось.
 */
export function getProgressSnapshot(): Progress {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY_PROGRESS;
  }
  if (snapshotCache && snapshotCache.raw === raw) return snapshotCache.progress;
  snapshotCache = { raw, progress: read() };
  return snapshotCache.progress;
}

/** Снимок для серверного рендера и гидратации: пустой прогресс. */
export function getServerProgressSnapshot(): Progress {
  return EMPTY_PROGRESS;
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

/** Ссылка на опубликованную «Полку» или null, если ученик её не сохранял. */
export function getShelfUrl(): string | null {
  return read().shelfUrl ?? null;
}

/** Сохранить ссылку на «Полку»; пустая строка удаляет её. */
export function setShelfUrl(url: string): Progress {
  const p = read();
  const trimmed = url.trim();
  if (trimmed === "") delete p.shelfUrl;
  else p.shelfUrl = trimmed;
  write(p);
  return p;
}

/** Сброс отметок; ссылка на «Полку» остаётся — это продукт, а не прогресс по курсу. */
export function reset(): Progress {
  const shelfUrl = read().shelfUrl;
  const p: Progress = shelfUrl ? { done: [], shelfUrl } : { done: [] };
  write(p);
  return p;
}

/** Счётчик выполненных среди переданных задач. */
export function countDone(taskIds: string[]): number {
  const done = new Set(read().done);
  return taskIds.filter((id) => done.has(id)).length;
}
