import { SignUp } from "@clerk/nextjs";
import { useNetworkState } from "@uidotdev/usehooks";
import {
  Brain,
  MessageSquare,
  Palette,
  Shield,
  Sparkles,
  WifiOff,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Conversations",
    description:
      "Chat with advanced AI models including GPT-4, Claude, and Gemini for intelligent responses and creative assistance.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Responses",
    description: "Get instant AI responses with our optimized infrastructure designed for speed and reliability.",
  },
  {
    icon: MessageSquare,
    title: "Organized Chat History",
    description: "Keep track of all your conversations with smart organization and powerful search capabilities.",
  },
  {
    icon: Shield,
    title: "Privacy & Security First",
    description:
      "Your conversations are encrypted and secure. We prioritize your privacy with enterprise-grade security.",
  },
  {
    icon: Palette,
    title: "Customizable Experience",
    description: "Personalize your chat experience with themes, custom prompts, and tailored AI behavior settings.",
  },
];

export function SignUpPage() {
  const { online: isOnline } = useNetworkState();
  if (!isOnline) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col gap-2 text-center">
          <div className="mx-auto mb-2">
            <WifiOff className="h-12 w-12 text-foreground/80" />
          </div>
          <h2 className="text-2xl font-semibold">You&apos;re offline</h2>
          <p className="text-foreground/80">
            Please check your internet connection to sign up.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl">
        {/* Features Section */}
        <aside className="hidden flex-col justify-center rounded-2xl bg-accent px-12 py-16 lg:flex lg:w-1/2">
          <div className="max-w-md">
            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-semibold">Next Chat</span>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 font-medium text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Sign Up Form */}
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <SignUp />
          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our
            {" "}
            <Button variant="link" className="h-auto p-0 text-xs underline" asChild>
              <Link href="/terms-of-service" target="_blank">Terms of Service</Link>
            </Button>
            {" "}
            and
            {" "}
            <Button variant="link" className="h-auto p-0 text-xs underline" asChild>
              <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>
            </Button>
            .
          </div>
        </main>
      </div>
    </div>
  );
}
