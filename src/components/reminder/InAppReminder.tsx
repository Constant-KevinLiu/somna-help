/**
 * In-App Reminder Dialog
 *
 * Displays a prominent reminder with complete, snooze, and dismiss actions.
 */
import { useState, useEffect } from "react";
import { Bell, Check, Clock, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  setInAppDeliveryCallback,
  type InAppDeliveryEvent,
} from "@/services/habit/habit-delivery";
import { useReminders } from "@/hooks/useReminders";

interface ActiveReminder {
  reminder: any;
  occurrence: any;
}

export function InAppReminderProvider() {
  const { completeOccurrence, snoozeOccurrence, dismissOccurrence, reminders } = useReminders();
  const [activeReminder, setActiveReminder] = useState<ActiveReminder | null>(null);

  useEffect(() => {
    // Register callback for in-app delivery
    setInAppDeliveryCallback((event: InAppDeliveryEvent) => {
      setActiveReminder({
        reminder: event.reminder,
        occurrence: event.occurrence,
      });
    });

    // Also check currently due occurrences on mount
    return () => {
      setInAppDeliveryCallback(() => {});
    };
  }, []);

  const handleComplete = () => {
    if (activeReminder) {
      completeOccurrence(activeReminder.occurrence.id);
      setActiveReminder(null);
    }
  };

  const handleSnooze = (minutes: number) => {
    if (activeReminder) {
      snoozeOccurrence(activeReminder.occurrence.id, minutes);
      setActiveReminder(null);
    }
  };

  const handleDismiss = () => {
    if (activeReminder) {
      dismissOccurrence(activeReminder.occurrence.id);
      setActiveReminder(null);
    }
  };

  if (!activeReminder) return null;

  const { reminder, occurrence } = activeReminder;
  const snoozeOptions = reminder.snoozeOptionsMinutes || [5, 10, 15];

  return (
    <Dialog open={true} onOpenChange={() => setActiveReminder(null)}>
      <DialogContent className="sm:max-w-md border-indigo-200 bg-gradient-to-b from-indigo-50 to-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-indigo-100 p-2">
              <Bell className="h-6 w-6 text-indigo-600 animate-pulse" />
            </div>
            <DialogTitle className="text-xl">{reminder.title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {reminder.message || "Your scheduled check-in is ready."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 py-4">
          {snoozeOptions.map((minutes: number) => (
            <Button
              key={minutes}
              variant="secondary"
              size="sm"
              onClick={() => handleSnooze(minutes)}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              +{minutes}m
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleComplete}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Done
          </Button>
          <Button
            variant="secondary"
            onClick={handleDismiss}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Mini reminder indicator for the header
 */
export function ReminderIndicator() {
  const { currentlyDueOccurrences } = useReminders();

  if (currentlyDueOccurrences.length === 0) return null;

  return (
    <Badge variant="secondary" className="ml-2 flex items-center gap-1">
      <Bell className="h-3 w-3" />
      {currentlyDueOccurrences.length}
    </Badge>
  );
}
