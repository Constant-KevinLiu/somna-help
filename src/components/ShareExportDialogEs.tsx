/**
 * Diálogo de exportación/descarga de imágenes de compartir, en español.
 *
 * - Textos nativos de src/locales/es/share-card.json.
 * - Reutiliza la lógica de subida a R2 existente (src/lib/share/uploadToR2.ts).
 * - Mensajes de error diferenciados para 401/413/500 de R2, en español.
 * - Botón de descarga por lotes (varias imágenes a la vez).
 */

import { useState } from "react";
import { Download, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { loadEsDict } from "@/locales/es";
import { uploadImage } from "@/lib/share/shareService";

interface ShareExportDialogEsProps {
  open: boolean;
  onClose: () => void;
  /** Imágenes pendientes de exportar: id + dataUrl + nombre de archivo. */
  images: Array<{ id: string; dataUrl: string; filename: string }>;
  /** Callback opcional tras subir cada imagen a R2. */
  onUploaded?: (id: string, r2Url: string) => void;
}

type UploadStatus = "idle" | "uploading" | "done" | "error";

export function ShareExportDialogEs({
  open,
  onClose,
  images,
  onUploaded,
}: ShareExportDialogEsProps) {
  const t = loadEsDict();
  const [statuses, setStatuses] = useState<Record<string, UploadStatus>>({});
  const [errorMsg, setErrorMsg] = useState<Record<string, string>>({});

  if (!open) return null;

  async function uploadOne(img: (typeof images)[number]) {
    setStatuses((s) => ({ ...s, [img.id]: "uploading" }));
    setErrorMsg((m) => ({ ...m, [img.id]: "" }));
    try {
      const blob = await (await fetch(img.dataUrl)).blob();
      const r2Url = await uploadImage(blob, img.filename);
      setStatuses((s) => ({ ...s, [img.id]: "done" }));
      onUploaded?.(img.id, r2Url);
    } catch (err) {
      const status = (err as { status?: number })?.status;
      let key = "error.upload.r2.500.body";
      if (status === 401) key = "error.upload.r2.401.body";
      else if (status === 413) key = "error.upload.r2.413.body";
      setStatuses((s) => ({ ...s, [img.id]: "error" }));
      setErrorMsg((m) => ({ ...m, [img.id]: t[key] }));
    }
  }

  async function uploadAll() {
    await Promise.all(images.map((img) => uploadOne(img)));
  }

  function downloadOne(img: (typeof images)[number]) {
    const a = document.createElement("a");
    a.href = img.dataUrl;
    a.download = img.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">{t["share.title"]}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-white/5"
            aria-label={t["share.close"]}
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{t["share.sub"]}</p>

        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {images.map((img) => {
            const st = statuses[img.id] ?? "idle";
            return (
              <div
                key={img.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-foreground">{img.filename}</div>
                  {st === "error" && (
                    <div className="mt-1 flex items-start gap-1 text-xs text-red-400">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                      <span>{errorMsg[img.id]}</span>
                    </div>
                  )}
                  {st === "done" && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{t["toast.share.ok"]}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadOne(img)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-foreground transition hover:bg-white/10"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => uploadOne(img)}
                    disabled={st === "uploading" || st === "done"}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {st === "uploading" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      t["share.share"]
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={uploadAll}
            className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
          >
            {t["share.share"]} · {images.length}
          </button>
        </div>
      </div>
    </div>
  );
}
