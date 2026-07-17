import Markdown from "@/components/Markdown";

interface Section {
  /** Текст заголовка `##` или null для преамбулы. */
  heading: string | null;
  content: string;
}

/** Разбивает Markdown-тело задачи на секции по заголовкам `##`. */
function splitSections(body: string): Section[] {
  const sections: Section[] = [];
  let current: Section = { heading: null, content: "" };
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^```/.test(line)) inFence = !inFence;
    const m = !inFence ? line.match(/^##\s+(.+?)\s*$/) : null;
    if (m) {
      if (current.heading !== null || current.content.trim() !== "") sections.push(current);
      current = { heading: m[1], content: "" };
    } else {
      current.content += line + "\n";
    }
  }
  if (current.heading !== null || current.content.trim() !== "") sections.push(current);
  return sections;
}

function isHints(heading: string | null): boolean {
  return heading !== null && heading.startsWith("Подсказк");
}

interface TaskBodyProps {
  body: string;
}

/**
 * Тело задачи: секции по `##` (Цель / Инструкция / Критерий / Подсказки).
 * Секция подсказок сворачивается в <details> и по умолчанию скрыта.
 */
export default function TaskBody({ body }: TaskBodyProps) {
  return (
    <div className="text-[15px] text-gray-800">
      {splitSections(body).map((s, i) =>
        isHints(s.heading) ? (
          <details key={i} className="mt-6 rounded-xl border bg-amber-50/60 p-4">
            <summary className="cursor-pointer select-none font-semibold">{s.heading}</summary>
            <Markdown>{s.content}</Markdown>
          </details>
        ) : (
          <section key={i}>
            {s.heading !== null && <h2 className="mt-6 text-lg font-semibold">{s.heading}</h2>}
            <Markdown>{s.content}</Markdown>
          </section>
        ),
      )}
    </div>
  );
}
