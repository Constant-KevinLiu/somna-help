import { useEffect, useRef } from "react";
import { X, Pause } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getProgramLessonUI } from "@/lib/program-lessons-i18n";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function PauseConfirmDialog({ open, onOpenChange, onConfirm }: Props) {
  const { lang } = useI18n();
  const ui = getProgramLessonUI(lang);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus management: initial focus on cancel button (safer default)
  useEffect(() => {
    if (open) {
      // Small delay to ensure dialog is rendered
      const timer = setTimeout(() => {
        cancelRef.current?.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  // Focus trap (basic: cycle between cancel and confirm)
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [open]);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-dialog-title"
      aria-describedby="pause-dialog-body"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md glass-strong rounded-3xl p-6 md:p-8 animate-fade-up"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
          <Pause className="h-5 w-5 text-accent" />
        </div>

        {/* Content */}
        <div className="mt-5 text-center">
          <h2 id="pause-dialog-title" className="font-display text-xl text-foreground">
            {ui.pauseConfirmTitle}
          </h2>
          <p id="pause-dialog-body" className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {ui.pauseConfirmBody}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            ref={cancelRef}
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-foreground transition hover:bg-white/10"
          >
            {ui.pauseConfirmCancel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            {ui.pauseConfirmPause}
          </button>
        </div>
      </div>
    </div>
  );
}
