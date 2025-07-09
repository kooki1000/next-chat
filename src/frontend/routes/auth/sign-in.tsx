import { useNetworkState } from "@uidotdev/usehooks";
import { WifiOff } from "lucide-react";

export function SignInPage() {
  const { online: isOnline } = useNetworkState();
  return (
    <main className="flex flex-1 items-center justify-center">
      {isOnline
        ? (
            <div>Sign In Page</div>
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
