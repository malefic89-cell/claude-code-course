"use client";

import { t } from "@/lib/i18n";
import ProgressBar from "@/components/ProgressBar";
import { useDoneSet } from "@/components/useDoneSet";

interface OverallProgressProps {
  /** Id всех задач курса (по всем модулям). */
  taskIds: string[];
}

/** Общий трекер прогресса на главной: «X из Y задач» и процент. */
export default function OverallProgress({ taskIds }: OverallProgressProps) {
  const { done } = useDoneSet();
  const doneCount = taskIds.filter((id) => done.has(id)).length;
  const percent = taskIds.length > 0 ? Math.round((doneCount / taskIds.length) * 100) : 0;
  return (
    <section className="rounded-xl border bg-gray-50 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold">{t.home.overallTitle}</h2>
        <p className="text-sm text-gray-600">
          {t.home.tasksOf(doneCount, taskIds.length)} · {t.home.percent(percent)}
        </p>
      </div>
      <div className="mt-2">
        <ProgressBar value={doneCount} max={taskIds.length} />
      </div>
    </section>
  );
}
