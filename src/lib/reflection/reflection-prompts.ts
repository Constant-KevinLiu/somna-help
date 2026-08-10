/**
 * Reflection Prompt Registry and Selection Logic
 *
 * Deterministic prompt selection based on date + locale.
 * Ensures category diversity: one cognitive, one behavioral, one calming.
 */

import type { Locale } from "@/content/content-types";
import type { ReflectionPrompt, ReflectionCategory } from "./reflection-types";
import { EN_REFLECTION_PACKAGE } from "@/content/en/diary/reflection-prompts";
import { ES_REFLECTION_PACKAGE } from "@/content/es/diary/reflection-prompts";
import { PT_BR_REFLECTION_PACKAGE } from "@/content/pt-BR/diary/reflection-prompts";
import { PL_REFLECTION_PACKAGE } from "@/content/pl/diary/reflection-prompts";
import { validateContentPackage } from "@/content/content-types";

const PROMPT_PACKAGES: Partial<Record<Locale, typeof EN_REFLECTION_PACKAGE>> = {
  en: EN_REFLECTION_PACKAGE,
  es: ES_REFLECTION_PACKAGE,
  "pt-BR": PT_BR_REFLECTION_PACKAGE,
  pl: PL_REFLECTION_PACKAGE,
};

export function getPromptsForLocale(locale: Locale): ReflectionPrompt[] {
  const pkg = PROMPT_PACKAGES[locale];
  if (!pkg) {
    // Fall back to English for locales without native reflection content
    return EN_REFLECTION_PACKAGE.content;
  }
  validateContentPackage(pkg, locale);
  return pkg.content;
}

type CategoryGroup = "cognitive" | "behavioral" | "calming";

const CATEGORY_GROUPS: Record<CategoryGroup, ReflectionCategory[]> = {
  cognitive: ["sleep-thoughts", "sleep-anxiety", "cognitive-reframing"],
  behavioral: ["sleep-behaviors", "stimulus-control", "sleep-restriction"],
  calming: ["relaxation", "gratitude", "sleep-confidence", "night-awakenings"],
};

/**
 * Simple deterministic hash function.
 * Takes a seed string and returns a number between 0 and max-1.
 */
function hashSeed(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash) % max;
}

/**
 * Get deterministic index for selection.
 * Ensures variety across consecutive days.
 */
function getDeterministicIndex(seed: string, array: unknown[], dayOffset: number = 0): number {
  const seededHash = hashSeed(`${seed}-${dayOffset}`, array.length);
  return seededHash;
}

/**
 * Select three distinct prompts for the day:
 * 1. One cognitive prompt
 * 2. One behavioral/schedule prompt
 * 3. One calming/gratitude/confidence prompt
 *
 * Selection is deterministic for the same date + locale.
 */
export function selectDailyPrompts(
  localDate: string,
  locale: Locale,
): [ReflectionPrompt, ReflectionPrompt, ReflectionPrompt] {
  const allPrompts = getPromptsForLocale(locale);
  const seed = `${localDate}-${locale}`;

  // Get day number for variety
  const dayNumber = parseInt(localDate.split("-").join(""), 10) % 1000;

  // Group prompts by category type
  const cognitivePrompts = allPrompts.filter((p) => CATEGORY_GROUPS.cognitive.includes(p.category));
  const behavioralPrompts = allPrompts.filter((p) =>
    CATEGORY_GROUPS.behavioral.includes(p.category),
  );
  const calmingPrompts = allPrompts.filter((p) => CATEGORY_GROUPS.calming.includes(p.category));

  // Select one from each category with deterministic offset
  const cognitiveIndex = getDeterministicIndex(seed, cognitivePrompts, dayNumber % 3);
  const behavioralIndex = getDeterministicIndex(seed, behavioralPrompts, (dayNumber + 1) % 4);
  const calmingIndex = getDeterministicIndex(seed, calmingPrompts, (dayNumber + 2) % 5);

  return [
    cognitivePrompts[cognitiveIndex],
    behavioralPrompts[behavioralIndex],
    calmingPrompts[calmingIndex],
  ];
}

/**
 * Get prompt IDs only (for storage with reflection).
 */
export function getDailyPromptIds(localDate: string, locale: Locale): string[] {
  return selectDailyPrompts(localDate, locale).map((p) => p.id);
}

/**
 * Get category labels for all categories.
 */
const CATEGORY_LABELS: Partial<Record<Locale, Record<ReflectionCategory, string>>> = {
  en: {
    "sleep-thoughts": "Sleep Thoughts",
    "sleep-anxiety": "Sleep Anxiety",
    "sleep-behaviors": "Sleep Behaviors",
    relaxation: "Relaxation",
    gratitude: "Gratitude",
    "sleep-confidence": "Sleep Confidence",
    "stimulus-control": "Stimulus Control",
    "sleep-restriction": "Sleep Restriction",
    "night-awakenings": "Night Awakenings",
    "cognitive-reframing": "Cognitive Reframing",
  },
  es: {
    "sleep-thoughts": "Pensamientos sobre el Sueño",
    "sleep-anxiety": "Ansiedad del Sueño",
    "sleep-behaviors": "Comportamientos del Sueño",
    relaxation: "Relajación",
    gratitude: "Gratitud",
    "sleep-confidence": "Confianza en el Sueño",
    "stimulus-control": "Control del Estímulo",
    "sleep-restriction": "Restricción del Sueño",
    "night-awakenings": "Despertares Nocturnos",
    "cognitive-reframing": "Reencuadre Cognitivo",
  },
  "pt-BR": {
    "sleep-thoughts": "Pensamentos sobre o Sono",
    "sleep-anxiety": "Ansiedade do Sono",
    "sleep-behaviors": "Comportamentos do Sono",
    relaxation: "Relaxamento",
    gratitude: "Gratidão",
    "sleep-confidence": "Confiança no Sono",
    "stimulus-control": "Controle do Estímulo",
    "sleep-restriction": "Restrição do Sono",
    "night-awakenings": "Despertares Noturnos",
    "cognitive-reframing": "Reenquadramento Cognitivo",
  },
  pl: {
    "sleep-thoughts": "Myśli o Śnie",
    "sleep-anxiety": "Lęk przed Snem",
    "sleep-behaviors": "Zachowania Snu",
    relaxation: "Relaksacja",
    gratitude: "Wdzięczność",
    "sleep-confidence": "Pewność Siebie w Śnie",
    "stimulus-control": "Kontrola Bodźca",
    "sleep-restriction": "Ograniczenie Snu",
    "night-awakenings": "Przebudzenia Nocne",
    "cognitive-reframing": "Przekształcenie Poznawcze",
  },
};

const EN_CATEGORY_LABELS: Record<ReflectionCategory, string> = CATEGORY_LABELS.en as Record<
  ReflectionCategory,
  string
>;

export function getCategoryLabel(category: ReflectionCategory, locale: Locale): string {
  const labels = CATEGORY_LABELS[locale] ?? EN_CATEGORY_LABELS;
  return labels[category];
}
