/**
 * Reminder List Component
 *
 * Displays all reminders with their status and next occurrence time.
 */
import { useState } from "react";
import { Bell, Pause, Play, Archive, Plus, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReminders } from "@/hooks/useReminders";
import { useAllHabitProgress } from "@/hooks/useHabitProgress";
import { ReminderForm } from "./ReminderForm";
import { HabitProgressCard } from "./HabitProgressCard";
import { formatRelativeTime } from "@/lib/format";

export function ReminderList() {
  const {
    activeReminders,
    pausedReminders,
    archivedReminders,
    pauseReminder,
    resumeReminder,
    archiveReminder,
    getNextForReminder,
  } = useReminders();

  const progressMap = useAllHabitProgress([...activeReminders, ...pausedReminders]);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<any>(null);

  const handleEdit = (reminder: any) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingReminder(null);
  };

  const ReminderCard = ({ reminder }: { reminder: any }) => {
    const progress = progressMap.get(reminder.id);
    const nextOccurrence = getNextForReminder(reminder.id);

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-400" />
              <CardTitle className="text-lg">{reminder.title}</CardTitle>
            </div>
            <div className="flex gap-1">
              {reminder.status === "active" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => pauseReminder(reminder.id)}
                  title="Pause"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resumeReminder(reminder.id)}
                  title="Resume"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(reminder)}
                title="Edit"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => archiveReminder(reminder.id)}
                title="Archive"
              >
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>{reminder.message}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {nextOccurrence
                  ? formatRelativeTime(new Date(nextOccurrence.dueAt))
                  : "No upcoming occurrence"}
              </span>
            </div>
            <div className="flex gap-1">
              {reminder.channels.map((channel: string) => (
                <Badge key={channel} variant="secondary" className="text-xs">
                  {channel === "in_app" ? "In-app" : "Browser"}
                </Badge>
              ))}
            </div>
          </div>
          {progress && (
            <div className="mt-4">
              <HabitProgressCard progress={progress} compact />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reminders</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeReminders.length})
          </TabsTrigger>
          <TabsTrigger value="paused">
            Paused ({pausedReminders.length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({archivedReminders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {activeReminders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <Bell className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                <p>No active reminders yet.</p>
                <p className="text-sm">Create one to start building healthy habits.</p>
              </CardContent>
            </Card>
          ) : (
            activeReminders.map(reminder => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
          )}
        </TabsContent>

        <TabsContent value="paused" className="mt-4">
          {pausedReminders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <p>No paused reminders.</p>
              </CardContent>
            </Card>
          ) : (
            pausedReminders.map(reminder => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-4">
          {archivedReminders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                <p>No archived reminders.</p>
              </CardContent>
            </Card>
          ) : (
            archivedReminders.map(reminder => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {showForm && (
        <ReminderForm
          reminder={editingReminder}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
