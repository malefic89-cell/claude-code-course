import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getModuleTasks, getModules } from "@/lib/content";

export function generateStaticParams() {
  return getModules().map((m) => ({ id: m.id }));
}

export default function ModulePage({ params }: { params: { id: string } }) {
  const mod = getModule(params.id);
  if (!mod) notFound();
  const tasks = getModuleTasks(mod.id);
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href="/" className="text-sm text-gray-500 hover:underline">← Все модули</Link>
      <h1 className="mt-2 text-2xl font-bold">Модуль {mod.id}. {mod.title}</h1>
      <p className="mt-1 text-gray-600">{mod.description}</p>
      <ul className="mt-6 space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="rounded-lg border p-3">
            <Link href={`/task/${t.id}`} className="hover:underline">
              {t.id}. {t.title}
            </Link>
            <span className="ml-2 text-xs text-gray-400">
              {t.difficulty} · ~{t.estimated_minutes} мин
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
