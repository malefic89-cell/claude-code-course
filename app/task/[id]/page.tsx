import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentTaskIds, getModules, getTask } from "@/lib/content";
import { t } from "@/lib/i18n";
import DifficultyBadge from "@/components/DifficultyBadge";
import TaskBody from "@/components/TaskBody";
import TaskDoneButton from "@/components/TaskDoneButton";

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
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <Link href={`/module/${task.module}`} className="text-sm text-gray-500 hover:underline">
        {t.task.backToModule(task.module)}
      </Link>
      <h1 className="mt-2 text-xl font-bold sm:text-2xl">
        {task.id}. {task.title}
      </h1>
      <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <DifficultyBadge difficulty={task.difficulty} />
        {t.task.minutes(task.estimated_minutes)}
      </p>
      <div className="mt-4">
        <TaskBody body={task.body} />
      </div>
      <div className="mt-8">
        <TaskDoneButton taskId={task.id} />
      </div>
      <nav className="mt-8 flex justify-between gap-4 border-t pt-4 text-sm">
        {prevTask ? (
          <Link href={`/task/${prevTask.id}`} className="min-w-0 text-gray-600 hover:underline">
            <span className="block text-xs text-gray-400">{t.task.prevTask}</span>
            <span className="block truncate">{prevTask.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {nextTask ? (
          <Link
            href={`/task/${nextTask.id}`}
            className="min-w-0 text-right text-gray-600 hover:underline"
          >
            <span className="block text-xs text-gray-400">{t.task.nextTask}</span>
            <span className="block truncate">{nextTask.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
