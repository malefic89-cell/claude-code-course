import { getModules } from "@/lib/content";
import { t } from "@/lib/i18n";
import ModuleCard from "@/components/ModuleCard";
import OverallProgress from "@/components/OverallProgress";

export default function Home() {
  const modules = getModules();
  const allTaskIds = modules.flatMap((m) => m.tasks);
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">{t.siteTitle}</h1>
      <p className="mt-1 text-sm text-gray-500">{t.home.intro}</p>
      <div className="mt-6">
        <OverallProgress taskIds={allTaskIds} />
      </div>
      <ul className="mt-6 space-y-3">
        {modules.map((m) => (
          <li key={m.id}>
            <ModuleCard module={m} />
          </li>
        ))}
      </ul>
    </main>
  );
}
