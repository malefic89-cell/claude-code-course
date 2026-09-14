"use client";

import Link from "next/link";
import type { Module } from "@/lib/content";
import { duration, moduleNumber, t } from "@/lib/i18n";
import ModuleIcon from "@/components/ModuleIcon";
import ProgressBar from "@/components/ProgressBar";
import { useDoneSet } from "@/components/useDoneSet";

interface ModuleCardProps {
  module: Module;
  /** Суммарная оценка времени по задачам модуля, минут. */
  minutes: number;
}

/** Строка программы: модуль как глава — номер, название, описание, прогресс, время. */
export default function ModuleCard({ module: mod, minutes }: ModuleCardProps) {
  const { done } = useDoneSet();
  const doneCount = mod.tasks.filter((id) => done.has(id)).length;
  const total = mod.tasks.length;
  const next = mod.tasks.find((id) => !done.has(id));
  const isComplete = doneCount === total;
  // Линейка слева показывает состояние: серая — не начат, акцент — в работе, чернила — пройден.
  const rule = isComplete ? "border-ink" : doneCount > 0 ? "border-accent" : "border-line";
  const status =
    doneCount === 0
      ? t.home.moduleNotStarted(total)
      : next
        ? t.home.moduleInProgress(doneCount, total, next)
        : t.home.moduleComplete(total);
  return (
    <Link
      href={`/module/${mod.id}`}
      className={`group grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-3 border p-5 transition-colors hover:border-accent sm:grid-cols-[5rem_1fr_18rem_5rem] sm:gap-x-6 sm:p-7 ${rule}`}
    >
      <span
        className={`font-numeral text-4xl font-bold leading-none sm:text-5xl ${doneCount > 0 ? "text-accent" : "text-dim"}`}
      >
        {moduleNumber(mod.id).padStart(2, "0")}
      </span>
      <span className="flex min-w-0 flex-col gap-2">
        <span className="flex items-center gap-3">
          <span className="font-serif text-2xl font-medium leading-tight group-hover:text-accent">
            {mod.title}
          </span>
          <ModuleIcon name={mod.icon} className="h-5 w-5 shrink-0 text-dim group-hover:text-accent" />
        </span>
        <span className="text-[15px] leading-relaxed text-body">{mod.description}</span>
      </span>
      <span className="col-start-2 flex flex-col gap-2 sm:col-start-3 sm:pt-1.5">
        <ProgressBar value={doneCount} max={total} />
        <span className="text-sm text-muted">{status}</span>
      </span>
      <span className="col-start-2 font-mono text-xs text-muted sm:col-start-4 sm:pt-1.5 sm:text-right sm:text-[13px]">
        {duration(minutes)}
      </span>
    </Link>
  );
}
