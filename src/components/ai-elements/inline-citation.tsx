/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
"use client";

import type { ComponentProps } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { createContext, use, useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { cn } from "@/lib/utils";

export type InlineCitationProps = ComponentProps<"span">;

export function InlineCitation({
  className,
  ...props
}: InlineCitationProps) {
  return (
    <span
      className={cn("group inline items-center gap-1", className)}
      {...props}
    />
  );
}

export type InlineCitationTextProps = ComponentProps<"span">;

export function InlineCitationText({
  className,
  ...props
}: InlineCitationTextProps) {
  return (
    <span
      className={cn("transition-colors group-hover:bg-accent", className)}
      {...props}
    />
  );
}

export type InlineCitationCardProps = ComponentProps<typeof HoverCard>;

export function InlineCitationCard(props: InlineCitationCardProps) {
  return <HoverCard closeDelay={0} openDelay={0} {...props} />;
}

export type InlineCitationCardTriggerProps = ComponentProps<typeof Badge> & {
  sources: string[];
};

export function InlineCitationCardTrigger({
  sources,
  className,
  ...props
}: InlineCitationCardTriggerProps) {
  return (
    <HoverCardTrigger asChild>
      <Badge
        className={cn("ml-1 rounded-full", className)}
        variant="secondary"
        {...props}
      >
        {sources.length
          ? (
              <>
                {new URL(sources[0]).hostname}
                {" "}
                {sources.length > 1 && `+${sources.length - 1}`}
              </>
            )
          : (
              "unknown"
            )}
      </Badge>
    </HoverCardTrigger>
  );
}

export type InlineCitationCardBodyProps = ComponentProps<"div">;

export function InlineCitationCardBody({
  className,
  ...props
}: InlineCitationCardBodyProps) {
  return <HoverCardContent className={cn("relative w-80 p-0", className)} {...props} />;
}

const CarouselApiContext = createContext<CarouselApi | undefined>(undefined);

function useCarouselApi() {
  const context = use(CarouselApiContext);
  return context;
}

export type InlineCitationCarouselProps = ComponentProps<typeof Carousel>;

export function InlineCitationCarousel({
  className,
  children,
  ...props
}: InlineCitationCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <CarouselApiContext value={api}>
      <Carousel className={cn("w-full", className)} setApi={setApi} {...props}>
        {children}
      </Carousel>
    </CarouselApiContext>
  );
}

export type InlineCitationCarouselContentProps = ComponentProps<"div">;

export function InlineCitationCarouselContent(props: InlineCitationCarouselContentProps) {
  return <CarouselContent {...props} />;
}

export type InlineCitationCarouselItemProps = ComponentProps<"div">;

export function InlineCitationCarouselItem({
  className,
  ...props
}: InlineCitationCarouselItemProps) {
  return (
    <CarouselItem
      className={cn("w-full space-y-2 p-4 pl-8", className)}
      {...props}
    />
  );
}

export type InlineCitationCarouselHeaderProps = ComponentProps<"div">;

export function InlineCitationCarouselHeader({
  className,
  ...props
}: InlineCitationCarouselHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2",
        className,
      )}
      {...props}
    />
  );
}

export type InlineCitationCarouselIndexProps = ComponentProps<"div">;

export function InlineCitationCarouselIndex({
  children,
  className,
  ...props
}: InlineCitationCarouselIndexProps) {
  const api = useCarouselApi();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-end px-3 py-1 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? `${current}/${count}`}
    </div>
  );
}

export type InlineCitationCarouselPrevProps = ComponentProps<"button">;

export function InlineCitationCarouselPrev({
  className,
  ...props
}: InlineCitationCarouselPrevProps) {
  const api = useCarouselApi();

  const handleClick = useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  return (
    <button
      aria-label="Previous"
      className={cn("shrink-0", className)}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <ArrowLeftIcon className="size-4 text-muted-foreground" />
    </button>
  );
}

export type InlineCitationCarouselNextProps = ComponentProps<"button">;

export function InlineCitationCarouselNext({
  className,
  ...props
}: InlineCitationCarouselNextProps) {
  const api = useCarouselApi();

  const handleClick = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  return (
    <button
      aria-label="Next"
      className={cn("shrink-0", className)}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <ArrowRightIcon className="size-4 text-muted-foreground" />
    </button>
  );
}

export type InlineCitationSourceProps = ComponentProps<"div"> & {
  title?: string;
  url?: string;
  description?: string;
};

export function InlineCitationSource({
  title,
  url,
  description,
  className,
  children,
  ...props
}: InlineCitationSourceProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {title && (
        <h4 className="truncate text-sm leading-tight font-medium">{title}</h4>
      )}
      {url && (
        <p className="truncate text-xs break-all text-muted-foreground">{url}</p>
      )}
      {description && (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export type InlineCitationQuoteProps = ComponentProps<"blockquote">;

export function InlineCitationQuote({
  children,
  className,
  ...props
}: InlineCitationQuoteProps) {
  return (
    <blockquote
      className={cn(
        "border-l-2 border-muted pl-3 text-sm text-muted-foreground italic",
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
}
