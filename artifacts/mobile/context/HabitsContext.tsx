import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { cancelHabitNotification, scheduleHabitNotification } from "@/hooks/useNotifications";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  isDone: boolean;
  doneDate: string | null;
  reminderTime: string | null;
  notificationId: string | null;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (name: string, emoji: string, reminderTime: string | null) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  isLoading: boolean;
}

const STORAGE_KEY = "@habits_v2";

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Habit[] = JSON.parse(raw);
        const today = getTodayString();
        const reset = parsed.map((h) => ({
          ...h,
          isDone: h.doneDate === today ? h.isDone : false,
          doneDate: h.doneDate === today ? h.doneDate : null,
        }));
        setHabits(reset);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function saveHabits(updated: Habit[]) {
    setHabits(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const addHabit = useCallback(
    async (name: string, emoji: string, reminderTime: string | null) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      let notificationId: string | null = null;
      if (reminderTime) {
        notificationId = await scheduleHabitNotification(
          generateId(),
          trimmed,
          emoji,
          reminderTime
        );
      }

      const newHabit: Habit = {
        id: generateId(),
        name: trimmed,
        emoji,
        isDone: false,
        doneDate: null,
        reminderTime,
        notificationId,
      };
      await saveHabits([...habits, newHabit]);
    },
    [habits]
  );

  const toggleHabit = useCallback(
    async (id: string) => {
      const today = getTodayString();
      const updated = habits.map((h) => {
        if (h.id !== id) return h;
        const newDone = !h.isDone;
        return {
          ...h,
          isDone: newDone,
          doneDate: newDone ? today : null,
        };
      });
      await saveHabits(updated);
    },
    [habits]
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      const habit = habits.find((h) => h.id === id);
      if (habit?.notificationId) {
        await cancelHabitNotification(habit.notificationId);
      }
      await saveHabits(habits.filter((h) => h.id !== id));
    },
    [habits]
  );

  return (
    <HabitsContext.Provider
      value={{ habits, addHabit, toggleHabit, deleteHabit, isLoading }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits(): HabitsContextType {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used inside HabitsProvider");
  return ctx;
}
