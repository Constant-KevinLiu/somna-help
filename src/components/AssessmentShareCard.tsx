import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ShareModal } from "@/components/ShareModal";
import { trackShare } from "@/lib/share-analytics";
import { generateProfileImage, downloadDataUrl } from "@/lib/share-image";

export interface AssessmentShareCardProps {
  /** Localized efficiency tier label, e.g. "Excellent". */
  efficiencyLabel: string;
  /** Localized sleep type / level name, e.g. "Healthy sleeper". */
  sleepType: string;
}

/** Assessment result share section: Download Profile / Share Profile. */
export function AssessmentShareCard({ efficiencyLabel, sleepType }: AssessmentShareCardProps) {
  const { t, lang } = useI18n();
  const [shareOpen, setShareOpen] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");

  const handleDownload = () => {
    const dataUrl = generateProfileImage({ efficiencyLabel, sleepType, lang });
    if (dataUrl) {
      setImageDataUrl(dataUrl);
      downloadDataUrl(dataUrl, "somna-sleep-profile.png");
      trackShare("download_image", "assessment");
    }
  };

  const handleShare = () => {
    if (!imageDataUrl) {
      const dataUrl = generateProfileImage({ efficiencyLabel, sleepType, lang });
      if (dataUrl) setImageDataUrl(dataUrl);
    }
    trackShare("share_click", "assessment");
    setShareOpen(true);
  };

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-accent">
          {t("share.shareProfile")}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            {t("share.downloadProfile")}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            <Share2 className="h-4 w-4" />
            {t("share.shareProfileBtn")}
          </button>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        context="assessment"
        efficiency={75}
        imageDataUrl={imageDataUrl}
      />
    </div>
  );
}
