"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getProgressSnapshot, getServerProgressSnapshot, subscribe } from "@/lib/progress";

/**
 * Множество id выполненных задач.
 * useSyncExternalStore: на сервере и при гидратации — пустой прогресс,
 * в браузере — актуальный localStorage с подпиской на изменения.
 */
export function useDoneSet(): { done: Set<string> } {
  const progress = useSyncExternalStore(subscribe, getProgressSnapshot, getServerProgressSnapshot);
  const done = useMemo(() => new Set(progress.done), [progress]);
  return { done };
}
