import Link from "next/link";
import { getModules, getModuleTasks, type TaskMeta } from "@/lib/content";
import { t } from "@/lib/i18n";
import ModuleCard from "@/components/ModuleCard";
import ProgressCard from "@/components/ProgressCard";
import StartButton from "@/components/StartButton";

export default function Home() {
  const modules = getModules();
  // Клиентским компонентам нужны только метаданные, без Markdown-тел задач.
  const tasksByModule = modules.map((m) =>
    getModuleTasks(m.id).map(
      ({ id, module, title, difficulty, estimated_minutes, verified_date }): TaskMeta => ({
        id,
        module,
        title,
        difficulty,
        estimated_minutes,
        verified_date,
      }),
    ),
  );
  const allTasks = tasksByModule.flat();
  return (
    <main className="page-in max-w-5xl">
      <section className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">
            {t.home.eyebrow(modules.length, allTasks.length)}
          </p>
          <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {t.home.titleStart}
            <em className="text-accent">{t.home.titleEmphasis}</em>
            {t.home.titleEnd}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-body sm:text-xl">{t.home.intro}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            <StartButton taskIds={allTasks.map((task) => task.id)} />
            <Link
              href="#programme"
              className="border-b border-muted text-[15px] text-muted hover:border-ink hover:text-ink"
            >
              {t.home.viewProgramme}
            </Link>
          </div>
        </div>
        <ProgressCard tasks={allTasks} />
      </section>

      <section id="programme" className="pb-16 sm:pb-20">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink pb-3">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t.home.programmeTitle}</h2>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">{t.home.programmeNote}</p>
        </div>
        <ul>
          {modules.map((m, i) => (
            <li key={m.id}>
              <ModuleCard
                module={m}
                minutes={tasksByModule[i].reduce((sum, task) => sum + task.estimated_minutes, 0)}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
