import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { cerrarSesion } from "../Backend";

/* ------------------------------------------------------------------ */
/* Tokens de color extraídos de la configuración de diseño            */
/* ------------------------------------------------------------------ */
const COLORS = {
  primary: "#006591",
  primaryContainer: "#0ea5e9",
  onPrimary: "#ffffff",
  secondary: "#9d4300",
  secondaryContainer: "#fd761a",
  tertiary: "#006c49",
  tertiaryContainer: "#00b17b",
  tertiaryFixed: "#6ffbbe",
  surface: "#faf8ff",
  surfaceContainer: "#eaedff",
  surfaceContainerLow: "#f2f3ff",
  surfaceContainerHigh: "#e2e7ff",
  surfaceContainerHighest: "#dae2fd",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#131b2e",
  onSurfaceVariant: "#3e4850",
  outline: "#6e7881",
  outlineVariant: "#bec8d2",
};

export default function MascotaScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = width < 360;
  const isTablet = width >= 768;
  const avatarSize = Math.min(Math.max(width * 0.52, 170), 220);

  // Estados de alimentación
  const [isFeeding, setIsFeeding] = useState(false);
  const [isFed, setIsFed] = useState(false);
  const [energyPercent, setEnergyPercent] = useState(85);
  const [showDialogue, setShowDialogue] = useState(false);
  const [activeTab, setActiveTab] = useState("mascota");

  // Animaciones (compatibles con React 19 y React Compiler)
  const [floatAnim] = useState(() => new Animated.Value(0));
  const [danceAnim] = useState(() => new Animated.Value(0));
  const [auraScale] = useState(() => new Animated.Value(1));
  const [dialogueAnim] = useState(() => new Animated.Value(0));
  const [progressAnim] = useState(() => new Animated.Value(85));

  // Animación suave de flotación continua (idle float)
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    );

    floatLoop.start();
    return () => floatLoop.stop();
  }, [floatAnim]);

  // Disparar baile de Octy
  const triggerDance = () => {
    danceAnim.setValue(0);
    Animated.sequence([
      Animated.timing(danceAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(danceAnim, {
        toValue: -1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(danceAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(danceAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Disparar simulación de alimentación
  const triggerFeedSimulation = () => {
    if (isFeeding) return;

    if (isFed) {
      resetSimulation();
      return;
    }

    setIsFeeding(true);
    triggerDance();

    // Pulso del aura
    Animated.sequence([
      Animated.timing(auraScale, {
        toValue: 1.25,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(auraScale, {
        toValue: 1.1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de subida de energía a 100%
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Incremento progresivo del contador de energía
    let current = 85;
    const interval = setInterval(() => {
      current += 1;
      if (current >= 100) {
        clearInterval(interval);
        setEnergyPercent(100);
      } else {
        setEnergyPercent(current);
      }
    }, 60);

    // Aparición del diálogo
    setTimeout(() => {
      setShowDialogue(true);
      dialogueAnim.setValue(0);
      Animated.spring(dialogueAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Finalizar proceso de alimentación
    setTimeout(() => {
      setIsFeeding(false);
      setIsFed(true);
    }, 1800);
  };

  // Reiniciar simulación
  const resetSimulation = () => {
    setIsFeeding(false);
    setIsFed(false);
    setEnergyPercent(85);
    setShowDialogue(false);
    progressAnim.setValue(85);
    auraScale.setValue(1);
    dialogueAnim.setValue(0);
  };

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Deseas salir a la pantalla de ingreso?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await cerrarSesion();
          router.replace("/login");
        },
      },
    ]);
  };

  // Interpolación de rotación del baile
  const danceRotate = danceAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const danceScale = danceAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [1.08, 1, 1.12],
  });

  return (
    <SafeAreaView style={styles.screen} edges={["top", "right", "left"]}>
      {/* ----------------- Header superior ----------------- */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>Octopus</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notificaciones"
            hitSlop={8}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={() =>
              Alert.alert(
                "Notificaciones",
                "Octy está en excelente estado. ¡Sigue completando tareas!",
              )
            }
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          isTablet && styles.tabletContainer,
          {
            paddingHorizontal: isSmall ? 16 : 22,
            paddingBottom: 96 + Math.max(insets.bottom, 12),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ----------------- Nivel e Información ----------------- */}
        <View style={styles.topInfoSection}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeIcon}>⭐</Text>
            <Text style={styles.levelBadgeText}>Nivel 3 · Explorador Marino</Text>
          </View>

          <Text style={styles.title}>Octy</Text>
          <Text style={styles.subtitle}>
            Tu compañero de concentración y hábitos
          </Text>

          {/* Diálogo emergente */}
          {showDialogue && (
            <Animated.View
              style={[
                styles.dialogueBubble,
                {
                  transform: [
                    { scale: dialogueAnim },
                    {
                      translateY: dialogueAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [15, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.dialogueRow}>
                <Text style={styles.dialogueSparkle}>✨</Text>
                <Text style={styles.dialogueTitle}>¡Yum! +15% Energía vital 🐙💖</Text>
              </View>
              <Text style={styles.dialogueSubtitle}>
                ¡Octy está al máximo de felicidad!
              </Text>
              <View style={styles.dialogueTail} />
            </Animated.View>
          )}
        </View>

        {/* ----------------- Avatar Mascota y Auras ----------------- */}
        <View style={styles.petContainer}>
          {/* Halos luminosos */}
          <Animated.View
            style={[
              styles.haloAura,
              {
                width: avatarSize + 70,
                height: avatarSize + 70,
                borderRadius: (avatarSize + 70) / 2,
                transform: [{ scale: auraScale }],
              },
            ]}
          />
          <View
            style={[
              styles.haloGlow,
              {
                width: avatarSize + 30,
                height: avatarSize + 30,
                borderRadius: (avatarSize + 30) / 2,
              },
            ]}
          />

          {/* Imagen de Octy con animaciones */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tocar a Octy"
            onPress={() => {
              triggerDance();
              if (!isFeeding && !isFed) triggerFeedSimulation();
            }}
          >
            <Animated.Image
              source={require("../../assets/images/Pulpo_sano.png")}
              style={[
                styles.avatarImage,
                {
                  width: avatarSize,
                  height: avatarSize,
                  transform: [
                    { translateY: floatAnim },
                    { rotate: danceRotate },
                    { scale: danceScale },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          </Pressable>

          {/* Badge de estado */}
          <View
            style={[
              styles.statusBadge,
              isFed ? styles.statusBadgeFed : styles.statusBadgeNormal,
            ]}
          >
            <Text style={styles.statusBadgeIcon}>
              {isFed ? "🎉" : "😊"}
            </Text>
            <Text
              style={[
                styles.statusBadgeText,
                isFed ? styles.statusBadgeTextFed : styles.statusBadgeTextNormal,
              ]}
            >
              {isFed
                ? "¡Octy está al 100% lleno y feliz!"
                : "¡Octy se siente radiante!"}
            </Text>
          </View>
        </View>

        {/* ----------------- Tarjeta de Energía Vital ----------------- */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalHeader}>
            <View style={styles.vitalTitleRow}>
              <Text style={styles.vitalIcon}>⚡</Text>
              <Text style={styles.vitalTitle}>Energía Vital</Text>
            </View>

            <View style={styles.vitalValueRow}>
              {isFed && (
                <View style={styles.bonusTag}>
                  <Text style={styles.bonusTagText}>+15%</Text>
                </View>
              )}
              <Text
                style={[
                  styles.energyText,
                  isFed ? styles.energyTextFed : styles.energyTextNormal,
                ]}
              >
                {energyPercent}%
              </Text>
            </View>
          </View>

          {/* Barra de progreso animada */}
          <View style={styles.vitalTrack}>
            <Animated.View
              style={[
                styles.vitalFill,
                isFed && styles.vitalFillFed,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* ----------------- Botón de Alimentar ----------------- */}
        <View style={styles.actionSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Alimentar a Octy"
            disabled={isFeeding}
            onPress={triggerFeedSimulation}
            style={({ pressed }) => [
              styles.feedButton,
              isFed && styles.feedButtonFed,
              isFeeding && styles.feedButtonFeeding,
              pressed && !isFeeding && styles.feedButtonPressed,
            ]}
          >
            <View style={styles.feedButtonLeft}>
              <View
                style={[
                  styles.feedIconWrapper,
                  isFed && styles.feedIconWrapperFed,
                ]}
              >
                {isFeeding ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.feedIconText}>
                    {isFed ? "✓" : "🍴"}
                  </Text>
                )}
              </View>

              <View style={styles.feedTextContainer}>
                <Text
                  style={[
                    styles.feedMainText,
                    isFed && styles.feedMainTextFed,
                  ]}
                  numberOfLines={1}
                >
                  {isFeeding
                    ? "¡Alimentando a Octy! ✨"
                    : isFed
                      ? "¡Octy está lleno! 🎉"
                      : "Alimentar con tareas diarias"}
                </Text>
                <Text
                  style={[
                    styles.feedSubText,
                    isFed && styles.feedSubTextFed,
                  ]}
                  numberOfLines={1}
                >
                  {isFeeding
                    ? "Canjeando tareas completadas..."
                    : isFed
                      ? "3 de 3 tareas canjeadas hoy"
                      : "3 tareas listas (+15% energía)"}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.feedActionPill,
                isFed && styles.feedActionPillFed,
              ]}
            >
              <Text style={styles.feedActionPillText}>
                {isFed ? "✓" : "+"}
              </Text>
            </View>
          </Pressable>

          {/* Botón para reiniciar y probar de nuevo */}
          {isFed && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reiniciar simulación"
              onPress={resetSimulation}
              hitSlop={8}
              style={({ pressed }) => [
                styles.resetButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.resetButtonIcon}>🔄</Text>
              <Text style={styles.resetButtonText}>
                Reiniciar simulación (probar de nuevo)
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* ----------------- Barra Inferior de Navegación ----------------- */}
      <View
        style={[
          styles.bottomNav,
          {
            paddingBottom: Math.max(insets.bottom, 8),
            height: 58 + Math.max(insets.bottom, 8),
          },
        ]}
      >
        <Pressable
          style={styles.navItem}
          onPress={() => router.replace("/home")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "hoy" && styles.navIconActive,
            ]}
          >
            📅
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "hoy" && styles.navLabelActive,
            ]}
          >
            Hoy
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.replace("/proyectos")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "proyectos" && styles.navIconActive,
            ]}
          >
            📁
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "proyectos" && styles.navLabelActive,
            ]}
          >
            Proyectos
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => {
            setActiveTab("mascota");
            triggerDance();
          }}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "mascota" && styles.navIconActive,
            ]}
          >
            🐙
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "mascota" && styles.navLabelActive,
            ]}
          >
            Mascota
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => {
            setActiveTab("ajustes");
            handleSignOut();
          }}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "ajustes" && styles.navIconActive,
            ]}
          >
            ⚙️
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "ajustes" && styles.navLabelActive,
            ]}
          >
            Ajustes
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Estilos                                                            */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    minHeight: 56,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(250, 248, 255, 0.98)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  notificationIcon: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.7,
  },
  contentContainer: {
    paddingTop: 16,
    alignItems: "center",
    gap: 20,
  },
  tabletContainer: {
    maxWidth: 540,
    width: "100%",
    alignSelf: "center",
  },

  /* Top info */
  topInfoSection: {
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(201, 230, 255, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 5,
    marginBottom: 8,
  },
  levelBadgeIcon: {
    fontSize: 13,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.onSurface,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
    textAlign: "center",
  },

  /* Diálogo flotante */
  dialogueBubble: {
    position: "absolute",
    top: 96,
    zIndex: 30,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 177, 123, 0.3)",
    alignItems: "center",
  },
  dialogueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dialogueSparkle: {
    fontSize: 13,
  },
  dialogueTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.tertiary,
  },
  dialogueSubtitle: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  dialogueTail: {
    position: "absolute",
    bottom: -6,
    width: 12,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    transform: [{ rotate: "45deg" }],
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 177, 123, 0.3)",
  },

  /* Mascota y halos */
  petContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    paddingVertical: 10,
  },
  haloAura: {
    position: "absolute",
    backgroundColor: "rgba(111, 251, 190, 0.3)",
  },
  haloGlow: {
    position: "absolute",
    backgroundColor: "rgba(14, 165, 233, 0.15)",
  },
  avatarImage: {
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 6,
    marginTop: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statusBadgeNormal: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderColor: "rgba(0, 101, 145, 0.2)",
  },
  statusBadgeFed: {
    backgroundColor: "rgba(0, 177, 123, 0.14)",
    borderColor: "rgba(0, 177, 123, 0.35)",
  },
  statusBadgeIcon: {
    fontSize: 13,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusBadgeTextNormal: {
    color: COLORS.primary,
  },
  statusBadgeTextFed: {
    color: COLORS.tertiary,
  },

  /* Vital card */
  vitalCard: {
    width: "100%",
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(226, 231, 255, 0.8)",
  },
  vitalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vitalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  vitalIcon: {
    fontSize: 16,
  },
  vitalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  vitalValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bonusTag: {
    backgroundColor: "rgba(111, 251, 190, 0.4)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  bonusTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.tertiary,
  },
  energyText: {
    fontSize: 14,
    fontWeight: "800",
  },
  energyTextNormal: {
    color: COLORS.primary,
  },
  energyTextFed: {
    color: COLORS.tertiary,
  },
  vitalTrack: {
    height: 12,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 6,
    overflow: "hidden",
    padding: 2,
  },
  vitalFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: COLORS.primaryContainer,
  },
  vitalFillFed: {
    backgroundColor: COLORS.tertiaryContainer,
  },

  /* Acción / Alimentación */
  actionSection: {
    width: "100%",
    gap: 10,
  },
  feedButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  feedButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  feedButtonFeeding: {
    backgroundColor: COLORS.tertiary,
  },
  feedButtonFed: {
    backgroundColor: COLORS.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    shadowOpacity: 0.05,
  },
  feedButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  feedIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(201, 230, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  feedIconWrapperFed: {
    backgroundColor: "rgba(0, 177, 123, 0.2)",
  },
  feedIconText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "700",
  },
  feedTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  feedMainText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  feedMainTextFed: {
    color: COLORS.onSurface,
  },
  feedSubText: {
    fontSize: 12,
    color: "rgba(201, 230, 255, 0.9)",
    marginTop: 1,
  },
  feedSubTextFed: {
    color: COLORS.onSurfaceVariant,
  },
  feedActionPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  feedActionPillFed: {
    backgroundColor: "rgba(0, 177, 123, 0.2)",
  },
  feedActionPillText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  resetButtonIcon: {
    fontSize: 13,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    textDecorationLine: "underline",
  },

  /* Barra inferior fija */
  bottomNav: {
    backgroundColor: "rgba(250, 248, 255, 0.98)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 19,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
