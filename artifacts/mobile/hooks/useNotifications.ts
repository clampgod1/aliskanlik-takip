import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleHabitNotification(
  habitName: string,
  emoji: string,
  reminderTime: string
): Promise<string | null> {
  if (Platform.OS === "web") return null;
  try {
    const [hourStr, minuteStr] = reminderTime.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "👉 Alışkanlığını unutma!",
        body: `${emoji} ${habitName} zamanı 💪`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return id;
  } catch {
    return null;
  }
}

export async function scheduleMultipleNotifications(
  habitName: string,
  emoji: string,
  reminderTimes: string[]
): Promise<string[]> {
  const ids: string[] = [];
  for (const t of reminderTimes) {
    const id = await scheduleHabitNotification(habitName, emoji, t);
    if (id) ids.push(id);
  }
  return ids;
}

export async function cancelHabitNotification(
  notificationId: string
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {}
}

export async function cancelMultipleNotifications(ids: string[]): Promise<void> {
  for (const id of ids) {
    await cancelHabitNotification(id);
  }
}
