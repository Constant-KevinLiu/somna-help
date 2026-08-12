/**
 * Reminder Form Component
 *
 * Form for creating and editing reminders with schedule configuration.
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useReminders } from "@/hooks/useReminders";
import {
  type Reminder,
  type ReminderSchedule,
  type ScheduleType,
  type ReminderChannel,
} from "@/services/habit/habit-types";

interface ReminderFormValues {
  title: string;
  message: string;
  time: string;
  scheduleType: ScheduleType;
  days: string[];
  inAppChannel: boolean;
  browserChannel: boolean;
}

interface ReminderFormProps {
  reminder?: Reminder;
  onClose: () => void;
}

const WEEKDAYS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const TIME_PRESETS = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "12:00",
  "13:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];

export function ReminderForm({ reminder, onClose }: ReminderFormProps) {
  const { createReminder, editReminder } = useReminders();
  const [scheduleType, setScheduleType] = useState<ScheduleType>("daily");

  const form = useForm({
    defaultValues: {
      title: "",
      message: "",
      time: "08:00",
      scheduleType: "daily" as ScheduleType,
      days: ["1", "2", "3", "4", "5"], // Monday-Friday by default
      inAppChannel: true,
      browserChannel: false,
    },
  });

  useEffect(() => {
    if (reminder) {
      form.reset({
        title: reminder.title,
        message: reminder.message || "",
        time: reminder.schedule.time,
        scheduleType: reminder.schedule.type,
        days: reminder.schedule.days?.map(String) || [],
        inAppChannel: reminder.channels.includes("in_app"),
        browserChannel: reminder.channels.includes("browser_notification"),
      });
      setScheduleType(reminder.schedule.type);
    }
  }, [reminder, form]);

  const onSubmit = (values: ReminderFormValues) => {
    const schedule: ReminderSchedule = {
      type: values.scheduleType,
      time: values.time,
      days: values.scheduleType === "weekdays" ? values.days.map(Number) : undefined,
    };

    const channels: ReminderChannel[] = [];
    if (values.inAppChannel) channels.push("in_app");
    if (values.browserChannel) channels.push("browser_notification");

    if (reminder) {
      editReminder(reminder.id, {
        title: values.title,
        message: values.message,
        schedule,
        channels,
      });
    } else {
      createReminder({
        title: values.title,
        message: values.message,
        schedule,
        channels,
      });
    }

    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{reminder ? "Edit Reminder" : "Create Reminder"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Morning check-in" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Time to log your sleep..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Schedule</h3>

              <FormField
                control={form.control}
                name="scheduleType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setScheduleType(value as ScheduleType);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekdays">Specific days</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_PRESETS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {scheduleType === "weekdays" && (
                <FormField
                  control={form.control}
                  name="days"
                  render={() => (
                    <FormItem>
                      <FormLabel>Repeat on</FormLabel>
                      <div className="grid grid-cols-4 gap-2">
                        {WEEKDAYS.map((day) => (
                          <FormField
                            key={day.value}
                            control={form.control}
                            name="days"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={day.value}
                                  className="flex flex-row items-center space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(day.value)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, day.value])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value: string) => value !== day.value,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="ml-2 text-sm">
                                    {day.label.slice(0, 3)}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Delivery Channels</h3>

              <FormField
                control={form.control}
                name="inAppChannel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>In-app reminder</FormLabel>
                      <FormDescription>Show a reminder while the app is open</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="browserChannel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Browser notification</FormLabel>
                      <FormDescription>Require permission to show notifications</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{reminder ? "Save Changes" : "Create Reminder"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
