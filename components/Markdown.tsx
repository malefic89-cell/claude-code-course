import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string;
}

/** Рендер Markdown-текста задачи с оформлением под Tailwind. */
export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: (props) => <h2 className="mt-6 text-lg font-semibold" {...props} />,
        h3: (props) => <h3 className="mt-4 font-semibold" {...props} />,
        p: (props) => <p className="mt-3 leading-relaxed" {...props} />,
        ul: (props) => <ul className="mt-3 list-disc space-y-1.5 pl-5" {...props} />,
        ol: (props) => <ol className="mt-3 list-decimal space-y-1.5 pl-5" {...props} />,
        li: (props) => <li className="leading-relaxed" {...props} />,
        a: (props) => (
          <a className="text-emerald-700 underline hover:text-emerald-900" {...props} />
        ),
        pre: (props) => (
          <pre
            className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-sm text-gray-100"
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
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[0.9em]" {...props} />
          );
        },
        blockquote: (props) => (
          <blockquote className="mt-3 border-l-4 border-gray-200 pl-3 text-gray-600" {...props} />
        ),
        table: (props) => (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm" {...props} />
          </div>
        ),
        th: (props) => <th className="border px-2 py-1 text-left font-semibold" {...props} />,
        td: (props) => <td className="border px-2 py-1 align-top" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
