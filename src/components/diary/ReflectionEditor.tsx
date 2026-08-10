/**
 * Text editor for the Guided Reflection.
 *
 * Features:
 * - Word counter
 * - 750 word limit
 * - Status indicator
 * - Accessible labeling
 */

import { useRef } from "react";
import type { Locale } from "@/content/content-types";
import type { SaveStatus } from "@/lib/reflection/reflection-types";
import { MAX_WORDS } from "@/lib/reflection/reflection-word-count";
import type { ReflectionUiStrings } from "@/content/en/diary/reflection-ui";

interface ReflectionEditorProps {
  content: string;
  onChange: (content: string) => void;
  wordCount: number;
  isAtWordLimit: boolean;
  saveStatus: SaveStatus;
  locale: Locale;
  strings: ReflectionUiStrings;
  ariaLabel?: string;
}

export function ReflectionEditor({
  content,
  onChange,
  wordCount,
  isAtWordLimit,
  saveStatus,
  strings,
  ariaLabel,
}: ReflectionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case "saved":
        return "text-green-400";
      case "saving":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      case "unsaved":
        return "text-orange-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getWordCountColor = () => {
    if (isAtWordLimit) return "text-red-400";
    if (wordCount > MAX_WORDS * 0.9) return "text-yellow-400";
    return "text-muted-foreground";
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    const combinedText = content + pastedText;
    const newWordCount = combinedText
      .trim()
      .split(/\s+/)
      .filter((t) => t && /\p{L}/u.test(t)).length;

    if (newWordCount > MAX_WORDS) {
      e.preventDefault();
      // Show visual feedback that paste was blocked
      textareaRef.current?.classList.add("shake");
      setTimeout(() => textareaRef.current?.classList.remove("shake"), 500);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder="Start writing your reflection here..."
        aria-label={ariaLabel}
        rows={8}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-50"
        style={{
          minHeight: "200px",
        }}
      />

      <div className="flex items-center justify-between text-xs">
        <div className={`flex items-center gap-2 ${getWordCountColor()}`}>
          <span aria-live="polite">
            {wordCount} / {MAX_WORDS} {strings.wordLimit}
          </span>
          {isAtWordLimit && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-red-300">
              {strings.wordLimitReached}
            </span>
          )}
        </div>

        {saveStatus !== "idle" && (
          <div className={`flex items-center gap-1.5 ${getSaveStatusColor()}`}>
            {saveStatus === "saving" && (
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {saveStatus === "saved" && (
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            <span aria-live="polite">{strings.saveStatus[saveStatus]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
