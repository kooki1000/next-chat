/* eslint-disable react/no-context-provider */
"use client";

import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Provider> & {
  delayDuration?: number;
}) {
  return (
    <BaseTooltip.Provider
      data-slot="tooltip-provider"
      closeDelay={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof BaseTooltip.Root>) {
  return (
    <TooltipProvider>
      <BaseTooltip.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof BaseTooltip.Trigger>) {
  return <BaseTooltip.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  align = "center",
  sideOffset = 8,
  side = "top",
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup> & {
  align?: BaseTooltip.Positioner.Props["align"];
  side?: BaseTooltip.Positioner.Props["side"];
  sideOffset?: BaseTooltip.Positioner.Props["sideOffset"];
}) {
  return (
    <BaseTooltip.Portal data-slot="tooltip-portal">
      <BaseTooltip.Positioner data-slot="tooltip-positioner" sideOffset={sideOffset} align={align} side={side}>
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-primary px-3 py-1.5 text-xs text-balance text-primary-foreground fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
          <BaseTooltip.Arrow data-slot="tooltip-arrow" className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-primary fill-primary" />
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
