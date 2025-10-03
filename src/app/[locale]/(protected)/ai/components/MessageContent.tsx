"use client";

import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  className?: string;
};

export default function MessageContent({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({
          inline,
          children,
          ...props
        }: {
          inline?: boolean;
          children?: React.ReactNode;
        } & React.HTMLAttributes<HTMLElement>) {
          if (inline) {
            return (
              <code
                {...props}
                className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-800"
              >
                {children}
              </code>
            );
          }
          return (
            <pre
              {...props}
              className="overflow-auto rounded bg-gray-900 p-3 text-sm text-white"
            >
              <code>{children}</code>
            </pre>
          );
        },
        a({ children, ...props }) {
          return (
            <a
              {...props}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        strong({ children, ...props }) {
          return (
            <strong {...props} className="font-semibold">
              {children}
            </strong>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
