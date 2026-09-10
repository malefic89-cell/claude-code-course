import { t } from "@/lib/i18n";
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

type Kind = "goal" | "steps" | "criterion" | "hints" | "other";

/** Роль секции по началу заголовка — задаёт оформление. */
function kindOf(heading: string | null): Kind {
  if (heading === null) return "other";
  if (heading.startsWith("Цель")) return "goal";
  if (heading.startsWith("Инструкция")) return "steps";
  if (heading.startsWith("Критерий")) return "criterion";
  if (heading.startsWith("Подсказк")) return "hints";
  return "other";
}

interface TaskBodyProps {
  body: string;
  /** Кнопка «Выполнено» и навигация — рендерятся в конце основной колонки. */
  footer: React.ReactNode;
}

/**
 * Тело задачи в две колонки: основной текст и поля.
 * Цель — как врезка, инструкция — шаги с антиквенными номерами,
 * критерий — под линейкой, подсказки — на полях, свёрнуты по умолчанию.
 */
export default function TaskBody({ body, footer }: TaskBodyProps) {
  const sections = splitSections(body);
  const hints = sections.filter((s) => kindOf(s.heading) === "hints");
  const main = sections.filter((s) => kindOf(s.heading) !== "hints");
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_18rem] lg:gap-12">
      <div className="flex min-w-0 flex-col gap-6 text-[17px] text-ink">
        {main.map((s, i) => {
          const kind = kindOf(s.heading);
          if (kind === "goal") {
            return (
              <div key={i} className="border-l-2 border-accent pl-5 text-lg leading-relaxed text-body [&>p:first-child]:mt-0">
                <Markdown>{s.content}</Markdown>
              </div>
            );
          }
          if (kind === "steps") {
            return (
              <div key={i} className="task-steps [&>ol:first-child]:mt-0">
                <Markdown>{s.content}</Markdown>
              </div>
            );
          }
          if (kind === "criterion") {
            return (
              <section key={i} className="border-t border-line pt-5">
                <h2 className="font-mono text-xs uppercase tracking-wider text-muted">{s.heading}</h2>
                <div className="[&>p]:mt-2">
                  <Markdown>{s.content}</Markdown>
                </div>
              </section>
            );
          }
          return (
            <section key={i}>
              {s.heading !== null && (
                <h2 className="font-serif text-xl font-medium">{s.heading}</h2>
              )}
              <Markdown>{s.content}</Markdown>
            </section>
          );
        })}
        {footer}
      </div>
      {hints.length > 0 && (
        <aside className="border-t border-line pt-6 text-[15px] text-body lg:sticky lg:top-8 lg:self-start lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1">
          {hints.map((s, i) => (
            <details key={i}>
              <summary className="cursor-pointer select-none font-serif text-xl font-medium text-ink marker:text-sm marker:text-dim hover:text-accent">
                {t.task.hintsSummary}
              </summary>
              <div className="[&_ul]:list-none [&_ul]:space-y-4 [&_ul]:pl-0 [&_li]:leading-relaxed">
                <Markdown>{s.content}</Markdown>
              </div>
            </details>
          ))}
        </aside>
      )}
    </div>
  );
}
