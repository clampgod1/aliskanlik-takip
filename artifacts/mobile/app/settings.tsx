import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme, type ThemeMode } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";

function ThemeOptionButton({
  label,
  icon,
  value,
  current,
  onPress,
}: {
  label: string;
  icon: string;
  value: ThemeMode;
  current: ThemeMode;
  onPress: () => void;
}) {
  const colors = useColors();
  const isSelected = current === value;
  return (
    <Pressable
      onPress={onPress}
      style={[
        optStyles.optBtn,
        {
          backgroundColor: isSelected ? colors.accent : colors.muted,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
    >
      <Feather
        name={icon as any}
        size={20}
        color={isSelected ? colors.primary : colors.mutedForeground}
      />
      <Text
        style={[
          optStyles.optLabel,
          { color: isSelected ? colors.primary : colors.foreground },
        ]}
      >
        {label}
      </Text>
      {isSelected && (
        <View style={[optStyles.dot, { backgroundColor: colors.primary }]} />
      )}
    </Pressable>
  );
}

const optStyles = StyleSheet.create({
  optBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  optLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { mode, isDark, setMode } = useTheme();

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
    themeOptions: {
      flexDirection: "row",
      gap: 10,
    },
    quickToggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickToggleLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    toggleIcon: {
      width: 38,
      height: 38,
      borderRadius: 11,
      backgroundColor: isDark ? "#252548" : "#ede9fe",
      alignItems: "center",
      justifyContent: "center",
    },
    toggleLabel: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    toggleSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    infoCard: {
      backgroundColor: colors.muted,
      borderRadius: 14,
      padding: 16,
      gap: 6,
    },
    infoText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={s.headerTitle}>Ayarlar</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme mode picker */}
        <View>
          <Text style={s.sectionLabel}>Tema</Text>
          <View style={s.themeOptions}>
            <ThemeOptionButton
              label="Açık"
              icon="sun"
              value="light"
              current={mode}
              onPress={() => setMode("light")}
            />
            <ThemeOptionButton
              label="Koyu"
              icon="moon"
              value="dark"
              current={mode}
              onPress={() => setMode("dark")}
            />
            <ThemeOptionButton
              label="Sistem"
              icon="smartphone"
              value="system"
              current={mode}
              onPress={() => setMode("system")}
            />
          </View>
        </View>

        {/* Quick dark mode toggle */}
        <View>
          <Text style={s.sectionLabel}>Hızlı Geçiş</Text>
          <View style={s.quickToggleRow}>
            <View style={s.quickToggleLeft}>
              <View style={s.toggleIcon}>
                <Feather
                  name={isDark ? "moon" : "sun"}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View>
                <Text style={s.toggleLabel}>
                  {isDark ? "Koyu Mod Açık" : "Koyu Mod Kapalı"}
                </Text>
                <Text style={s.toggleSub}>
                  {isDark ? "Karanlık tema aktif" : "Aydınlık tema aktif"}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={(v) => setMode(v ? "dark" : "light")}
              trackColor={{ false: colors.switchTrackFalse, true: "#c7d2fe" }}
              thumbColor={isDark ? colors.primary : "#ffffff"}
            />
          </View>
        </View>

        {/* Info */}
        <View style={s.infoCard}>
          <Text style={[s.infoText, { fontFamily: "Inter_600SemiBold", color: colors.foreground }]}>
            💡 Bildirimler hakkında
          </Text>
          <Text style={s.infoText}>
            Bildirimler yalnızca telefon veya tablette çalışır. Web önizlemesinde bildirim gönderilmez.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
