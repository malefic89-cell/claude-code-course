import { getModules, getModuleTasks, type TaskMeta } from "@/lib/content";
import FinishScreen from "@/components/FinishScreen";

/** Финальный экран курса: сводка, ссылка на «Полку» ученика, что дальше. */
export default function FinishPage() {
  const modules = getModules();
  // Клиентскому экрану нужны только метаданные задач, без Markdown-тел.
  const tasks: TaskMeta[] = modules.flatMap((m) =>
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
  return <FinishScreen moduleCount={modules.length} tasks={tasks} />;
}
