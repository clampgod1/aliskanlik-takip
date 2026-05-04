import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/Toast";
import { HabitsProvider } from "@/context/HabitsContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { requestNotificationPermission } from "@/hooks/useNotifications";

SplashScreen.preventAutoHideAsync();

function ThemedStack() {
  const { isDark } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: isDark ? "#0e0e1a" : "#f8f8fc" } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-habit" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="settings" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HabitsProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </HabitsProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      requestNotificationPermission();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AppProviders>
            <ThemedStack />
          </AppProviders>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
