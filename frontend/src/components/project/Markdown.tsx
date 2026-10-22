/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from "react-markdown";

export default function Markdown({children}: {children: string}) {
  return (
    <ReactMarkdown
      components={{
        h1: ({node, ...p}) => (
          <h1
            className="mb-4 mt-10 font-display text-3xl text-ink first:mt-0"
            {...p}
          />
        ),
        h2: ({node, ...p}) => (
          <h2
            className="mb-3 mt-10 border-b border-sand-200 pb-2 font-display text-2xl text-ink first:mt-0"
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
          <ul
            className="mb-4 list-disc space-y-1.5 pl-6 text-sand-800 marker:text-terracotta-500"
            {...p}
          />
        ),
        ol: ({node, ...p}) => (
          <ol
            className="mb-4 list-decimal space-y-1.5 pl-6 text-sand-800 marker:font-mono marker:text-terracotta-600"
            {...p}
          />
        ),
        blockquote: ({node, ...p}) => (
          <blockquote
            className="mb-4 rounded-r-lg border-l-2 border-terracotta-400 bg-sand-50/70 py-2.5 pl-4 pr-3 italic text-sand-700"
            {...p}
          />
        ),
        hr: ({node, ...p}) => <hr className="my-8 border-sand-200" {...p} />,
        strong: ({node, ...p}) => (
          <strong className="font-semibold text-ink" {...p} />
        ),
        a: ({node, ...p}) => (
          <a
            className="font-medium text-terracotta-600 underline decoration-terracotta-300 underline-offset-4 transition hover:text-terracotta-700"
            target="_blank"
            rel="noopener noreferrer"
            {...p}
          />
        ),
        pre: ({node, ...p}) => (
          <pre
            className="mb-5 overflow-x-auto rounded-xl border border-sand-800 bg-ink p-4 text-sm text-ivory shadow-inner"
            {...p}
          />
        ),
        code: ({node, className, ...p}) =>
          className ? (
            <code className={`${className} font-mono text-sm`} {...p} />
          ) : (
            <code
              className="rounded border border-sand-200 bg-sand-50 px-1.5 py-0.5 font-mono text-[0.85em] text-terracotta-700"
              {...p}
            />
          ),
      }}>
      {children}
    </ReactMarkdown>
  );
}
