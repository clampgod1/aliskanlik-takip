import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHabits } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

const EMOJIS = ["🏃", "💧", "📚", "🧘", "🍎", "😴", "💪", "🧹", "✍️", "🎯", "🎵", "🌿"];

export default function AddHabitScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addHabit } = useHabits();

  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🏃");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState(() => {
    const d = new Date();
    d.setHours(20, 0, 0, 0);
    return d;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = name.trim().length > 0;

  function formatTime(date: Date) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  async function handleSave() {
    if (!canSave || isSaving) return;
    setIsSaving(true);
    const reminderTime = reminderEnabled ? formatTime(reminderDate) : null;
    await addHabit(name.trim(), selectedEmoji, reminderTime);
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
    headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    saveBtn: {
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 22,
      backgroundColor: canSave ? "#4f46e5" : colors.muted,
    },
    saveBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: canSave ? "#ffffff" : colors.mutedForeground,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: 24, gap: 24 },
    section: { gap: 10 },
    label: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    previewRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: "#f0f0ff",
      borderRadius: 14,
      padding: 14,
    },
    previewEmoji: { fontSize: 30 },
    inputWrapper: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.muted,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    input: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      padding: 0,
      margin: 0,
    },
    emojiGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    emojiBtn: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
    },
    emojiBtnText: { fontSize: 26 },
    reminderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.muted,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    reminderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    reminderIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: "#ede9fe",
      alignItems: "center",
      justifyContent: "center",
    },
    reminderLabel: { fontSize: 15, fontFamily: "Inter_500Medium", color: colors.foreground },
    timePickerBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: "#ede9fe",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    timeText: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#4f46e5",
    },
    timeHint: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 6,
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
        {/* Name + Emoji Preview */}
        <View style={s.section}>
          <Text style={s.label}>Alışkanlık</Text>
          <View style={s.previewRow}>
            <Text style={s.previewEmoji}>{selectedEmoji}</Text>
            <View style={s.inputWrapper}>
              <TextInput
                style={s.input}
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

        {/* Emoji Picker */}
        <View style={s.section}>
          <Text style={s.label}>Emoji Seç</Text>
          <View style={s.emojiGrid}>
            {EMOJIS.map((emoji) => (
              <Pressable
                key={emoji}
                style={[
                  s.emojiBtn,
                  {
                    borderColor: selectedEmoji === emoji ? "#4f46e5" : colors.border,
                    backgroundColor:
                      selectedEmoji === emoji ? "#ede9fe" : colors.muted,
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedEmoji(emoji);
                }}
              >
                <Text style={s.emojiBtnText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Reminder */}
        <View style={s.section}>
          <Text style={s.label}>Hatırlatıcı</Text>
          <View style={s.reminderRow}>
            <View style={s.reminderLeft}>
              <View style={s.reminderIcon}>
                <Feather name="bell" size={18} color="#4f46e5" />
              </View>
              <Text style={s.reminderLabel}>Hatırlatma saati</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={(v) => {
                setReminderEnabled(v);
                if (v) setShowTimePicker(true);
              }}
              trackColor={{ false: colors.border, true: "#c7d2fe" }}
              thumbColor={reminderEnabled ? "#4f46e5" : "#ffffff"}
            />
          </View>

          {reminderEnabled && (
            <>
              <Pressable
                style={s.timePickerBtn}
                onPress={() => setShowTimePicker(!showTimePicker)}
              >
                <Feather name="clock" size={20} color="#4f46e5" />
                <Text style={s.timeText}>{formatTime(reminderDate)}</Text>
              </Pressable>
              <Text style={s.timeHint}>Her gün bu saatte bildirim gelecek.</Text>

              {showTimePicker && (
                <DateTimePicker
                  value={reminderDate}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, date) => {
                    if (Platform.OS !== "ios") setShowTimePicker(false);
                    if (date) setReminderDate(date);
                  }}
                  is24Hour
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
