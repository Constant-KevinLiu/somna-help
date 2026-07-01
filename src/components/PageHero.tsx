import { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-16 md:pt-24">
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl animate-glow-pulse" />
      <div className="mx-auto max-w-3xl text-center animate-fade-up">
        {eyebrow && (
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</div>
        )}
        <h1 className="font-display text-4xl text-gradient md:text-5xl">{title}</h1>
        {sub && (
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{sub}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
