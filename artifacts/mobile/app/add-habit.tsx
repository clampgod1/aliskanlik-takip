import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
      <View style={[rStyles.row, { backgroundColor: colors.accent, borderColor: colors.primary + "33" }]}>
        <LinearGradient
          colors={["#6366f1", "#8b5cf6"]}
          style={rStyles.indexBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={rStyles.indexText}>{index + 1}</Text>
        </LinearGradient>
        <Pressable style={{ flex: 1 }} onPress={() => setShowPicker(!showPicker)}>
          <Text style={[rStyles.timeText, { color: colors.primary }]}>{formatTime(time)}</Text>
          <Text style={[rStyles.tapHint, { color: colors.mutedForeground }]}>değiştirmek için dokunun</Text>
        </Pressable>
        <Pressable onPress={onRemove} hitSlop={10} style={[rStyles.removeBtn, { backgroundColor: colors.destructive + "18" }]}>
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

const rStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  indexBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },
  timeText: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  tapHint: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 1 },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
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

  async function handleSave() {
    if (!canSave || isSaving) return;
    setIsSaving(true);
    await addHabit(name.trim(), emoji.trim() || "✅", reminders.map(formatTime));
    setIsSaving(false);
    router.back();
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: Platform.OS === "web" ? 50 : insets.top + 10,
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    closeBtn: {
      width: 38,
      height: 38,
      borderRadius: 13,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      letterSpacing: -0.3,
    },
    saveBtn: {
      borderRadius: 22,
      overflow: "hidden",
    },
    saveBtnInner: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 72,
    },
    saveBtnText: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
      color: canSave ? "#ffffff" : colors.mutedForeground,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: 20, gap: 24 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#4f46e5",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    cardLabel: {
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 14,
    },
    emojiRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    emojiWrapper: {
      width: 64,
      height: 64,
      borderRadius: 18,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.primary + "60",
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    emojiInput: {
      fontSize: 36,
      textAlign: "center",
      padding: 0,
      width: 56,
      height: 56,
    },
    nameWrapper: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 14,
      backgroundColor: colors.muted,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    nameInput: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      padding: 0,
      margin: 0,
    },
    emojiHint: {
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 4,
    },
    addReminderBtn: {
      borderRadius: 16,
      overflow: "hidden",
    },
    addReminderInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
    },
    addReminderText: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
    },
    reminderHint: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 10,
      textAlign: "center",
    },
  });

  return (
    <View style={s.container}>
      <LinearGradient
        colors={["#4f46e5", "#7c3aed"]}
        style={s.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={s.headerTop}>
          <Pressable style={s.closeBtn} onPress={() => router.back()}>
            <Feather name="x" size={18} color="#ffffff" />
          </Pressable>
          <Text style={s.headerTitle}>✨ Yeni Alışkanlık</Text>
          <Pressable style={s.saveBtn} onPress={handleSave} disabled={!canSave || isSaving}>
            <LinearGradient
              colors={canSave ? ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.15)"] : ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"]}
              style={s.saveBtnInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isSaving
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={s.saveBtnText}>Kaydet</Text>}
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Emoji + Name */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Alışkanlık Bilgileri</Text>
          <View style={s.emojiRow}>
            <View style={{ alignItems: "center" }}>
              <View style={s.emojiWrapper}>
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
              </View>
              <Text style={s.emojiHint}>emoji seç</Text>
            </View>
            <View style={s.nameWrapper}>
              <TextInput
                style={s.nameInput}
                placeholder="örn. Spor yap, Su iç..."
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="done"
                maxLength={60}
              />
            </View>
          </View>
        </View>

        {/* Reminders */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Hatırlatıcılar</Text>
          <View style={{ gap: 12 }}>
            {reminders.map((time, index) => (
              <ReminderRow
                key={index}
                index={index}
                time={time}
                onChange={(d) => setReminders((p) => p.map((x, i) => i === index ? d : x))}
                onRemove={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setReminders((p) => p.filter((_, i) => i !== index));
                }}
                colors={colors}
              />
            ))}
          </View>
          {reminders.length > 0 && <View style={{ height: 12 }} />}
          <Pressable style={s.addReminderBtn} onPress={addReminder}>
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              style={s.addReminderInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="bell" size={17} color="#ffffff" />
              <Text style={s.addReminderText}>+ Hatırlatma Saati Ekle</Text>
            </LinearGradient>
          </Pressable>
          <Text style={s.reminderHint}>
            {reminders.length === 0
              ? "İstersen hatırlatma ekleyebilirsin, zorunlu değil."
              : `${reminders.length} hatırlatma — her gün bu saatlerde bildirim gelir 🔔`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
