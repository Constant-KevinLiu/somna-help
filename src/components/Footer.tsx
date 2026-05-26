import { useI18n } from "@/lib/i18n";
import { Moon } from "lucide-react";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-white/5 px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <Moon className="h-4 w-4 text-primary-foreground" />
            </span>
            <div>
              <div className="font-display text-base">somna</div>
              <div className="text-xs text-muted-foreground">{t("footer.tag")}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground md:text-right">
            <div>{t("footer.rights")}</div>
            <div className="mt-1 max-w-xs">{t("footer.disc")}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
