import { Search } from "lucide-react";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  onSearchToggle?: () => void;
  searchEnabled?: boolean;
}

export function ModelSelector({
  selectedModel = "gpt-4",
  onModelChange,
  onSearchToggle,
  searchEnabled = false,
}: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        defaultValue={selectedModel}
        onValueChange={onModelChange}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4">GPT-4</SelectItem>
          <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
          <SelectItem value="claude">Claude 3</SelectItem>
          <SelectItem value="gemini">Gemini Pro</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={searchEnabled ? "default" : "ghost"}
        size="sm"
        onClick={onSearchToggle}
        title={searchEnabled ? "Disable internet search" : "Enable internet search"}
      >
        <Search className="mr-1 h-4 w-4" />
        <span>Search</span>
      </Button>
    </div>
  );
}
