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

function hasSavedChoice(): boolean {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark";
  } catch {
    return false;
  }
}

/**
 * Подписка на изменения темы: свои переключения, смена системной темы
 * (пока нет сохранённого выбора) и выбор в другой вкладке.
 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    if (hasSavedChoice()) return;
    document.documentElement.dataset.theme = systemTheme();
    listener();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== STORAGE_KEY) return;
    document.documentElement.dataset.theme = readTheme();
    listener();
  };
  media.addEventListener("change", onMedia);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onMedia);
    window.removeEventListener("storage", onStorage);
  };
}

export function getThemeSnapshot(): Theme {
  return readTheme();
}

export function getServerThemeSnapshot(): Theme {
  return "light";
}
