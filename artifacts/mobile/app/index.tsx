import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  function handleLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Alışkanlığı Sil", `"${habit.name}" silinsin mi?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  }

  function handleToggle() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  }

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginVertical: 5,
      borderRadius: colors.radius,
      paddingHorizontal: 18,
      paddingVertical: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    name: {
      flex: 1,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: habit.isDone ? colors.mutedForeground : colors.foreground,
      textDecorationLine: habit.isDone ? "line-through" : "none",
      marginRight: 12,
    },
    checkbox: {
      width: 26,
      height: 26,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: habit.isDone ? colors.primary : colors.border,
      backgroundColor: habit.isDone ? colors.primary : "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.75 : 1 }]}
      onPress={handleToggle}
      onLongPress={handleLongPress}
      delayLongPress={400}
    >
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {habit.name}
      </Text>
      <View style={styles.checkbox}>
        {habit.isDone && (
          <Feather name="check" size={15} color={colors.primaryForeground} />
        )}
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { habits, toggleHabit, deleteHabit, isLoading } = useHabits();

  const doneCount = habits.filter((h) => h.isDone).length;
  const total = habits.length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: Platform.OS === "web" ? 67 : insets.top + 20,
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    title: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    progressBar: {
      marginHorizontal: 20,
      marginBottom: 12,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.muted,
    },
    progressFill: {
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
      width: total > 0 ? `${(doneCount / total) * 100}%` : "0%",
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingTop: 8,
      paddingBottom: Platform.OS === "web" ? 120 : insets.bottom + 100,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingBottom: 80,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 18,
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
      lineHeight: 20,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: Platform.OS === "web" ? 50 : insets.bottom + 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 6,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alışkanlıklarım</Text>
        {total > 0 && (
          <Text style={styles.subtitle}>
            {doneCount}/{total} tamamlandı
          </Text>
        )}
      </View>

      {total > 0 && (
        <View style={styles.progressBar}>
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
            onToggle={() => toggleHabit(item.id)}
            onDelete={() => deleteHabit(item.id)}
          />
        )}
        scrollEnabled={!!habits.length}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Feather name="clipboard" size={28} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Henüz alışkanlık yok</Text>
            <Text style={styles.emptyText}>
              Sağ alttaki + butonuna basarak ilk alışkanlığını ekle.
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/add-habit");
        }}
      >
        <Feather name="plus" size={26} color="#ffffff" />
      </Pressable>
    </View>
  );
}
