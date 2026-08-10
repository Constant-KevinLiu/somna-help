/**
 * Reminders Page
 *
 * Main hub for reminder management and habit tracking.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReminderList } from "@/components/reminder/ReminderList";
import { NotificationPermissionSettings } from "@/components/reminder/NotificationPermission";
import { InAppReminderProvider } from "@/components/reminder/InAppReminder";

export const Route = createFileRoute("/reminders")({
  component: RemindersPage,
});

function RemindersPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <InAppReminderProvider />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reminders & Habits</h1>
        <p className="text-gray-500 mt-2">Build consistent sleep habits with gentle reminders.</p>
      </div>

      <Tabs defaultValue="reminders">
        <TabsList className="mb-4">
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reminders">
          <ReminderList />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <NotificationPermissionSettings />

            <Card>
              <CardHeader>
                <CardTitle>About Reminders</CardTitle>
                <CardDescription>
                  Learn how Somna reminders help build better habits.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">In-App Reminders</h4>
                  <p className="text-gray-500 mt-1">
                    Always available. Show a dialog within the app when a reminder is due.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Browser Notifications</h4>
                  <p className="text-gray-500 mt-1">
                    Work even when you're on other browser tabs. Require permission.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Privacy First</h4>
                  <p className="text-gray-500 mt-1">
                    By default, browser notifications show generic text. You can opt in to show your
                    custom reminder text in notification settings.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">No Background Push</h4>
                  <p className="text-gray-500 mt-1">
                    Currently, reminders only work while the browser is open. Close the browser and
                    you won't receive notifications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
