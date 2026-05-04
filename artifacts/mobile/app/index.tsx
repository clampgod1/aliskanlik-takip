import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToast } from "@/components/Toast";
import { useHabits, type Habit } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

function HabitRow({
  habit,
  onToggle,
  onDelete,
}: {
  habit: Habit;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(habit.isDone ? 1 : 0)).current;

  function handleToggle() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const goingDone = !habit.isDone;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    if (goingDone) {
      Animated.spring(checkScale, { toValue: 1, damping: 10, stiffness: 220, useNativeDriver: true }).start();
    } else {
      Animated.timing(checkScale, { toValue: 0, duration: 120, useNativeDriver: true }).start();
    }
    onToggle();
  }

  function handleLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Alışkanlığı Sil", `"${habit.emoji} ${habit.name}" silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: onDelete },
    ]);
  }

  return (
    <Pressable onPress={handleToggle} onLongPress={handleLongPress} delayLongPress={400}>
      <Animated.View
        style={[
          rowStyles.row,
          {
            backgroundColor: habit.isDone
              ? colors.accent
              : colors.card,
            borderColor: habit.isDone ? colors.primary + "55" : colors.border,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={rowStyles.emoji}>{habit.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              rowStyles.name,
              {
                color: habit.isDone ? colors.mutedForeground : colors.foreground,
                textDecorationLine: habit.isDone ? "line-through" : "none",
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {habit.name}
          </Text>
          {habit.reminderTimes.length > 0 && (
            <Text style={[rowStyles.times, { color: colors.mutedForeground }]}>
              🔔 {habit.reminderTimes.join(" · ")}
            </Text>
          )}
        </View>
        <View
          style={[
            rowStyles.checkbox,
            {
              borderColor: habit.isDone ? colors.primary : colors.border,
              backgroundColor: habit.isDone ? colors.primary : "transparent",
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            <Feather name="check" size={15} color="#ffffff" />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1.5,
  },
  emoji: { fontSize: 24, marginRight: 12 },
  name: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  times: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { habits, toggleHabit, deleteHabit, isLoading } = useHabits();
  const { show: showToast } = useToast();

  const doneCount = habits.filter((h) => h.isDone).length;
  const total = habits.length;
  const allDone = total > 0 && doneCount === total;

  async function handleToggle(habit: Habit) {
    const goingDone = !habit.isDone;
    await toggleHabit(habit.id);
    showToast(goingDone ? "Helal! Devam et 🔥" : "Hadi tekrar dene 😅");
    if (goingDone && doneCount + 1 === total) {
      setTimeout(() => showToast("Bugünü fulledin! 🎉🔥"), 700);
    }
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: Platform.OS === "web" ? 56 : insets.top + 16,
      paddingHorizontal: 20,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    headerLeft: { flex: 1 },
    title: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    subtitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      gap: 8,
      flexWrap: "wrap",
    },
    subtitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    allDoneBadge: {
      backgroundColor: colors.successLight,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    allDoneText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.success,
    },
    settingsBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },
    progressTrack: {
      marginHorizontal: 20,
      marginBottom: 12,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.muted,
    },
    progressFill: {
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.primary,
      width: total > 0 ? `${(doneCount / total) * 100}%` : "0%",
    },
    list: { flex: 1 },
    listContent: {
      paddingTop: 4,
      paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 100,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingBottom: 100,
    },
    emptyEmoji: { fontSize: 56, marginBottom: 16 },
    emptyTitle: {
      fontSize: 20,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: Platform.OS === "web" ? 50 : insets.bottom + 20,
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 14,
      elevation: 8,
    },
  });

  if (isLoading) {
    return (
      <View style={[s.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.title}>Bugünkü Görevlerin 💪</Text>
          <View style={s.subtitleRow}>
            {total > 0 && (
              <Text style={s.subtitle}>{doneCount}/{total} tamamlandı</Text>
            )}
            {allDone && (
              <View style={s.allDoneBadge}>
                <Text style={s.allDoneText}>Bugünü fulledin! 🔥</Text>
              </View>
            )}
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [s.settingsBtn, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => router.push("/settings")}
        >
          <Feather name="settings" size={20} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {total > 0 && (
        <View style={s.progressTrack}>
          <View style={s.progressFill} />
        </View>
      )}

      <FlatList
        style={s.list}
        contentContainerStyle={
          habits.length === 0
            ? [s.listContent, { flex: 1 }]
            : s.listContent
        }
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitRow
            habit={item}
            onToggle={() => handleToggle(item)}
            onDelete={() => deleteHabit(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Text style={s.emptyEmoji}>📋</Text>
            <Text style={s.emptyTitle}>Henüz alışkanlık yok</Text>
            <Text style={s.emptyText}>
              Sağ alttaki + butonuna basarak{"\n"}ilk alışkanlığını ekle.
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          s.fab,
          { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.94 : 1 }] },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/add-habit");
        }}
      >
        <Feather name="plus" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
}
