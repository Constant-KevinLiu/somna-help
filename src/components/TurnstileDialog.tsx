"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TurnstileWidget } from "./TurnstileWidget";
import { useCrawler } from "@/lib/crawler-context";
import { isSearchEngineBot } from "@/lib/crawler";

export interface TurnstileDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when the dialog should close. */
  onOpenChange: (open: boolean) => void;
  /** Cloudflare Turnstile sitekey. Falls back to PUBLIC_TURNSTILE_SITE_KEY. */
  siteKey?: string;
  /** Widget action identifier. */
  action?: string;
  /** Called when the user successfully completes the challenge. */
  onVerify?: (token: string) => void;
  /** Called when the challenge fails after all retries are exhausted. */
  onError?: (errorCode: string) => void;
  /** Dialog title text. */
  title?: string;
  /** Dialog description text. */
  description?: string;
  /** Maximum number of auto-retries inside the widget before surfacing an error. */
  maxRetries?: number;
}

/**
 * Modal Turnstile challenge dialog.
 *
 * The dialog is automatically suppressed for all search-engine crawlers
 * (Google, Bing, DuckDuckGo, Apple, Yandex, Baidu, etc.) so they never see an
 * interstitial and can crawl the underlying page normally. Normal users still
 * see the dialog when `open` is true, with built-in retry logic for transient
 * Turnstile failures.
 */
const DEFAULT_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function TurnstileDialog({
  open,
  onOpenChange,
  siteKey = DEFAULT_SITE_KEY,
  action = "modal-verify",
  onVerify,
  onError,
  title = "Verify you are human",
  description = "Please complete the quick security check below to continue.",
  maxRetries = 3,
}: TurnstileDialogProps) {
  const { isCrawler: contextIsCrawler } = useCrawler();
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isCrawler = contextIsCrawler || isSearchEngineBot(ua);

  // Forcibly close the dialog if a crawler somehow reaches this component.
  if (isCrawler) {
    if (open) onOpenChange(false);
    return null;
  }

  return (
    <Dialog open={open && !isCrawler} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <TurnstileWidget
            siteKey={siteKey}
            action={action}
            maxRetries={maxRetries}
            onVerify={(token) => {
              onVerify?.(token);
              onOpenChange(false);
            }}
            onError={(errorCode) => {
              onError?.(errorCode);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
