/**
 * Display the three daily prompts for the Guided Reflection.
 */

import type { ReflectionPrompt } from "@/lib/reflection/reflection-types";
import { getCategoryLabel } from "@/lib/reflection/reflection-prompts";
import type { Locale } from "@/content/content-types";

interface ReflectionPromptsListProps {
  prompts: ReflectionPrompt[];
  locale: Locale;
}

export function ReflectionPromptsList({ prompts, locale }: ReflectionPromptsListProps) {
  return (
    <div className="space-y-4">
      {prompts.map((prompt, index) => (
        <div
          key={prompt.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
        >
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-accent/80">
            {getCategoryLabel(prompt.category, locale)}
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {index + 1}. {prompt.text}
          </p>
        </div>
      ))}
    </div>
  );
}
