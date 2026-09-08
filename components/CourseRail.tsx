"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { moduleNumber, t } from "@/lib/i18n";
import ProgressBar from "@/components/ProgressBar";
import { useDoneSet } from "@/components/useDoneSet";

export interface RailTask {
  id: string;
  title: string;
}

export interface RailModule {
  id: string;
  title: string;
  tasks: RailTask[];
}

interface CourseRailProps {
  modules: RailModule[];
}

/** Активный модуль по адресу: /module/01 или /task/01-03 → "01". */
function activeModuleId(pathname: string): string | null {
  const m = pathname.match(/^\/module\/([^/]+)/) ?? pathname.match(/^\/task\/([^/-]+)-/);
  return m ? m[1] : null;
}

/**
 * Левая рейка: карта курса. Модули с прогрессом, активный раскрыт до задач.
 * Показывается только на широких экранах — на телефоне остаются ссылки «назад».
 */
export default function CourseRail({ modules }: CourseRailProps) {
  const { done } = useDoneSet();
  const pathname = usePathname();
  const activeModule = activeModuleId(pathname);
  const activeTask = pathname.match(/^\/task\/([^/]+)/)?.[1] ?? null;
  const allTasks = modules.flatMap((m) => m.tasks);
  const doneTotal = allTasks.filter((task) => done.has(task.id)).length;

  return (
    <nav aria-label={t.rail.title} className="sticky top-0 hidden max-h-screen overflow-y-auto border-r border-line py-10 pr-8 lg:block">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">{t.rail.title}</p>
      <ul className="mt-5 flex flex-col gap-5">
        {modules.map((mod) => {
          const doneCount = mod.tasks.filter((task) => done.has(task.id)).length;
          const isActive = mod.id === activeModule;
          return (
            <li key={mod.id}>
              <Link href={`/module/${mod.id}`} className="group flex flex-col gap-2">
                <span className="flex items-baseline gap-2.5">
                  <span
                    className={`font-numeral text-lg font-bold leading-none ${doneCount > 0 || isActive ? "text-accent" : "text-dim"}`}
                  >
                    {moduleNumber(mod.id).padStart(2, "0")}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-[15px] leading-tight group-hover:text-accent ${isActive ? "font-semibold" : ""}`}
                  >
                    {mod.title}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {doneCount}/{mod.tasks.length}
                  </span>
                </span>
                <ProgressBar value={doneCount} max={mod.tasks.length} />
              </Link>
              {isActive && (
                <ul className="mt-3 flex flex-col gap-1.5 border-l border-line pl-3">
                  {mod.tasks.map((task) => {
                    const isDone = done.has(task.id);
                    const isCurrent = task.id === activeTask;
                    return (
                      <li key={task.id}>
                        <Link
                          href={`/task/${task.id}`}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`flex items-center gap-2 text-[13px] leading-snug hover:text-accent ${
                            isCurrent ? "font-semibold text-accent" : isDone ? "text-muted" : "text-body"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              isDone || isCurrent ? "bg-accent" : "bg-dim"
                            }`}
                          />
                          <span className="truncate">{task.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-8 border-t border-line pt-4 font-mono text-xs text-muted">
        {t.rail.total(doneTotal, allTasks.length)}
      </p>
    </nav>
  );
}
