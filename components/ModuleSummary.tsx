"use client";

import type { TaskMeta } from "@/lib/content";
import { t } from "@/lib/i18n";
import ProgressBar from "@/components/ProgressBar";
import { useDoneSet } from "@/components/useDoneSet";

interface ModuleSummaryProps {
  tasks: TaskMeta[];
}

/** Прогресс модуля: линейка и «X из N · ≈ M мин осталось». */
export default function ModuleSummary({ tasks }: ModuleSummaryProps) {
  const { done } = useDoneSet();
  const doneCount = tasks.filter((task) => done.has(task.id)).length;
  const minutesLeft = tasks
    .filter((task) => !done.has(task.id))
    .reduce((sum, task) => sum + task.estimated_minutes, 0);
  return (
    <div className="flex flex-col gap-2">
      <ProgressBar value={doneCount} max={tasks.length} />
      <p className="text-sm text-muted">{t.module.remaining(doneCount, tasks.length, minutesLeft)}</p>
    </div>
  );
}
