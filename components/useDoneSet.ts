"use client";

import { useCallback, useEffect, useState } from "react";
import { getProgress } from "@/lib/progress";

/**
 * Множество id выполненных задач.
 * Читается после монтирования, чтобы серверный и первый клиентский
 * рендер совпадали (localStorage есть только в браузере).
 */
export function useDoneSet(): { done: Set<string>; refresh: () => void } {
  const [done, setDone] = useState<Set<string>>(new Set());
  const refresh = useCallback(() => {
    setDone(new Set(getProgress().done));
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return { done, refresh };
}
