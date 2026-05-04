import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHabits } from "@/context/HabitsContext";
import { useColors } from "@/hooks/useColors";

export default function AddHabitScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addHabit } = useHabits();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const canSave = name.trim().length > 0;

  async function handleSave() {
    if (!canSave || isSaving) return;
    setIsSaving(true);
    await addHabit(name.trim());
    setIsSaving(false);
    router.back();
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop:
        Platform.OS === "web" ? 67 : insets.top + 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    saveBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: colors.radius,
      backgroundColor: canSave ? colors.primary : colors.muted,
    },
    saveBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: canSave ? colors.primaryForeground : colors.mutedForeground,
    },
    body: {
      padding: 24,
    },
    label: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 10,
    },
    inputWrapper: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: colors.radius,
      backgroundColor: colors.muted,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    input: {
      fontSize: 17,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      padding: 0,
      margin: 0,
    },
    hint: {
      marginTop: 10,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Feather name="x" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>Yeni Alışkanlık</Text>
        <Pressable
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={!canSave || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Text style={styles.saveBtnText}>Kaydet</Text>
          )}
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
        contentContainerStyle={styles.body}
      >
        <Text style={styles.label}>Alışkanlık Adı</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="örn. Her gün kitap oku"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
            maxLength={80}
          />
        </View>
        <Text style={styles.hint}>Günlük takip etmek istediğin alışkanlığı gir.</Text>
      </KeyboardAwareScrollView>
    </View>
  );
}
