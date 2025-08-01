import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy, Download, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold, coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface CodeBlockProps {
  language: string;
  code: string;
  className?: string;
}

export function CodeBlock({ language, code, className = "" }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [_copiedText, copyToClipboard] = useCopyToClipboard();

  // TODO: Implement download functionality
  const handleDownload = () => {};

  // TODO: Implement expand functionality
  const handleExpand = () => {};

  const iconButtons = [
    {
      Icon: Download,
      onClick: handleDownload,
      title: "Download",
    },
    {
      Icon: Copy,
      onClick: () => copyToClipboard(code),
      title: "Copy code",
    },
    {
      Icon: Menu,
      onClick: handleExpand,
      title: "Expand",
    },
  ];

  return (
    <div className={cn("group relative", className)}>
      {/* Code block header */}
      <div className="flex items-center justify-between rounded-t-md border border-border bg-muted/50 px-4 py-2">
        <span className="text-sm font-medium text-muted-foreground">
          {language}
        </span>

        <div className="flex items-center space-x-1">
          {iconButtons.map(({ Icon, onClick, title }) => (
            <Tooltip key={title}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-muted"
                  onClick={onClick}
                >
                  <Icon className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>{title}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <SyntaxHighlighter
        language={language}
        style={resolvedTheme && resolvedTheme === "light" ? coldarkCold : coldarkDark}
        className="!mt-0 rounded-md rounded-t-none"
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
