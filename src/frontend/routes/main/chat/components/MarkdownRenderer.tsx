import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { CodeBlock } from "@/components/CodeBlock";

import "katex/dist/katex.min.css";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, className, children, style, ref, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeContent = String(children).replace(/\n$/, "");

          return match
            ? (
                <CodeBlock
                  language={match[1]}
                  code={codeContent}
                />
              )
            : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
        },
        pre({ node, children, ...props }) {
          return (
            // eslint-disable-next-line better-tailwindcss/no-unregistered-classes
            <pre className="not-prose max-w-full overflow-x-auto" {...props}>
              {children}
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
