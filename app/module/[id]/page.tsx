import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getModuleTasks, getModules, type TaskMeta } from "@/lib/content";
import { moduleNumber, t } from "@/lib/i18n";
import ModuleSummary from "@/components/ModuleSummary";
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
    <main className="page-in max-w-5xl py-8 sm:py-12">
      <Link href="/" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink">
        {t.module.backToModules}
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <header className="flex flex-col gap-4">
          <p className="font-numeral text-7xl font-bold leading-[0.9] text-accent sm:text-8xl">
            {moduleNumber(mod.id).padStart(2, "0")}
          </p>
          <h1 className="font-serif text-3xl font-medium leading-tight">{mod.title}</h1>
          <p className="text-[15px] leading-relaxed text-body">{mod.description}</p>
          <ModuleSummary tasks={tasks} />
        </header>
        <TaskList tasks={tasks} />
      </div>
    </main>
  );
}
