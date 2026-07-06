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
import { isGoogleBot } from "@/lib/crawler";

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
  /** Called when the challenge fails. */
  onError?: (errorCode: string) => void;
  /** Dialog title text. */
  title?: string;
  /** Dialog description text. */
  description?: string;
}

/**
 * Modal Turnstile challenge dialog.
 *
 * The dialog is automatically suppressed for search-engine crawlers so they
 * never see an interstitial and can crawl the underlying page normally.
 */
export function TurnstileDialog({
  open,
  onOpenChange,
  siteKey,
  action = "modal-verify",
  onVerify,
  onError,
  title = "Verify you are human",
  description = "Please complete the quick security check below to continue.",
}: TurnstileDialogProps) {
  const { isCrawler: contextIsCrawler } = useCrawler();
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isCrawler = contextIsCrawler || isGoogleBot(ua);

  if (isCrawler) {
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
            onVerify={(token) => {
              onVerify?.(token);
              onOpenChange(false);
            }}
            onError={onError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
