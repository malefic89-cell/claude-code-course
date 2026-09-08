"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { useDoneSet } from "@/components/useDoneSet";

interface StartButtonProps {
  /** Id всех задач курса в порядке прохождения. */
  taskIds: string[];
}

/** Главная кнопка: «Начать курс» или «Продолжить · id» первой невыполненной задачи. */
export default function StartButton({ taskIds }: StartButtonProps) {
  const { done } = useDoneSet();
  const next = taskIds.find((id) => !done.has(id)) ?? taskIds[0];
  const started = done.size > 0;
  if (!next) return null;
  return (
    <Link
      href={`/task/${next}`}
      className="group inline-flex h-12 items-center gap-3 bg-accent px-7 font-semibold text-white transition-colors hover:bg-ink"
    >
      <span>{started ? t.home.resume(next) : t.home.start}</span>
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
