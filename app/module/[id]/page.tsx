import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getModuleTasks, getModules, type TaskMeta } from "@/lib/content";
import { t } from "@/lib/i18n";
import TaskList from "@/components/TaskList";

export function generateStaticParams() {
  return getModules().map((m) => ({ id: m.id }));
}

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mod = getModule(id);
  if (!mod) notFound();
  // Клиентскому списку нужны только метаданные, без Markdown-тел задач.
  const tasks: TaskMeta[] = getModuleTasks(mod.id).map(
    ({ id, module, title, difficulty, estimated_minutes, verified_date }) => ({
      id,
      module,
      title,
      difficulty,
      estimated_minutes,
      verified_date,
    }),
  );
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        {t.module.backToModules}
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{t.module.heading(mod.id, mod.title)}</h1>
      <p className="mt-1 text-gray-600">{mod.description}</p>
      <p className="mt-1 text-xs text-gray-400">{t.module.taskCount(tasks.length)}</p>
      <div className="mt-6">
        <TaskList tasks={tasks} />
      </div>
    </main>
  );
}
