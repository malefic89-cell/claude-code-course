"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { TaskMeta } from "@/lib/content";
import { t } from "@/lib/i18n";
import { getProgressSnapshot, getServerProgressSnapshot, reset, setShelfUrl, subscribe } from "@/lib/progress";

interface FinishScreenProps {
  moduleCount: number;
  /** Все задачи курса в порядке прохождения (метаданные). */
  tasks: TaskMeta[];
}

/** Адрес считается ссылкой, если начинается со схемы http(s). */
function isUrl(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value.trim());
}

/**
 * Финальный экран. Пока курс не пройден целиком — заглушка с прогрессом и
 * ссылкой на следующую задачу. После — сводка, поле для ссылки на «Полку»
 * (хранится в прогрессе), список того, что умеет продукт, и «что дальше».
 */
export default function FinishScreen({ moduleCount, tasks }: FinishScreenProps) {
  const progress = useSyncExternalStore(subscribe, getProgressSnapshot, getServerProgressSnapshot);
  const done = new Set(progress.done);
  const doneCount = tasks.filter((task) => done.has(task.id)).length;
  const complete = tasks.length > 0 && doneCount === tasks.length;
  const next = tasks.find((task) => !done.has(task.id)) ?? null;
  const hours = Math.round(tasks.reduce((sum, task) => sum + task.estimated_minutes, 0) / 60);

  const saved = progress.shelfUrl ?? null;
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const showForm = saved === null || editing;

  const save = () => {
    if (!isUrl(draft)) {
      setError(true);
      return;
    }
    setShelfUrl(draft);
    setError(false);
    setEditing(false);
    setDraft("");
  };

  const copy = async () => {
    if (!saved) return;
    try {
      await navigator.clipboard.writeText(saved);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Буфер обмена недоступен — ссылка остаётся на экране, её можно выделить.
    }
  };

  if (!complete) {
    return (
      <main className="page-in max-w-3xl py-8 sm:py-12">
        <Link href="/" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink">
          {t.finish.backHome}
        </Link>
        <p className="mt-10 font-mono text-xs uppercase tracking-wider text-accent">{t.finish.lockedEyebrow}</p>
        <h1 className="mt-4 font-serif text-3xl font-medium leading-tight sm:text-4xl">
          {t.finish.lockedTitle(doneCount, tasks.length)}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-body">{t.finish.lockedText}</p>
        {next && (
          <Link
            href={`/task/${next.id}`}
            className="group mt-8 inline-flex items-center gap-2 border-b border-muted text-[15px] text-body hover:border-ink hover:text-accent"
          >
            <span>{t.finish.lockedNext(next.id, next.title)}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        )}
      </main>
    );
  }

  return (
    <main className="page-in max-w-3xl py-8 sm:py-12">
      <Link href="/" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink">
        {t.finish.backHome}
      </Link>

      <header className="mt-10 flex flex-col gap-5">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">{t.finish.eyebrow}</p>
        <h1 className="font-serif text-4xl font-medium leading-tight sm:text-5xl lg:text-[56px]">{t.finish.title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-body">{t.finish.intro}</p>
      </header>

      <dl className="mt-10 grid grid-cols-3 gap-6 border-y border-line py-6">
        {[
          [moduleCount, t.finish.statModules],
          [tasks.length, t.finish.statTasks],
          [hours, t.finish.statHours],
        ].map(([value, label]) => (
          <div key={label} className="flex flex-col gap-1">
            <dd className="font-numeral text-4xl font-bold leading-none text-accent sm:text-5xl">{value}</dd>
            <dt className="text-sm text-muted">{label}</dt>
          </div>
        ))}
      </dl>

      <section className="mt-10 border border-accent-line bg-accent-soft p-6 sm:p-7">
        <h2 className="font-serif text-2xl font-medium">{t.finish.shelfTitle}</h2>
        {showForm ? (
          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <p className="text-[15px] leading-relaxed text-body">{t.finish.shelfIntro}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                inputMode="url"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setError(false);
                }}
                placeholder={saved ?? t.finish.shelfPlaceholder}
                aria-label={t.finish.shelfTitle}
                aria-invalid={error}
                className="h-12 min-w-0 flex-1 border border-line bg-paper px-4 font-mono text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center bg-accent px-6 font-semibold text-accent-fg transition-colors hover:bg-ink hover:text-paper"
              >
                {t.finish.shelfSave}
              </button>
            </div>
            {error && <p className="text-sm text-danger">{t.finish.shelfInvalid}</p>}
          </form>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            <a
              href={saved}
              target="_blank"
              rel="noreferrer"
              className="break-all font-mono text-sm text-accent underline-offset-4 hover:underline"
            >
              {saved}
            </a>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <a
                href={saved}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center bg-accent px-6 font-semibold text-accent-fg transition-colors hover:bg-ink hover:text-paper"
              >
                {t.finish.shelfOpen}
              </a>
              <button
                type="button"
                onClick={copy}
                className="inline-flex h-11 items-center border border-ink bg-paper px-6 font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {copied ? t.finish.shelfCopied : t.finish.shelfCopy}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(saved);
                  setEditing(true);
                }}
                className="self-center border-b border-muted text-[15px] text-muted hover:border-ink hover:text-ink"
              >
                {t.finish.shelfChange}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-medium">{t.finish.builtTitle}</h2>
        <ul className="mt-5 flex flex-col gap-3">
          {t.finish.built.map((item, i) => (
            <li key={item} className="flex gap-4 text-[17px] leading-relaxed text-body">
              <span className="font-numeral text-lg font-bold leading-relaxed text-accent">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-serif text-2xl font-medium">{t.finish.nextTitle}</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-body">{t.finish.nextText}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 border-b border-muted text-[15px] text-muted hover:border-ink hover:text-ink"
        >
          {t.finish.restart}
        </button>
      </section>
    </main>
  );
}
