import { Sparkles } from "lucide-react";
import Link from "next/link";

const navigationLinks = [
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/security-policy", label: "Security Policy" },
];

export function TopNavigation() {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h1 className="hidden text-lg font-semibold sm:block">Next Chat</h1>
        </Link>
      </div>

      <nav className="flex items-center gap-2 md:gap-4">
        {navigationLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-center text-base text-muted-foreground hover:text-foreground md:text-base"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
