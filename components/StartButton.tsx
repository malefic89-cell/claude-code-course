"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useDoneSet } from "@/components/useDoneSet";

interface StartButtonProps {
  /** Id всех задач курса в порядке прохождения. */
  taskIds: string[];
}

/**
 * Главная кнопка: «Начать курс», «Продолжить · id» первой невыполненной задачи
 * или «Пройти заново», когда всё отмечено.
 */
export default function StartButton({ taskIds }: StartButtonProps) {
  const { done } = useDoneSet();
  const next = taskIds.find((id) => !done.has(id)) ?? null;
  const first = taskIds[0];
  if (!first) return null;
  const label = next === null ? t.home.restart : done.size > 0 ? t.home.resume(next) : t.home.start;
  return (
    <Link
      href={`/task/${next ?? first}`}
      className="group inline-flex h-12 items-center gap-3 bg-accent px-7 font-semibold text-accent-fg transition-colors hover:bg-ink hover:text-paper"
    >
      <span>{label}</span>
      <svg
        className="transition-transform group-hover:translate-x-1"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
