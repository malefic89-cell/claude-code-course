"use client";

import Link from "next/link";
import type { TaskMeta } from "@/lib/content";
import { t } from "@/lib/i18n";
import DifficultyBadge from "@/components/DifficultyBadge";
import { useDoneSet } from "@/components/useDoneSet";

interface TaskListProps {
  tasks: TaskMeta[];
}

/** Список задач модуля со статусами выполнения и сложностью. */
export default function TaskList({ tasks }: TaskListProps) {
  const { done } = useDoneSet();
  return (
    <ul className="space-y-2">
      {tasks.map((task) => {
        const isDone = done.has(task.id);
        return (
          <li key={task.id}>
            <Link
              href={`/task/${task.id}`}
              className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-emerald-500 hover:bg-emerald-50/40"
            >
              <span
                aria-label={isDone ? t.task.statusDone : undefined}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                  isDone
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-300 text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="min-w-0 flex-1">
                <span className={isDone ? "text-gray-400 line-through" : ""}>
                  {task.id}. {task.title}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-gray-400">
                <DifficultyBadge difficulty={task.difficulty} />
                {t.task.minutes(task.estimated_minutes)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
