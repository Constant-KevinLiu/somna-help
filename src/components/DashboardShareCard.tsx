import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ShareModal } from "@/components/ShareModal";
import { trackShare } from "@/lib/share-analytics";
import { generateDashboardImage, downloadDataUrl } from "@/lib/share-image";

export interface DashboardShareCardProps {
  /** Weekly average sleep efficiency (0-100), or null if unavailable. */
  efficiency: number | null;
  /** Current streak in days. */
  streak: number;
}

/** Dashboard share section: shows efficiency summary + Download / Share buttons. */
export function DashboardShareCard({ efficiency, streak }: DashboardShareCardProps) {
  const { t, lang } = useI18n();
  const [shareOpen, setShareOpen] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");

  const eff = efficiency ?? 0;

  const handleDownload = () => {
    const dataUrl = generateDashboardImage({ efficiency, streak, lang });
    if (dataUrl) {
      setImageDataUrl(dataUrl);
      downloadDataUrl(dataUrl, "somna-sleep-progress.png");
      trackShare("download_image", "dashboard");
    }
  };

  const handleShare = () => {
    // Pre-generate image so Pinterest sharing has it ready.
    if (!imageDataUrl) {
      const dataUrl = generateDashboardImage({ efficiency, streak, lang });
      if (dataUrl) setImageDataUrl(dataUrl);
    }
    trackShare("share_click", "dashboard");
    setShareOpen(true);
  };

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t("share.sleepEfficiency")}
        </div>
        <div className="font-display text-5xl text-gradient">
          {efficiency !== null ? `${Math.round(efficiency)}%` : "—"}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
          {t("share.improving")}
        </div>
        <div className="text-sm text-muted-foreground">
          {streak} {t("share.dayStreak")}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            {t("share.download")}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            <Share2 className="h-4 w-4" />
            {t("share.share")}
          </button>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        context="dashboard"
        efficiency={eff}
        imageDataUrl={imageDataUrl}
      />
    </div>
  );
}
