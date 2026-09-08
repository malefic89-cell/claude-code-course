"use client";

import Link from "next/link";
import type { TaskMeta } from "@/lib/content";
import { t } from "@/lib/i18n";
import DifficultyBadge from "@/components/DifficultyBadge";
import { useDoneSet } from "@/components/useDoneSet";

interface TaskListProps {
  tasks: TaskMeta[];
}

/** Оглавление модуля: строки задач со статусом, текущая подсвечена. */
export default function TaskList({ tasks }: TaskListProps) {
  const { done } = useDoneSet();
  const currentId = tasks.find((task) => !done.has(task.id))?.id ?? null;
  return (
    <ul>
      {tasks.map((task) => {
        const isDone = done.has(task.id);
        const isCurrent = task.id === currentId;
        return (
          <li key={task.id}>
            <Link
              href={`/task/${task.id}`}
              aria-current={isCurrent ? "step" : undefined}
              className={`group grid grid-cols-[1.25rem_1fr_auto] items-center gap-x-3 gap-y-1 border-b border-line py-3 sm:grid-cols-[1.25rem_4rem_1fr_5rem_4.5rem] sm:gap-x-4 ${
                isCurrent ? "-mx-3 bg-accent-soft px-3" : ""
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center" aria-label={isDone ? t.task.statusDone : undefined}>
                {isDone ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : isCurrent ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                ) : (
                  <span className="h-[18px] w-[18px] rounded-full border-[1.5px] border-dim" />
                )}
              </span>
              <span className={`font-mono text-[13px] ${isCurrent ? "text-accent" : "text-muted"}`}>
                {task.id}
              </span>
              <span
                className={`col-span-3 col-start-2 text-base sm:col-span-1 sm:col-start-3 ${
                  isDone ? "text-muted line-through" : isCurrent ? "font-semibold" : ""
                } group-hover:text-accent`}
              >
                {task.title}
              </span>
              <span className="col-start-2 sm:col-start-4">
                <DifficultyBadge difficulty={task.difficulty} />
              </span>
              <span className="col-start-3 font-mono text-[13px] text-muted sm:col-start-5 sm:text-right">
                {t.task.minutes(task.estimated_minutes)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
