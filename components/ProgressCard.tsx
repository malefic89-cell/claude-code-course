"use client";

import type { TaskMeta } from "@/lib/content";
import { t } from "@/lib/i18n";
import ProgressBar from "@/components/ProgressBar";
import { useDoneSet } from "@/components/useDoneSet";

interface ProgressCardProps {
  /** Все задачи курса в порядке прохождения (метаданные). */
  tasks: TaskMeta[];
}

/** Карточка прогресса на главной: крупная цифра, линейка, следующая задача. */
export default function ProgressCard({ tasks }: ProgressCardProps) {
  const { done } = useDoneSet();
  const doneCount = tasks.filter((task) => done.has(task.id)).length;
  const next = tasks.find((task) => !done.has(task.id)) ?? null;
  return (
    <section className="flex flex-col gap-3 border border-accent-line bg-accent-soft p-6 sm:p-7">
      <h2 className="font-mono text-xs uppercase tracking-wider text-accent">{t.home.progressTitle}</h2>
      <p className="flex items-baseline gap-2.5">
        <span key={doneCount} className="page-in font-numeral text-5xl font-bold leading-none sm:text-6xl">{doneCount}</span>
        <span className="text-lg text-muted">{t.home.progressOf(tasks.length)}</span>
      </p>
      <ProgressBar value={doneCount} max={tasks.length} track="white" />
      <p className="text-[15px] leading-snug text-body">
        {next ? t.home.progressNext(next.id, next.title) : t.home.progressDone}
      </p>
    </section>
  );
}
