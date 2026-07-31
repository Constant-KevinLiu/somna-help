/**
 * Sleep Diary v2.3 - Identity-aware Navigation Menu
 * 
 * Shows "Sync Progress" button when unauthenticated,
 * shows user account menu when authenticated.
 * All labels are natively authored for each locale.
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { AuthModal } from "@/components/AuthModal";
import { AccountDataDialog } from "@/components/AccountDataDialog";
import { getAuthCopy } from "@/content/auth-content";
import type { Locale } from "@/services/auth/auth-types";
import {
  Cloud,
  CloudOff,
  User,
  LayoutDashboard,
  BookOpen,
  Bell,
  Settings,
  Download,
  Trash2,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface IdentityMenuProps {
  locale: Locale;
}

export function IdentityMenu({ locale }: IdentityMenuProps) {
  const copy = getAuthCopy(locale);
  const { session, loading, logout, refreshSession } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountDialog, setAccountDialog] = useState<{ open: boolean; mode: "export" | "delete" }>({ open: false, mode: "export" });

  const handleSyncClick = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    refreshSession();
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleClearCache = async () => {
    // Clear sync-related cache
    localStorage.removeItem("somna:sync-queue");
    localStorage.removeItem("somna:sync-status");
    localStorage.removeItem("somna:migration-state");
    localStorage.removeItem("somna:cloud-sleep-records");
    localStorage.removeItem("somna:cloud-reflections");
    localStorage.removeItem("somna:reminder-settings");
    // Clear weekly reflections (user data, deleted with account)
    localStorage.removeItem("somna.weekly-reflections.v1");
    // Clear weekly focus responses (user data, deleted with account)
    localStorage.removeItem("somna.weekly-focus.v1");
    // Clear program data (owned by program module, SSR-safe)
    // Uses the program module's deleteAllProgramData for single-source-of-truth key management.
    try {
      const { deleteAllProgramData } = await import("@/lib/program/storage");
      deleteAllProgramData();
    } catch {
      // If module fails to load (SSR edge case), clear known keys directly
      localStorage.removeItem("somna:program-progress:v1");
      localStorage.removeItem("somna:program-plans:v1");
      localStorage.removeItem("cbtiProgramProgress");
    }
  };

  const handleExportClick = () => {
    setAccountDialog({ open: true, mode: "export" });
  };

  const handleDeleteClick = () => {
    setAccountDialog({ open: true, mode: "delete" });
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="w-4 h-4 mr-2" />
        ...
      </Button>
    );
  }

  if (!session?.isAuthenticated) {
    return (
      <>
        <Button variant="default" size="sm" onClick={handleSyncClick}>
          <Cloud className="w-4 h-4 mr-2" />
          {copy.identityMenu.syncProgress}
        </Button>
        <AuthModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          locale={locale}
          intent="general"
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            {copy.identityMenu.account}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to={`${locale === "en" ? "" : `/${locale === "pt-BR" ? "pt" : locale}`}/dashboard` as any} className="flex items-center gap-2 w-full cursor-pointer">
            <LayoutDashboard className="w-4 h-4" />
            {copy.identityMenu.dashboard}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`${locale === "en" ? "" : `/${locale === "pt-BR" ? "pt" : locale}`}/diary` as any} className="flex items-center gap-2 w-full cursor-pointer">
            <BookOpen className="w-4 h-4" />
            {copy.identityMenu.sleepDiary}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`${locale === "en" ? "" : `/${locale === "pt-BR" ? "pt" : locale}`}/reminder` as any} className="flex items-center gap-2 w-full cursor-pointer">
            <Bell className="w-4 h-4" />
            {copy.identityMenu.reminderCenter}
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-2 cursor-default">
          {session.user?.preferredLocale === "en" ? (
            <Cloud className="w-4 h-4 text-green-500" />
          ) : (
            <CloudOff className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm">{copy.identityMenu.syncConnected}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <Settings className="w-4 h-4" />
          {copy.identityMenu.settings}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={handleExportClick}>
          <Download className="w-4 h-4" />
          {copy.identityMenu.exportData}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600" onClick={handleDeleteClick}>
          <Trash2 className="w-4 h-4" />
          {copy.identityMenu.deleteData}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
          <LogOut className="w-4 h-4" />
          {copy.identityMenu.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AccountDataDialog
      open={accountDialog.open}
      onOpenChange={(open) => setAccountDialog({ ...accountDialog, open })}
      mode={accountDialog.mode}
      copy={copy}
      onSignOut={handleLogout}
      onClearCache={handleClearCache}
    />
    </>
  );
}
