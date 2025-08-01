import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold, coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";

export function MarkdownRenderer({ content }: { content: string }) {
  const { resolvedTheme } = useTheme();
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, className, children, style, ref, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match
            ? (
                <SyntaxHighlighter
                  language={match[1]}
                  style={resolvedTheme && resolvedTheme === "light" ? coldarkCold : coldarkDark}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
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
