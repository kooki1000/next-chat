import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[80%] items-start gap-3">
        <div className="rounded-2xl bg-muted px-4 py-3 text-sm">{content}</div>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
