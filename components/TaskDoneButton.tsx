"use client";

import { t } from "@/lib/i18n";
import { markDone, unmarkDone } from "@/lib/progress";
import { useDoneSet } from "@/components/useDoneSet";

interface TaskDoneButtonProps {
  taskId: string;
}

/** Кнопка «Выполнено»: отмечает задачу через lib/progress.ts. */
export default function TaskDoneButton({ taskId }: TaskDoneButtonProps) {
  const { done, refresh } = useDoneSet();
  const isDone = done.has(taskId);
  const toggle = () => {
    if (isDone) {
      unmarkDone(taskId);
    } else {
      markDone(taskId);
    }
    refresh();
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDone}
      className={`w-full rounded-xl px-4 py-3 font-semibold transition-colors sm:w-auto ${
        isDone
          ? "border border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
      {isDone ? t.task.unmarkDone : t.task.markDone}
    </button>
  );
}
