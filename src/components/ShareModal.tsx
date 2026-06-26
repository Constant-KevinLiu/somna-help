import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { trackShare } from "@/lib/share-analytics";
import {
  redditShareUrl,
  xShareUrl,
  pinterestShareUrl,
  pinterestDescription,
  copyToClipboard,
} from "@/lib/share-text";
import { toast } from "sonner";
import { MessageCircle, Twitter, Image as ImageIcon, Link2, X as XIcon } from "lucide-react";

export interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Context label for analytics, e.g. "dashboard", "assessment". */
  context: string;
  /** Sleep efficiency value used to build share text (0-100). */
  efficiency: number;
  /** Optional image data URL for Pinterest sharing. */
  imageDataUrl?: string;
  /** Optional custom URL to copy (defaults to current page URL). */
  url?: string;
}

export function ShareModal({
  open,
  onOpenChange,
  context,
  efficiency,
  imageDataUrl,
  url,
}: ShareModalProps) {
  const { t, lang } = useI18n();
  const [busy, setBusy] = useState(false);

  const pageUrl = url ?? (typeof window !== "undefined" ? window.location.href : "https://somna.help");

  const handleReddit = () => {
    trackShare("share_reddit", context, pageUrl);
    window.open(redditShareUrl(lang, efficiency), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handleX = () => {
    trackShare("share_x", context, pageUrl);
    window.open(xShareUrl(lang, efficiency), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handlePinterest = () => {
    trackShare("share_pinterest", context, pageUrl);
    window.open(pinterestShareUrl(imageDataUrl ?? "", lang), "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const handleCopyLink = async () => {
    setBusy(true);
    const ok = await copyToClipboard(pageUrl);
    trackShare("copy_link", context, pageUrl);
    setBusy(false);
    if (ok) {
      toast.success(t("share.copied"));
    } else {
      toast.error(t("share.copied"));
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl border-white/10 bg-background/95 p-6 backdrop-blur-xl sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl text-foreground">
            {t("share.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-2.5">
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
            onClick={handlePinterest}
            icon={<ImageIcon className="h-4 w-4" />}
            label={t("share.pinterest")}
            accent="bg-[#E60023]/15 text-[#FF4D5A] hover:bg-[#E60023]/25"
          />
          <ShareButton
            onClick={handleCopyLink}
            icon={<Link2 className="h-4 w-4" />}
            label={t("share.copyLink")}
            accent="bg-accent/15 text-accent hover:bg-accent/25"
            disabled={busy}
          />
        </div>

        <Button
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="mt-1 w-full rounded-full text-muted-foreground"
        >
          {t("share.cancel")}
        </Button>
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
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  accent: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${accent} disabled:opacity-50`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">{icon}</span>
      {label}
    </button>
  );
}
