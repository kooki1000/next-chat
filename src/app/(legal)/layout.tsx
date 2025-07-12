import { TopNavigation } from "./components/TopNavigation";

export default function LegalLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      <TopNavigation />
      <main
        className={`mx-auto prose max-w-3xl px-4 py-12
        prose-headings:font-bold prose-headings:text-accent-foreground
        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-3xl prose-p:text-muted-foreground
        prose-strong:text-foreground prose-li:text-muted-foreground prose-li:marker:text-primary`}
      >
        {children}
      </main>
    </div>
  );
}
