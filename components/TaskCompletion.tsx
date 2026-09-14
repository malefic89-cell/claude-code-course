"use client";

import Link from "next/link";
import { useState } from "react";
import { moduleNumber, t } from "@/lib/i18n";
import { markDone, unmarkDone } from "@/lib/progress";
import { useDoneSet } from "@/components/useDoneSet";

interface TaskCompletionProps {
  taskId: string;
  moduleId: string;
  /** Id всех задач модуля — чтобы понять, что модуль пройден. */
  moduleTaskIds: string[];
  /** Следующая задача или null. */
  nextTaskId: string | null;
  /** Следующий модуль или null, если этот — последний. */
  nextModule: { id: string; title: string } | null;
}

/**
 * Блок завершения задачи: кнопка «Выполнено», ссылка на следующую и баннер
 * «Модуль пройден». Баннер — событие, а не статус: показывается только когда
 * последняя задача модуля отмечена здесь и сейчас.
 */
export default function TaskCompletion({
  taskId,
  moduleId,
  moduleTaskIds,
  nextTaskId,
  nextModule,
}: TaskCompletionProps) {
  const { done } = useDoneSet();
  const isDone = done.has(taskId);
  // Анимируем только отметку, сделанную на этой странице, а не состояние из хранилища.
  // «Нажали» само по себе не значит «сохранилось»: анимация идёт от фактического isDone,
  // так что при недоступном localStorage галочка не рисуется впустую.
  const [clicked, setClicked] = useState(false);
  const justDone = clicked && isDone;
  const moduleComplete = moduleTaskIds.every((id) => done.has(id));
  const showBanner = justDone && moduleComplete;

  const toggle = () => {
    if (isDone) {
      unmarkDone(taskId);
      setClicked(false);
    } else {
      markDone(taskId);
      setClicked(true);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={isDone}
          className={`inline-flex h-12 w-full items-center justify-center gap-3 px-7 font-semibold transition-colors duration-300 sm:w-auto ${
            isDone
              ? "border border-ink bg-paper text-ink hover:border-accent hover:text-accent"
              : "bg-accent text-accent-fg hover:bg-ink hover:text-paper"
          } ${justDone ? "stamp" : ""}`}
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
            <path d="M5 12l5 5L20 7" pathLength={1} className="check-draw" data-animate={justDone} />
          </svg>
          <span>{isDone ? t.task.unmarkDone : t.task.markDone}</span>
        </button>
        {nextTaskId && (
          <Link
            href={`/task/${nextTaskId}`}
            className="border-b border-muted text-[15px] text-muted hover:border-ink hover:text-ink"
          >
            {t.task.nextTask}: {nextTaskId}
          </Link>
        )}
      </div>
      {showBanner && (
        <aside role="status" className="rise flex flex-col gap-2 border-l-2 border-accent bg-accent-soft px-6 py-5">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">{t.task.moduleCompleteEyebrow}</p>
          <p className="font-serif text-2xl font-medium">{t.task.moduleCompleteTitle(moduleId)}</p>
          {nextModule ? (
            <Link
              href={`/module/${nextModule.id}`}
              className="group inline-flex items-center gap-2 text-[15px] text-body hover:text-accent"
            >
              <span>{t.task.moduleCompleteNext(moduleNumber(nextModule.id), nextModule.title)}</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ) : (
            <Link href="/finish" className="group inline-flex items-center gap-2 text-[15px] text-body hover:text-accent">
              <span>{t.task.courseComplete}</span>
              <span className="transition-transform group-hover:translate-x-1">{t.finish.open}</span>
            </Link>
          )}
        </aside>
      )}
    </>
  );
}
