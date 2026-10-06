/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from "react-markdown";

export default function Markdown({children}: {children: string}) {
  return (
    <ReactMarkdown
      components={{
        h2: ({node, ...p}) => (
          <h2
            className="mb-3 mt-10 font-display text-2xl text-ink first:mt-0"
            {...p}
          />
        ),
        h3: ({node, ...p}) => (
          <h3 className="mb-2 mt-8 font-display text-xl text-ink" {...p} />
        ),
        p: ({node, ...p}) => (
          <p className="mb-4 leading-relaxed text-sand-800" {...p} />
        ),
        ul: ({node, ...p}) => (
          <ul className="mb-4 list-disc space-y-1 pl-6 text-sand-800" {...p} />
        ),
        ol: ({node, ...p}) => (
          <ol
            className="mb-4 list-decimal space-y-1 pl-6 text-sand-800"
            {...p}
          />
        ),
        blockquote: ({node, ...p}) => (
          <blockquote
            className="mb-4 border-l-2 border-terracotta-300 pl-4 italic text-sand-700"
            {...p}
          />
        ),
        strong: ({node, ...p}) => (
          <strong className="font-semibold text-ink" {...p} />
        ),
        a: ({node, ...p}) => (
          <a
            className="text-terracotta-600 underline underline-offset-2 hover:text-terracotta-700"
            target="_blank"
            rel="noopener noreferrer"
            {...p}
          />
        ),
        pre: ({node, ...p}) => (
          <pre
            className="mb-4 overflow-x-auto rounded-lg bg-sand-1000 p-4 text-sm text-ivory"
            {...p}
          />
        ),
        code: ({node, className, ...p}) =>
          className ? (
            <code className={`${className} font-mono text-sm`} {...p} />
          ) : (
            <code
              className="rounded bg-sand-50 px-1.5 py-0.5 font-mono text-[0.85em]"
              {...p}
            />
          ),
      }}>
      {children}
    </ReactMarkdown>
  );
}
