/**
 * Тема оформления: светлая / тёмная.
 * Единственная точка работы с хранилищем настройки (localStorage).
 * Выбор пользователя хранится отдельно от прогресса; без выбора — системная тема.
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "ccc-theme";

/**
 * Скрипт для <head>: выставляет data-theme до первой отрисовки, чтобы не мигало.
 * Дублирует логику readTheme() — намеренно, он выполняется до загрузки модулей.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Текущая тема: сохранённый выбор или системная. На сервере — светлая. */
export function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // localStorage недоступен — берём системную.
  }
  return systemTheme();
}

/** Применяет тему к документу и запоминает выбор. */
export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Не сохранилось — тема действует до перезагрузки.
  }
  emit();
}

/* ---- Подписка для useSyncExternalStore ---- */

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getThemeSnapshot(): Theme {
  return readTheme();
}

export function getServerThemeSnapshot(): Theme {
  return "light";
}
