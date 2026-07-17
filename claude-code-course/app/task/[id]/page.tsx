import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentTaskIds, getModules, getTask } from "@/lib/content";

export function generateStaticParams() {
  return getModules().flatMap((m) => m.tasks.map((id) => ({ id })));
}

export default function TaskPage({ params }: { params: { id: string } }) {
  const task = getTask(params.id);
  if (!task) notFound();
  const { prev, next } = getAdjacentTaskIds(task.id);
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link href={`/module/${task.module}`} className="text-sm text-gray-500 hover:underline">
        ← Модуль {task.module}
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{task.id}. {task.title}</h1>
      <p className="mt-1 text-xs text-gray-400">{task.difficulty} · ~{task.estimated_minutes} мин</p>
      <pre className="mt-6 whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-sm">
        {task.body}
      </pre>
      <div className="mt-6 flex justify-between text-sm">
        {prev ? <Link href={`/task/${prev}`} className="hover:underline">← {prev}</Link> : <span />}
        {next ? <Link href={`/task/${next}`} className="hover:underline">{next} →</Link> : <span />}
      </div>
    </main>
  );
}
