import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingScreen } from "../src/Frontend/onboarding";

const ONBOARDING_COMPLETED_KEY = "@octopus/onboarding-completed";

export default function IndexScreen() {
  const [isReady, setIsReady] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const finishingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadOnboardingState = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        if (!isMounted) return;

        if (completed === "true") {
          router.replace("/registro");
          return;
        }

        setIsReady(true);
      } catch (error) {
        if (!isMounted) return;
        Alert.alert(
          "No se pudo cargar la introducción",
          error instanceof Error ? error.message : "Inténtalo de nuevo.",
        );
        setIsReady(true);
      }
    };

    loadOnboardingState();

    return () => {
      isMounted = false;
    };
  }, []);

  const finishOnboarding = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsFinishing(true);

    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      router.replace("/registro");
    } catch (error) {
      finishingRef.current = false;
      setIsFinishing(false);
      Alert.alert(
        "No se pudo guardar tu progreso",
        error instanceof Error ? error.message : "Inténtalo de nuevo.",
      );
    }
  };

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color="#0ea5e9" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <OnboardingScreen
      onFinish={finishOnboarding}
      isFinishing={isFinishing}
    />
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#faf8ff",
  },
});
