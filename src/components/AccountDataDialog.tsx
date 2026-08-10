/**
 * Sleep Diary v2.3 - Account Data Export and Delete Dialogs
 *
 * User-facing controls for exporting and deleting account data.
 * All labels are natively authored for each locale.
 */

import { useState } from "react";
import { Download, Trash2, AlertTriangle, FileJson, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { AuthCopy } from "@/content/en/auth/auth-copy";

interface AccountDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "export" | "delete";
  copy: AuthCopy;
  onSignOut: () => void;
  onClearCache: () => void;
}

export function AccountDataDialog({
  open,
  onOpenChange,
  mode,
  copy,
  onSignOut,
  onClearCache,
}: AccountDataDialogProps) {
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/account/export", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        response.headers.get("Content-Disposition")?.match(/filename="?([^"]+)"?/)?.[1] ||
        "somna-data-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(copy.accountExport.successMessage);
      onOpenChange(false);
    } catch {
      toast.error(copy.accountExport.failureMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirmation !== copy.accountDelete.confirmationPhrase) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/account/data", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          confirmation: copy.accountDelete.confirmationPhrase,
        }),
      });

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      // Clear local cache and sign out
      toast.info(copy.accountDelete.clearingCacheMessage);
      await onClearCache();

      toast.success(copy.accountDelete.successMessage);
      onOpenChange(false);
      onSignOut();
    } catch {
      toast.error(copy.accountDelete.partialFailureMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const canDelete = confirmation === copy.accountDelete.confirmationPhrase && acknowledged;

  if (mode === "export") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              {copy.accountExport.title}
            </DialogTitle>
            <DialogDescription>{copy.accountExport.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Your export includes:</h4>
              <ul className="space-y-2">
                {copy.accountExport.includes.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileJson className="w-4 h-4" />
              <span>Format: JSON (machine-readable)</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isLoading}>
              {isLoading ? (
                copy.accountExport.downloading
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {copy.accountExport.button}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            {copy.accountDelete.title}
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-destructive block mb-2">
              {copy.accountDelete.warning}
            </span>
            {copy.accountDelete.explanation}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive mb-1">
                  All of the following will be permanently deleted:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Sleep records and notes</li>
                  <li>• CBT-I guided reflections</li>
                  <li>• Reminder settings</li>
                  <li>• Program progress</li>
                  <li>• Active sessions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acknowledge"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
              />
              <Label htmlFor="acknowledge" className="text-sm font-normal cursor-pointer">
                I understand this action is permanent and cannot be undone.
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-sm font-medium">
                Type{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  {copy.accountDelete.confirmationPhrase}
                </code>{" "}
                to confirm:
              </Label>
              <Input
                id="confirmation"
                placeholder={copy.accountDelete.confirmationPlaceholder}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="font-mono text-sm"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || isLoading}
            className="w-full"
            aria-label={copy.accountDelete.ariaLabel}
          >
            {isLoading ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {copy.accountDelete.confirmButton}
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="w-full"
            disabled={isLoading}
          >
            {copy.accountDelete.cancelButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
