import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { SharePlatformType, trackShareClick } from "@/lib/share-analytics";
import {
  redditShareUrl,
  xShareUrl,
  pinterestShareUrl,
  facebookShareUrl,
  linkedInShareUrl,
  whatsAppShareUrl,
  copyToClipboard,
} from "@/lib/share-text";
import { uploadShareImage } from "@/lib/share-image";
import { SHARE_IMAGE_HOSTING_ENABLED } from "@/lib/share-config";
import { generateImageDataUrl, validateUploadFile } from "@/lib/share/shareService";
import { toast } from "sonner";
import {
  MessageCircle,
  Twitter,
  Image as ImageIcon,
  Link2,
  Facebook,
  Linkedin,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Context label for analytics, e.g. "dashboard", "assessment". */
  context: string;
  /** Sleep efficiency value used to build share text (0-100). */
  efficiency: number;
  /** Optional image data URL for Pinterest sharing and preview. */
  imageDataUrl?: string;
  /** Optional custom URL to copy (defaults to current page URL). */
  url?: string;
  /**
   * Filename used when uploading the image to R2 for Pinterest.
   * Should be unique per share context, e.g. "somna-sleep-score-84.png".
   * If omitted, a name derived from `context` is used.
   */
  imageFilename?: string;
  /** Optional title for the OG preview fallback. */
  title?: string;
  /** Optional description for the OG preview fallback. */
  description?: string;
}

const PREVIEW_TOGGLE_KEY = "somna.share.previewVisible";

export function ShareModal({
  open,
  onOpenChange,
  context,
  efficiency,
  imageDataUrl: externalImageDataUrl,
  url,
  imageFilename,
  title,
  description,
}: ShareModalProps) {
  const { t, lang } = useI18n();
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(externalImageDataUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(PREVIEW_TOGGLE_KEY);
    return stored === null ? true : stored === "true";
  });

  const pageUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "https://somna.help");

  const togglePreview = () => {
    const next = !previewVisible;
    setPreviewVisible(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PREVIEW_TOGGLE_KEY, String(next));
    }
  };

  // Regenerate preview if none was provided by the parent component.
  useEffect(() => {
    if (externalImageDataUrl) {
      setPreviewUrl(externalImageDataUrl);
      return;
    }
    if (!open) return;

    let cancelled = false;
    generateImageDataUrl({
      template: "dashboard",
      lang,
      efficiency,
      streakDays: 0,
      title,
      subtitle: description,
    })
      .then((dataUrl) => {
        if (!cancelled) setPreviewUrl(dataUrl);
      })
      .catch(() => {
        // Preview generation is best-effort; leave preview empty.
      });
    return () => {
      cancelled = true;
    };
  }, [open, externalImageDataUrl, lang, efficiency, title, description]);

  const handleReddit = () => {
    trackShareClick(SharePlatformType.Reddit, context, pageUrl, {
      pageRoute: context,
      templateType: context,
    });
    window.open(redditShareUrl(lang, efficiency, title), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handleX = () => {
    trackShareClick(SharePlatformType.X, context, pageUrl, {
      pageRoute: context,
      templateType: context,
    });
    window.open(xShareUrl(lang, efficiency, context), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handleFacebook = () => {
    trackShareClick(SharePlatformType.Facebook, context, pageUrl, {
      pageRoute: context,
      templateType: context,
    });
    window.open(facebookShareUrl({ pageUrl, title, description }), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handleLinkedIn = () => {
    trackShareClick(SharePlatformType.LinkedIn, context, pageUrl, {
      pageRoute: context,
      templateType: context,
    });
    window.open(linkedInShareUrl({ pageUrl, title, description }), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handleWhatsApp = () => {
    trackShareClick(SharePlatformType.WhatsApp, context, pageUrl, {
      pageRoute: context,
      templateType: context,
    });
    window.open(whatsAppShareUrl(lang, efficiency, pageUrl), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handlePinterest = async () => {
    setError(null);
    if (!previewUrl) {
      setError(t("share.pinterestFallback"));
      return;
    }

    if (!SHARE_IMAGE_HOSTING_ENABLED) {
      setError(t("share.pinterestFallback"));
      return;
    }

    setBusy(true);
    trackShareClick(SharePlatformType.Pinterest, context, pageUrl, {
      pageRoute: context,
      templateType: context,
    });
    try {
      const filename = imageFilename ?? `somna-${context}-${Math.round(efficiency)}.png`;

      // Validate the generated image before uploading.
      const blob = await fetch(previewUrl).then((r) => r.blob());
      const validation = validateUploadFile(new File([blob], filename, { type: blob.type }));
      if (!validation.valid) {
        if (validation.error === "PNG_FORMAT_INVALID") {
          setError(t("share.pngFormatInvalid"));
        } else {
          setError(t("share.fileSizeOverLimit"));
        }
        return;
      }

      const imageUrl = await uploadShareImage(previewUrl, filename);
      if (!imageUrl) {
        setError(t("share.pinterestFallback"));
        return;
      }
      const pinUrl = pinterestShareUrl(pageUrl, imageUrl, lang);
      window.open(pinUrl, "_blank", "noopener,noreferrer");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("share.uploadError"));
    } finally {
      setBusy(false);
    }
  };

  const handleCopyLink = async () => {
    setBusy(true);
    const ok = await copyToClipboard(pageUrl);
    trackShareClick(SharePlatformType.Copy, context, pageUrl, {
      pageRoute: context,
      templateType: context,
    });
    setBusy(false);
    if (ok) {
      toast.success(t("share.copied"));
      onOpenChange(false);
    } else {
      setError(t("share.copyFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-white/10 bg-background/80 p-0 shadow-2xl backdrop-blur-2xl sm:rounded-3xl">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-xl text-foreground">
              {t("share.title")}
            </DialogTitle>
          </DialogHeader>

          {/* OG live preview panel (collapsible) */}
          {previewUrl && (
            <div className="mt-4">
              <button
                onClick={togglePreview}
                className="mb-2 flex w-full items-center justify-center gap-1 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
                aria-expanded={previewVisible}
                aria-controls="share-preview-panel"
              >
                {t(previewVisible ? "share.hidePreview" : "share.showPreview")}
                {previewVisible ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
              {previewVisible && (
                <div
                  id="share-preview-panel"
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <img
                    src={previewUrl}
                    alt={t("share.previewTitle")}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Dedicated error panel */}
          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{t("share.failed")}</p>
                <p className="mt-1 text-destructive/80">{error}</p>
                <p className="mt-2 text-xs text-muted-foreground">{t("share.errorTip")}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-destructive/70 hover:text-destructive"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <ShareButton
              onClick={handleReddit}
              icon={<MessageCircle className="h-4 w-4" />}
              label={t("share.reddit")}
              accent="bg-[#FF4500]/15 text-[#FF6633] hover:bg-[#FF4500]/25"
            />
            <ShareButton
              onClick={handleX}
              icon={<Twitter className="h-4 w-4" />}
              label={t("share.x")}
              accent="bg-foreground/10 text-foreground hover:bg-foreground/15"
            />
            <ShareButton
              onClick={handleFacebook}
              icon={<Facebook className="h-4 w-4" />}
              label={t("share.facebook")}
              accent="bg-[#1877F2]/15 text-[#4F9EFF] hover:bg-[#1877F2]/25"
            />
            <ShareButton
              onClick={handleLinkedIn}
              icon={<Linkedin className="h-4 w-4" />}
              label={t("share.linkedin")}
              accent="bg-[#0A66C2]/15 text-[#4599FF] hover:bg-[#0A66C2]/25"
            />
            <ShareButton
              onClick={handleWhatsApp}
              icon={<MessageCircle className="h-4 w-4" />}
              label={t("share.whatsapp")}
              accent="bg-[#25D366]/15 text-[#53E688] hover:bg-[#25D366]/25"
            />
            <ShareButton
              onClick={handlePinterest}
              icon={<ImageIcon className="h-4 w-4" />}
              label={t("share.pinterest")}
              accent="bg-[#E60023]/15 text-[#FF4D5A] hover:bg-[#E60023]/25"
              disabled={busy}
            />
          </div>

          <ShareButton
            onClick={handleCopyLink}
            icon={<Link2 className="h-4 w-4" />}
            label={t("share.copyLink")}
            accent="bg-accent/15 text-accent hover:bg-accent/25"
            disabled={busy}
            className="mt-2.5"
          />

          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="mt-3 w-full rounded-full text-muted-foreground"
          >
            {t("share.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShareButton({
  onClick,
  icon,
  label,
  accent,
  disabled,
  className = "",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  accent: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition ${accent} disabled:opacity-50 ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5">
        {icon}
      </span>
      {label}
    </button>
  );
}
