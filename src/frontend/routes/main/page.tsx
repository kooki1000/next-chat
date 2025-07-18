import { useNetworkState } from "@uidotdev/usehooks";
import { useConvexAuth, useMutation } from "convex/react";
import { Code, GraduationCap, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { InputBox } from "@/components/InputBox";
import { ModelSelector } from "@/components/ModelSelector";
import { Button } from "@/components/ui/button";

import { api } from "@/convex/_generated/api";
import { useGlobalEnterKey } from "@/hooks/use-global-enter-key";
import { usePromptStore } from "@/stores/prompt-store";

const categories = [
  { icon: Sparkles, label: "Create", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  { icon: Search, label: "Explore", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { icon: Code, label: "Code", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { icon: GraduationCap, label: "Learn", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
];

const examplePrompts = [
  "How does AI work?",
  "Are black holes real?",
  "How many Rs are in the word \"strawberry\"?",
  "What is the meaning of life?",
];

export function MainPage() {
  const navigate = useNavigate();

  // Network and authentication states
  const { isAuthenticated } = useConvexAuth();
  const { online: isOnline } = useNetworkState();

  // Mutations for creating threads and messages
  const createThread = useMutation(api.threads.createThread);
  const createClientMessage = useMutation(api.messages.createClientMessage);

  const { prompt, setPrompt, handleSendMessage } = usePromptStore();
  const inputBoxRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus the input box when the component mounts
  useEffect(() => {
    inputBoxRef.current?.focus();
  }, []);

  const onSendMessage = useCallback(() => {
    handleSendMessage(
      isOnline,
      isAuthenticated,
      createThread,
      createClientMessage,
      navigate,
    );
  }, [handleSendMessage, isOnline, isAuthenticated, createThread, createClientMessage, navigate]);

  useGlobalEnterKey({
    onEnter: onSendMessage,
    hasContent: !!prompt.trim(),
  });

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">How can I help you?</h1>

        {/* Category Buttons */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map(category => (
            <Button key={category.label} variant="secondary" className={`gap-2 ${category.color}`}>
              <category.icon className="h-4 w-4" />
              <span>{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Example Prompts */}
        <div className="mb-8 space-y-3">
          {examplePrompts.map((example, index) => (
            <Button
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setPrompt(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Input Area */}
      <div className="w-full max-w-3xl">
        <InputBox
          ref={inputBoxRef}
          value={prompt}
          onChange={setPrompt}
          onSend={onSendMessage}
          className="min-h-[120px]"
        />

        {/* Bottom Controls */}
        <div className="mt-4 flex items-center justify-between">
          <ModelSelector />

          <div className="text-xs text-muted-foreground">
            Make sure you agree to our
            {" "}
            <Button variant="link" className="h-auto p-0 text-xs underline" asChild>
              <Link href="/terms-of-service" target="_blank">Terms</Link>
            </Button>
            {" "}
            and our
            {" "}
            <Button variant="link" className="h-auto p-0 text-xs underline" asChild>
              <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
