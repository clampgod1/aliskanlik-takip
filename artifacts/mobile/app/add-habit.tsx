import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHabits } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

function makeDefaultTime(): Date {
  const d = new Date();
  d.setHours(20, 0, 0, 0);
  return d;
}

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function ReminderRow({
  time,
  index,
  onChange,
  onRemove,
  colors,
}: {
  time: Date;
  index: number;
  onChange: (date: Date) => void;
  onRemove: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      <View style={reminderStyles.row}>
        <View style={[reminderStyles.indexBadge, { backgroundColor: colors.accent }]}>
          <Text style={[reminderStyles.indexText, { color: colors.primary }]}>
            {index + 1}
          </Text>
        </View>
        <Pressable
          style={[reminderStyles.timeBtn, { backgroundColor: colors.accent, borderColor: colors.primary + "44" }]}
          onPress={() => setShowPicker(!showPicker)}
        >
          <Feather name="clock" size={16} color={colors.primary} />
          <Text style={[reminderStyles.timeText, { color: colors.primary }]}>
            {formatTime(time)}
          </Text>
        </Pressable>
        <Pressable
          style={[reminderStyles.removeBtn, { backgroundColor: colors.muted }]}
          onPress={onRemove}
          hitSlop={8}
        >
          <Feather name="trash-2" size={16} color={colors.destructive} />
        </Pressable>
      </View>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            if (Platform.OS !== "ios") setShowPicker(false);
            if (date) onChange(date);
          }}
          is24Hour
        />
      )}
    </View>
  );
}

const reminderStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  timeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  timeText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  removeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function AddHabitScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addHabit } = useHabits();

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏃");
  const [reminders, setReminders] = useState<Date[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const emojiRef = useRef<TextInput>(null);

  const canSave = name.trim().length > 0;

  function addReminder() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReminders((prev) => [...prev, makeDefaultTime()]);
  }

  function updateReminder(index: number, date: Date) {
    setReminders((prev) => prev.map((d, i) => (i === index ? date : d)));
  }

  function removeReminder(index: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReminders((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!canSave || isSaving) return;
    setIsSaving(true);
    const reminderTimes = reminders.map(formatTime);
    await addHabit(name.trim(), emoji.trim() || "✅", reminderTimes);
    setIsSaving(false);
    router.back();
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: Platform.OS === "web" ? 60 : insets.top + 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    saveBtn: {
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 22,
      backgroundColor: canSave ? colors.primary : colors.muted,
    },
    saveBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: canSave ? "#ffffff" : colors.mutedForeground,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: 24, gap: 28 },
    sectionLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 12,
    },
    previewCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.accent,
      borderRadius: 16,
      padding: 14,
      gap: 12,
    },
    emojiInput: {
      fontSize: 36,
      width: 60,
      textAlign: "center",
      padding: 0,
      margin: 0,
    },
    emojiHint: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 4,
    },
    divider: { width: 1, height: 48, backgroundColor: colors.border },
    nameInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      padding: 0,
      margin: 0,
    },
    addReminderBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 13,
      borderRadius: 14,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.primary + "88",
      backgroundColor: colors.accent + "55",
    },
    addReminderText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    reminderHint: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 8,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={s.headerTitle}>Yeni Alışkanlık</Text>
        <Pressable style={s.saveBtn} onPress={handleSave} disabled={!canSave || isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={s.saveBtnText}>Kaydet</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Emoji + Name */}
        <View>
          <Text style={s.sectionLabel}>Alışkanlık</Text>
          <View style={s.previewCard}>
            <View style={{ alignItems: "center" }}>
              <TextInput
                ref={emojiRef}
                style={[s.emojiInput, { color: colors.foreground }]}
                value={emoji}
                onChangeText={(t) => {
                  const chars = [...t];
                  if (chars.length > 0) setEmoji(chars[chars.length - 1]);
                  else setEmoji("");
                }}
                maxLength={8}
                returnKeyType="next"
              />
              <Text style={s.emojiHint}>emoji</Text>
            </View>
            <View style={s.divider} />
            <TextInput
              style={s.nameInput}
              placeholder="Alışkanlık adı gir..."
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="done"
              maxLength={60}
            />
          </View>
        </View>

        {/* Reminders */}
        <View>
          <Text style={s.sectionLabel}>Hatırlatıcılar</Text>

          <View style={{ gap: 12 }}>
            {reminders.map((time, index) => (
              <ReminderRow
                key={index}
                index={index}
                time={time}
                onChange={(d) => updateReminder(index, d)}
                onRemove={() => removeReminder(index)}
                colors={colors}
              />
            ))}
          </View>

          {reminders.length > 0 && <View style={{ height: 12 }} />}

          <Pressable
            style={({ pressed }) => [s.addReminderBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={addReminder}
          >
            <Feather name="bell-plus" size={18} color={colors.primary} />
            <Text style={s.addReminderText}>Hatırlatma saati ekle</Text>
          </Pressable>

          <Text style={s.reminderHint}>
            {reminders.length === 0
              ? "Hatırlatma istemiyorsan boş bırakabilirsin."
              : `${reminders.length} hatırlatma eklenecek — her gün aynı saatlerde bildirim gelir.`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
