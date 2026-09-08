import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentTaskIds, getModules, getTask } from "@/lib/content";
import { moduleNumber, t } from "@/lib/i18n";
import DifficultyBadge from "@/components/DifficultyBadge";
import TaskBody from "@/components/TaskBody";
import TaskCompletion from "@/components/TaskCompletion";

export function generateStaticParams() {
  return getModules().flatMap((m) => m.tasks.map((id) => ({ id })));
}

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = getTask(id);
  if (!task) notFound();
  const { prev, next } = getAdjacentTaskIds(task.id);
  const prevTask = prev ? getTask(prev) : null;
  const nextTask = next ? getTask(next) : null;
  const modules = getModules();
  const moduleIndex = modules.findIndex((m) => m.id === task.module);
  const moduleTaskIds = modules[moduleIndex]?.tasks ?? [];
  const nextModule = modules[moduleIndex + 1] ?? null;

  const footer = (
    <>
      <TaskCompletion
        taskId={task.id}
        moduleId={task.module}
        moduleTaskIds={moduleTaskIds}
        nextTaskId={nextTask?.id ?? null}
        nextModule={nextModule ? { id: nextModule.id, title: nextModule.title } : null}
      />
      <nav className="flex justify-between gap-6 border-t border-line pt-5 text-sm">
        {prevTask ? (
          <Link href={`/task/${prevTask.id}`} className="group min-w-0">
            <span className="block font-mono text-xs uppercase tracking-wider text-muted">
              ←{" "}
              {prevTask.module === task.module
                ? t.task.prevTask
                : t.task.prevInModule(moduleNumber(prevTask.module))}
            </span>
            <span className="block truncate text-body group-hover:text-accent">{prevTask.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {nextTask ? (
          <Link href={`/task/${nextTask.id}`} className="group min-w-0 text-right">
            <span className="block font-mono text-xs uppercase tracking-wider text-muted">
              {nextTask.module === task.module
                ? t.task.nextTask
                : t.task.nextInModule(moduleNumber(nextTask.module))}{" "}
              →
            </span>
            <span className="block truncate text-body group-hover:text-accent">{nextTask.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );

  return (
    <main className="page-in max-w-5xl py-8 sm:py-12">
      <Link
        href={`/module/${task.module}`}
        className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink"
      >
        {t.task.backToModule(task.module)}
      </Link>
      <header className="mt-6 flex flex-col gap-5">
        <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wider text-muted">
          <span className="text-accent">{t.task.eyebrow(task.module, task.id)}</span>
          <DifficultyBadge difficulty={task.difficulty} />
          <span>{t.task.minutes(task.estimated_minutes)}</span>
        </p>
        <h1 className="font-serif text-3xl font-medium leading-tight sm:text-4xl lg:text-[42px]">
          {task.title}
        </h1>
      </header>
      <div className="mt-8">
        <TaskBody body={task.body} footer={footer} />
      </div>
    </main>
  );
}
