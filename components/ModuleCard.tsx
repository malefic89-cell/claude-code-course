"use client";

import Link from "next/link";
import type { Module } from "@/lib/content";
import { t } from "@/lib/i18n";
import ModuleIcon from "@/components/ModuleIcon";
import ProgressBar from "@/components/ProgressBar";
import { useDoneSet } from "@/components/useDoneSet";

interface ModuleCardProps {
  module: Module;
}

/** Карточка модуля в каталоге: иконка, название, прогресс, «N из M задач». */
export default function ModuleCard({ module: mod }: ModuleCardProps) {
  const { done } = useDoneSet();
  const doneCount = mod.tasks.filter((id) => done.has(id)).length;
  return (
    <Link
      href={`/module/${mod.id}`}
      className="block rounded-xl border p-4 transition-colors hover:border-emerald-500 hover:bg-emerald-50/40"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <ModuleIcon name={mod.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{t.module.heading(mod.id, mod.title)}</h2>
          <p className="mt-1 text-sm text-gray-600">{mod.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ProgressBar value={doneCount} max={mod.tasks.length} />
        <span className="shrink-0 text-xs text-gray-500">
          {t.home.tasksOf(doneCount, mod.tasks.length)}
        </span>
      </div>
    </Link>
  );
}
