import type { ReasoningUIPart } from "@/types";

import { CircleCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ReasoningDisplay({ index, part }: { index: number; part: ReasoningUIPart }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={`reasoning-${index}`} className="outline-none">
        <AccordionTrigger className="justify-start py-0 text-muted-foreground outline-none hover:no-underline">
          Thought for a couple of seconds
        </AccordionTrigger>
        <AccordionContent className="m-0">
          {part.text.split("\n").map((paragraph, pIndex) => {
            if (paragraph.trim() === "")
              return null;
            // eslint-disable-next-line react/no-array-index-key
            return <p key={`paragraph-${pIndex}`} className="m-0 text-sm text-muted-foreground last:mb-0">{paragraph}</p>;
          })}

          {part.state === "done" && (
            <div className="flex items-center gap-1">
              <CircleCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Done</span>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
