import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

function ThemeOption({
  label,
  emoji,
  value,
  current,
  onPress,
  colors,
}: {
  label: string;
  emoji: string;
  value: ThemeMode;
  current: ThemeMode;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const isSelected = current === value;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        optStyles.btn,
        {
          backgroundColor: isSelected ? colors.accent : colors.muted,
          borderColor: isSelected ? colors.primary : colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {isSelected && (
        <LinearGradient
          colors={["#6366f1", "#8b5cf6"]}
          style={optStyles.selectedBar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      )}
      <Text style={optStyles.emoji}>{emoji}</Text>
      <Text style={[optStyles.label, { color: isSelected ? colors.primary : colors.foreground }]}>
        {label}
      </Text>
      {isSelected && (
        <View style={[optStyles.checkBadge, { backgroundColor: colors.primary }]}>
          <Feather name="check" size={10} color="#fff" />
        </View>
      )}
    </Pressable>
  );
}

const optStyles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 16,
    overflow: "hidden",
    gap: 6,
  },
  selectedBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },
  emoji: { fontSize: 24 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  checkBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { mode, isDark, setMode } = useTheme();

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
    scroll: { flex: 1 },
    scrollContent: { padding: 20, gap: 16 },
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
    themeOptions: { flexDirection: "row", gap: 10 },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    toggleLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 14,
      overflow: "hidden",
    },
    iconGradient: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    toggleLabel: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    toggleSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 2,
    },
    infoRow: {
      flexDirection: "row",
      gap: 14,
      alignItems: "flex-start",
    },
    infoBadge: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
    },
    version: {
      textAlign: "center",
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 8,
      marginBottom: 16,
    },
  });

  return (
    <View style={s.container}>
      <LinearGradient
        colors={isDark ? ["#1a1040", "#0e0e1a"] : ["#4f46e5", "#7c3aed"]}
        style={s.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={s.headerTop}>
          <Pressable style={s.closeBtn} onPress={() => router.back()}>
            <Feather name="x" size={18} color="#ffffff" />
          </Pressable>
          <Text style={s.headerTitle}>⚙️ Ayarlar</Text>
          <View style={{ width: 38 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Picker */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Tema Seçimi</Text>
          <View style={s.themeOptions}>
            <ThemeOption label="Açık" emoji="☀️" value="light" current={mode} onPress={() => setMode("light")} colors={colors} />
            <ThemeOption label="Koyu" emoji="🌙" value="dark" current={mode} onPress={() => setMode("dark")} colors={colors} />
            <ThemeOption label="Sistem" emoji="📱" value="system" current={mode} onPress={() => setMode("system")} colors={colors} />
          </View>
        </View>

        {/* Quick Toggle */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Hızlı Geçiş</Text>
          <View style={s.toggleRow}>
            <View style={s.toggleLeft}>
              <View style={s.iconCircle}>
                <LinearGradient
                  colors={isDark ? ["#3730a3", "#6366f1"] : ["#fbbf24", "#f59e0b"]}
                  style={s.iconGradient}
                >
                  <Feather name={isDark ? "moon" : "sun"} size={20} color="#ffffff" />
                </LinearGradient>
              </View>
              <View>
                <Text style={s.toggleLabel}>{isDark ? "Koyu Mod" : "Açık Mod"}</Text>
                <Text style={s.toggleSub}>{isDark ? "Karanlık tema aktif" : "Aydınlık tema aktif"}</Text>
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

        {/* Notification info */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Bildirimler</Text>
          <View style={s.infoRow}>
            <View style={s.infoBadge}>
              <Text style={{ fontSize: 20 }}>🔔</Text>
            </View>
            <Text style={s.infoText}>
              Bildirimler yalnızca telefon veya tablette çalışır. Her alışkanlık için birden fazla hatırlatma saati seçebilirsin.
            </Text>
          </View>
        </View>

        <Text style={s.version}>Alışkanlık Takip v1.0 ✨</Text>
      </ScrollView>
    </View>
  );
}
