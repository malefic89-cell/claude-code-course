import Link from "next/link";
import { getModules } from "@/lib/content";

export default function Home() {
  const modules = getModules();
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Claude Code Course</h1>
      <p className="mt-1 text-sm text-gray-500">Каркас (этап 2). Полный UI — этап 3.</p>
      <ul className="mt-6 space-y-3">
        {modules.map((m) => (
          <li key={m.id} className="rounded-lg border p-4">
            <Link href={`/module/${m.id}`} className="font-semibold hover:underline">
              Модуль {m.id}. {m.title}
            </Link>
            <p className="mt-1 text-sm text-gray-600">{m.description}</p>
            <p className="mt-1 text-xs text-gray-400">{m.tasks.length} задач</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
