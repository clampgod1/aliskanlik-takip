import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
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
  const checkScaleAnim = useRef(new Animated.Value(habit.isDone ? 1 : 0)).current;

  function animateTap(cb: () => void) {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    cb();
  }

  function animateCheck(isDone: boolean) {
    if (isDone) {
      Animated.spring(checkScaleAnim, {
        toValue: 1,
        damping: 10,
        stiffness: 220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(checkScaleAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
    }
  }

  function handleToggle() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateCheck(!habit.isDone);
    animateTap(onToggle);
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
            backgroundColor: habit.isDone ? "#f0f0ff" : "#ffffff",
            borderColor: habit.isDone ? "#c7d2fe" : "#e8e8f0",
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={rowStyles.emoji}>{habit.emoji}</Text>
        <Text
          style={[
            rowStyles.name,
            {
              color: habit.isDone ? "#9094a0" : "#1a1a2e",
              textDecorationLine: habit.isDone ? "line-through" : "none",
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {habit.name}
        </Text>
        <Pressable
          onPress={handleToggle}
          hitSlop={10}
          style={[
            rowStyles.checkbox,
            {
              borderColor: habit.isDone ? "#4f46e5" : "#d1d5db",
              backgroundColor: habit.isDone ? "#4f46e5" : "transparent",
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: checkScaleAnim }] }}>
            <Feather name="check" size={15} color="#ffffff" />
          </Animated.View>
        </Pressable>
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
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1.5,
  },
  emoji: {
    fontSize: 22,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    marginRight: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
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
    await toggleHabit(habit.id);
    if (!habit.isDone) {
      showToast("Helal! Devam et 🔥");
    } else {
      showToast("Hadi tekrar dene 😅");
    }
    if (!habit.isDone && doneCount + 1 === total) {
      setTimeout(() => showToast("Bugünü fulledin! 🎉🔥"), 600);
    }
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: Platform.OS === "web" ? 60 : insets.top + 20,
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    subtitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      gap: 8,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    allDoneBadge: {
      backgroundColor: "#dcfce7",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    allDoneText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "#16a34a",
    },
    progressTrack: {
      marginHorizontal: 20,
      marginBottom: 14,
      height: 5,
      borderRadius: 3,
      backgroundColor: "#ede9fe",
    },
    progressFill: {
      height: 5,
      borderRadius: 3,
      backgroundColor: "#4f46e5",
      width: total > 0 ? `${(doneCount / total) * 100}%` : "0%",
    },
    list: { flex: 1 },
    listContent: {
      paddingTop: 6,
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
      backgroundColor: "#4f46e5",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#4f46e5",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 14,
      elevation: 8,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bugünkü Görevlerin 💪</Text>
        <View style={styles.subtitleRow}>
          {total > 0 && (
            <Text style={styles.subtitle}>{doneCount}/{total} tamamlandı</Text>
          )}
          {allDone && (
            <View style={styles.allDoneBadge}>
              <Text style={styles.allDoneText}>Bugünü fulledin! 🔥</Text>
            </View>
          )}
        </View>
      </View>

      {total > 0 && (
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      )}

      <FlatList
        style={styles.list}
        contentContainerStyle={
          habits.length === 0
            ? [styles.listContent, { flex: 1 }]
            : styles.listContent
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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>Henüz alışkanlık yok</Text>
            <Text style={styles.emptyText}>
              Sağ alttaki + butonuna basarak{"\n"}ilk alışkanlığını ekle.
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.fab,
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
