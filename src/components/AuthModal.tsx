/**
 * Sleep Diary v2.3 - Progressive Authentication Modal
 *
 * Passwordless OTP login modal that matches the Somna visual system.
 * All content is natively authored - no runtime translation.
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { getAuthCopy } from "@/content/auth-content";
import type { Locale as ContentLocale } from "@/content/content-types";
import type { AuthIntent } from "@/services/auth/auth-types";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: ContentLocale;
  intent?: AuthIntent;
  onSuccess?: () => void;
}

type Step = "email" | "otp" | "success";

// Map server error codes to localized content keys.
// Server uses snake_case; content uses camelCase.
const ERROR_KEY_MAP: Record<string, keyof ReturnType<typeof getAuthCopy>["errors"]> = {
  invalid_email: "invalidEmail",
  invalid_code: "codeInvalid",
  code_expired: "codeExpired",
  max_attempts: "maxAttempts",
  rate_limited: "rateLimited",
  cooldown: "rateLimited",
  network_error: "networkError",
  server_error: "unknownError",
  email_send_failed: "emailSendFailed",
};

function getErrorMessage(
  copy: ReturnType<typeof getAuthCopy>,
  errorCode: string | undefined,
): string {
  if (!errorCode) return copy.errors.unknownError;
  const key = ERROR_KEY_MAP[errorCode];
  if (key && copy.errors[key]) return copy.errors[key];
  return copy.errors.unknownError;
}

export function AuthModal({
  open,
  onOpenChange,
  locale,
  intent = "general",
  onSuccess,
}: AuthModalProps) {
  const copy = getAuthCopy(locale);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep("email");
      setEmail("");
      setCode("");
      setBusy(false);
      setCooldown(0);
    }
  }, [open]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || busy) return;

    setBusy(true);
    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, intent, locale }),
      });

      const data = await response.json();

      if (data.success) {
        setStep("otp");
        setCooldown(60);
        toast.success(copy.modal.title, {
          description: copy.otpForm.instructions,
        });
      } else if (data.error === "cooldown") {
        setCooldown(data.waitSeconds);
        toast.info(copy.errors.rateLimited);
      } else {
        toast.error(getErrorMessage(copy, data.error));
      }
    } catch (_error) {
      toast.error(copy.errors.networkError);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6 || busy) return;

    setBusy(true);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, intent }),
      });

      const data = await response.json();

      if (data.success) {
        setStep("success");
        toast.success(copy.success.title, {
          description: copy.success.message,
        });
        setTimeout(() => {
          onOpenChange(false);
          onSuccess?.();
        }, 1500);
      } else {
        toast.error(getErrorMessage(copy, data.error));
        if (data.error === "code_expired" || data.error === "max_attempts") {
          setStep("email");
          setCode("");
        }
      }
    } catch (_error) {
      toast.error(copy.errors.networkError);
    } finally {
      setBusy(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || busy) return;

    setBusy(true);
    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, intent, locale }),
      });

      const data = await response.json();

      if (data.success) {
        setCooldown(60);
        setCode("");
        toast.success(copy.modal.title, {
          description: copy.otpForm.instructions,
        });
      } else {
        toast.error(getErrorMessage(copy, data.error));
      }
    } catch (_error) {
      toast.error(copy.errors.networkError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {step === "success" ? (
              <CheckCircle2 className="w-8 h-8 mx-auto text-green-500" />
            ) : (
              copy.modal.title
            )}
          </DialogTitle>
          {step !== "success" && (
            <DialogDescription className="text-center">
              {step === "email" ? copy.modal.subtitle : copy.otpForm.instructions}
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "email" && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{copy.emailForm.label}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={copy.emailForm.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={busy}
                  autoComplete="email"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={busy || !email}>
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {copy.emailForm.sending}
                </>
              ) : (
                copy.emailForm.button
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">{copy.modal.privacyNote}</p>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-center block">{copy.otpForm.codeLabel}</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  disabled={busy}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={busy || code.length !== 6}>
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {copy.otpForm.verifying}
                </>
              ) : (
                copy.otpForm.verifyButton
              )}
            </Button>
            <div className="text-center">
              {cooldown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {copy.otpForm.resendWaiting} {cooldown}s
                </p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendCode}
                  disabled={busy}
                  className="text-sm"
                >
                  {copy.otpForm.resendButton}
                </Button>
              )}
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="text-center space-y-4 py-4">
            <p className="text-lg">{copy.success.message}</p>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              {copy.success.continueButton}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
