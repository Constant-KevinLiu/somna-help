/**
 * Notification Permission Component
 *
 * Explains and manages browser notification permissions.
 * Follows privacy-first principles.
 */
import { useState, useEffect } from "react";
import { Bell, BellOff, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  isNotificationSupported,
  getCurrentPermission,
  requestNotificationPermission,
  sendTestNotification,
} from "@/services/habit/notification-service";
import { loadNotificationPrefs, saveNotificationPrefs } from "@/services/habit/habit-storage";

export function NotificationPermissionSettings() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [prefs, setPrefs] = useState(loadNotificationPrefs());
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    setPermission(getCurrentPermission());
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    const result = await requestNotificationPermission();
    setPermission(result);
    setPrefs(loadNotificationPrefs());
    setIsRequesting(false);
  };

  const handleToggleSensitiveContent = (checked: boolean) => {
    saveNotificationPrefs({
      ...prefs,
      showSensitiveContent: checked,
    });
    setPrefs(loadNotificationPrefs());
  };

  const handleSendTest = async () => {
    await sendTestNotification();
  };

  if (!isNotificationSupported()) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Browser notifications are not supported in this browser. In-app reminders will still work
          while the app is open.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Browser Notifications
        </CardTitle>
        <CardDescription>Receive reminders even when you're on another tab.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {permission === "granted" ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Notifications are enabled.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <div className="font-medium">Show custom reminder text</div>
                <div className="text-sm text-gray-500">
                  By default, notifications show generic text to protect your privacy. Enable this
                  to show your reminder title and message.
                </div>
              </div>
              <Switch
                checked={prefs.showSensitiveContent}
                onCheckedChange={handleToggleSensitiveContent}
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>
                Your privacy is our priority. Notification data never leaves your browser.
              </span>
            </div>

            <Button variant="secondary" onClick={handleSendTest} className="w-full">
              Send Test Notification
            </Button>
          </div>
        ) : permission === "denied" ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <BellOff className="h-4 w-4" />
              <AlertDescription>
                Notifications are blocked. You can enable them in your browser settings. In-app
                reminders will still work.
              </AlertDescription>
            </Alert>

            <div className="text-sm text-gray-500">
              <p className="font-medium">To enable notifications:</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>Click the lock icon in your browser's address bar</li>
                <li>Find "Notifications" in site settings</li>
                <li>Select "Allow"</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="font-medium text-blue-900">Why enable notifications?</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                <li>• Never miss a bedtime or morning check-in</li>
                <li>• Receive gentle reminders on your schedule</li>
                <li>• Build consistent sleep habits</li>
                <li>• Works even when you're on other browser tabs</li>
              </ul>
            </div>

            <Button onClick={handleEnableNotifications} disabled={isRequesting} className="w-full">
              {isRequesting ? "Requesting permission..." : "Enable Notifications"}
            </Button>

            <p className="text-center text-xs text-gray-500">
              You can disable notifications at any time in your browser settings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
