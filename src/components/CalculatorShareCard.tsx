import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ShareModal } from "@/components/ShareModal";
import { trackShare } from "@/lib/share-analytics";
import { generateCalculatorImage, downloadDataUrl } from "@/lib/share-image";

export interface CalculatorShareCardProps {
  /** Localized calculator title, e.g. "Sleep Cycle Calculator". */
  title: string;
  /** Localized result lines to render on the image (max 4). */
  resultLines: string[];
  /** Analytics context label, e.g. "calculator", "nap-calculator". */
  context?: string;
  /** Filename for the downloaded image. */
  filename?: string;
}

/** Calculator result share section: Download Result / Share Result. */
export function CalculatorShareCard({
  title,
  resultLines,
  context = "calculator",
  filename = "somna-result.png",
}: CalculatorShareCardProps) {
  const { t, lang } = useI18n();
  const [shareOpen, setShareOpen] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");

  const handleDownload = () => {
    const dataUrl = generateCalculatorImage({ title, resultLines, lang });
    if (dataUrl) {
      setImageDataUrl(dataUrl);
      downloadDataUrl(dataUrl, filename);
      trackShare("download_image", context);
    }
  };

  const handleShare = () => {
    if (!imageDataUrl) {
      const dataUrl = generateCalculatorImage({ title, resultLines, lang });
      if (dataUrl) setImageDataUrl(dataUrl);
    }
    trackShare("share_click", context);
    setShareOpen(true);
  };

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 animate-fade-up">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            {t("share.downloadResult")}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            <Share2 className="h-4 w-4" />
            {t("share.shareResult")}
          </button>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        context={context}
        efficiency={75}
        imageDataUrl={imageDataUrl}
      />
    </div>
  );
}
