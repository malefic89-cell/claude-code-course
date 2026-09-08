"use client";

import { t } from "@/lib/i18n";
import { markDone, unmarkDone } from "@/lib/progress";
import { useDoneSet } from "@/components/useDoneSet";

interface TaskDoneButtonProps {
  taskId: string;
}

/** Кнопка «Выполнено»: отмечает задачу через lib/progress.ts. */
export default function TaskDoneButton({ taskId }: TaskDoneButtonProps) {
  const { done } = useDoneSet();
  const isDone = done.has(taskId);
  const toggle = () => {
    if (isDone) {
      unmarkDone(taskId);
    } else {
      markDone(taskId);
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDone}
      className={`inline-flex h-12 w-full items-center justify-center gap-3 px-7 font-semibold transition-colors sm:w-auto ${
        isDone
          ? "border border-ink bg-white text-ink hover:border-accent hover:text-accent"
          : "bg-accent text-white hover:bg-ink"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12l5 5L20 7" />
      </svg>
      <span>{isDone ? t.task.unmarkDone : t.task.markDone}</span>
    </button>
  );
}
