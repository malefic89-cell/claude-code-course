import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string;
}

/** Рендер Markdown-текста задачи в стиле «Журнал». */
export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: (props) => <h2 className="mt-6 font-serif text-xl font-medium" {...props} />,
        h3: (props) => <h3 className="mt-4 font-semibold" {...props} />,
        p: (props) => <p className="mt-3 leading-relaxed" {...props} />,
        ul: (props) => <ul className="mt-3 list-disc space-y-1.5 pl-5" {...props} />,
        ol: (props) => <ol className="mt-3 list-decimal space-y-3 pl-5" {...props} />,
        li: (props) => <li className="leading-relaxed" {...props} />,
        a: (props) => <a className="text-accent underline hover:text-ink" {...props} />,
        pre: (props) => (
          <pre
            className="mt-3 overflow-x-auto bg-code-bg px-5 py-4 font-mono text-sm leading-relaxed text-code-fg"
            {...props}
          />
        ),
        code: (props) => {
          // Внутри <pre> стили задаёт pre; инлайновый код оформляем сам.
          // Блочный код: fenced-блок с языком (language-*) или многострочный.
          const isBlock =
            /language-/.test(props.className ?? "") || /\n/.test(String(props.children));
          return isBlock ? (
            <code {...props} />
          ) : (
            <code className="bg-accent-soft px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />
          );
        },
        blockquote: (props) => (
          <blockquote className="mt-3 border-l-2 border-ink pl-4 text-body" {...props} />
        ),
        table: (props) => (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm" {...props} />
          </div>
        ),
        th: (props) => (
          <th className="border-b border-ink px-2 py-1 text-left font-semibold" {...props} />
        ),
        td: (props) => <td className="border-b border-line px-2 py-1 align-top" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
