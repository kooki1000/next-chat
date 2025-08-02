import { SignIn } from "@clerk/nextjs";
import { useNetworkState } from "@uidotdev/usehooks";
import { WifiOff } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SignInPage() {
  const { online: isOnline } = useNetworkState();
  return (
    <main className="flex flex-1 items-center justify-center">
      {isOnline
        ? (
            <div className="flex flex-col items-center gap-4">
              <SignIn />
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
            </div>
          )
        : (
            <div className="flex flex-col gap-2 text-center">
              <div className="mx-auto mb-2">
                <WifiOff className="h-12 w-12 text-foreground/80" />
              </div>
              <h2 className="text-2xl font-semibold">You&apos;re offline</h2>
              <p className="text-foreground/80">
                Please check your internet connection to sign in.
              </p>
            </div>
          )}
    </main>
  );
}
