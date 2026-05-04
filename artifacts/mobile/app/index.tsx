import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
import { useTheme } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";

const CARD_ACCENT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
];

function getAccentColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return CARD_ACCENT_COLORS[Math.abs(hash) % CARD_ACCENT_COLORS.length];
}

function HabitRow({
  habit,
  accentColor,
  onToggle,
  onDelete,
}: {
  habit: Habit;
  accentColor: string;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(habit.isDone ? 1 : 0)).current;
  const checkRotate = useRef(new Animated.Value(0)).current;

  function handleToggle() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const goingDone = !habit.isDone;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, damping: 12, stiffness: 200, useNativeDriver: true }),
    ]).start();
    if (goingDone) {
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, damping: 8, stiffness: 260, useNativeDriver: true }),
        Animated.timing(checkRotate, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(checkScale, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(checkRotate, { toValue: 0, duration: 120, useNativeDriver: true }),
      ]).start();
    }
    onToggle();
  }

  function handleLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Alışkanlığı Sil", `"${habit.emoji} ${habit.name}" silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      { text: "Sil 🗑️", style: "destructive", onPress: onDelete },
    ]);
  }

  const spin = checkRotate.interpolate({ inputRange: [0, 1], outputRange: ["-30deg", "0deg"] });

  return (
    <Pressable onPress={handleToggle} onLongPress={handleLongPress} delayLongPress={400}>
      <Animated.View
        style={[
          rowStyles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Left accent bar */}
        <View style={[rowStyles.accentBar, { backgroundColor: habit.isDone ? colors.border : accentColor }]} />

        {/* Emoji badge */}
        <View style={[rowStyles.emojiBadge, {
          backgroundColor: habit.isDone ? colors.muted : accentColor + "18",
        }]}>
          <Text style={rowStyles.emojiText}>{habit.emoji}</Text>
        </View>

        {/* Content */}
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

        {/* Checkbox */}
        <Pressable onPress={handleToggle} hitSlop={12} style={[
          rowStyles.checkbox,
          {
            borderColor: habit.isDone ? accentColor : colors.border,
            backgroundColor: habit.isDone ? accentColor : "transparent",
          },
        ]}>
          <Animated.View style={{ transform: [{ scale: checkScale }, { rotate: spin }] }}>
            <Feather name="check" size={14} color="#ffffff" strokeWidth={3} />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    paddingRight: 16,
    paddingVertical: 14,
  },
  accentBar: {
    width: 4,
    alignSelf: "stretch",
    marginRight: 12,
    borderRadius: 2,
  },
  emojiBadge: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emojiText: { fontSize: 22 },
  name: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
  },
  times: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 3,
    letterSpacing: 0.1,
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
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { habits, toggleHabit, deleteHabit, isLoading } = useHabits();
  const { show: showToast } = useToast();

  const doneCount = habits.filter((h) => h.isDone).length;
  const total = habits.length;
  const allDone = total > 0 && doneCount === total;
  const progress = total > 0 ? doneCount / total : 0;

  async function handleToggle(habit: Habit) {
    const goingDone = !habit.isDone;
    await toggleHabit(habit.id);
    showToast(goingDone ? "Helal! Devam et 🔥" : "Hadi tekrar dene 😅");
    if (goingDone && doneCount + 1 === total) {
      setTimeout(() => showToast("Bugünü fulledin! 🎉🔥"), 700);
    }
  }

  const gradientColors: [string, string] = isDark
    ? ["#1a1040", "#0e0e1a"]
    : ["#4f46e5", "#7c3aed"];

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: Platform.OS === "web" ? 50 : insets.top + 10,
      paddingHorizontal: 20,
      paddingBottom: 28,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    greeting: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: "rgba(255,255,255,0.7)",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      letterSpacing: -0.5,
    },
    settingsBtn: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    statsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 16,
    },
    statChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 5,
    },
    statText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: "#ffffff",
    },
    allDoneChip: {
      backgroundColor: "rgba(255,255,255,0.25)",
    },
    progressTrack: {
      height: 4,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.25)",
      marginTop: 12,
      overflow: "hidden",
    },
    progressFill: {
      height: 4,
      borderRadius: 2,
      backgroundColor: "#ffffff",
      width: `${progress * 100}%`,
    },
    body: { flex: 1, marginTop: -12 },
    listContent: {
      paddingTop: 16,
      paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 100,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingTop: 60,
    },
    emptyBadge: {
      width: 100,
      height: 100,
      borderRadius: 30,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 6,
    },
    emptyEmoji: { fontSize: 48 },
    emptyTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 10,
      letterSpacing: -0.3,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
    },
    emptyArrow: {
      marginTop: 40,
      alignItems: "center",
      gap: 6,
    },
    emptyArrowText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: Platform.OS === "web" ? 50 : insets.bottom + 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      overflow: "hidden",
      shadowColor: "#4f46e5",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 10,
    },
    fabGradient: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  if (isLoading) {
    return (
      <View style={[s.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const today = new Date();
  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`;

  return (
    <View style={s.container}>
      <LinearGradient colors={gradientColors} style={s.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.greeting}>{dateStr}</Text>
            <Text style={s.title}>Bugünkü Görevlerin 💪</Text>
          </View>
          <Pressable
            style={({ pressed }) => [s.settingsBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() => router.push("/settings")}
          >
            <Feather name="settings" size={20} color="#ffffff" />
          </Pressable>
        </View>

        {total > 0 && (
          <>
            <View style={s.statsRow}>
              <View style={s.statChip}>
                <Feather name="check-circle" size={13} color="#ffffff" />
                <Text style={s.statText}>{doneCount}/{total} tamamlandı</Text>
              </View>
              {allDone && (
                <View style={[s.statChip, s.allDoneChip]}>
                  <Text style={s.statText}>Bugünü fulledin! 🔥</Text>
                </View>
              )}
            </View>
            <View style={s.progressTrack}>
              <View style={s.progressFill} />
            </View>
          </>
        )}
      </LinearGradient>

      <View style={s.body}>
        <FlatList
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
              accentColor={getAccentColor(item.id)}
              onToggle={() => handleToggle(item)}
              onDelete={() => deleteHabit(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.emptyContainer}>
              <View style={s.emptyBadge}>
                <Text style={s.emptyEmoji}>📋</Text>
              </View>
              <Text style={s.emptyTitle}>Henüz alışkanlık yok</Text>
              <Text style={s.emptyText}>
                Küçük adımlar büyük değişimler yaratır.{"\n"}İlk alışkanlığını ekleyerek başla!
              </Text>
              <View style={s.emptyArrow}>
                <Text style={s.emptyArrowText}>aşağıdaki + butonuna bas</Text>
                <Feather name="arrow-down" size={18} color={colors.mutedForeground} />
              </View>
            </View>
          }
        />
      </View>

      <Pressable
        style={({ pressed }) => [s.fab, { transform: [{ scale: pressed ? 0.92 : 1 }] }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/add-habit");
        }}
      >
        <LinearGradient
          colors={["#6366f1", "#4f46e5"]}
          style={s.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name="plus" size={28} color="#ffffff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}
