import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { guardarNuevaTarea } from "../Backend";

/* ------------------------------------------------------------------ */
/* Tokens de color extraídos de la configuración de diseño            */
/* ------------------------------------------------------------------ */
const COLORS = {
  primary: "#006591",
  primaryContainer: "#0ea5e9",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#003751",
  primaryFixed: "#c9e6ff",
  onPrimaryFixed: "#001e2f",
  onPrimaryFixedVariant: "#004c6e",
  secondary: "#9d4300",
  secondaryContainer: "#fd761a",
  secondaryFixed: "#ffdbca",
  onSecondaryFixed: "#341100",
  onSecondaryFixedVariant: "#783200",
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
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
};

export default function NuevaTareaScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = width >= 768;

  // Campos del formulario
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedDate, setSelectedDate] = useState("hoy");
  const [hours, setHours] = useState(15);
  const [minutes, setMinutes] = useState(0);
  const [duration, setDuration] = useState("30m");
  const [priority, setPriority] = useState("media");
  const [validationMethod, setValidationMethod] = useState("timer");
  const [strictMode, setStrictMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifyTiming, setNotifyTiming] = useState("start");

  // Estado del Toast
  const [toastMessage, setToastMessage] = useState("");
  const [toastAnim] = useState(() => new Animated.Value(0));
  const [isSaving, setIsSaving] = useState(false);

  // Formato de hora HH:MM
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  const adjustTime = (deltaMinutes) => {
    let total = hours * 60 + minutes + deltaMinutes;
    if (total < 0) total = 24 * 60 + total;
    total = total % (24 * 60);
    setHours(Math.floor(total / 60));
    setMinutes(total % 60);
  };

  const showToast = (message = "¡Tarea Guardada con éxito!") => {
    setToastMessage(message);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const saveTask = async (shouldNavigateBack = true) => {
    if (title.trim() === "") {
      return false;
    }

    setIsSaving(true);
    await guardarNuevaTarea({
      title,
      desc,
      time: formattedTime,
      category: "Personal",
      priority: priority === "alta" ? "Alta" : priority === "media" ? "Media" : "Baja",
      duration,
      date: selectedDate === "hoy" ? "Hoy (24 Oct)" : selectedDate === "manana" ? "Mañana" : "Programada",
      validationMethod,
      strictMode,
      notifications: notificationsEnabled ? notifyTiming : "disabled",
    });
    setIsSaving(false);

    showToast("¡Tarea Guardada con éxito!");

    if (shouldNavigateBack) {
      setTimeout(() => {
        router.back();
      }, 900);
    } else {
      // Limpiar para crear otra
      setTitle("");
      setDesc("");
    }

    return true;
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "right", "left"]}>
      {/* ----------------- Header superior ----------------- */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          hitSlop={10}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Nueva Tarea
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            isTablet && styles.tabletContainer,
            { paddingBottom: 60 + Math.max(insets.bottom, 16) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ----------------- 1. Banner de Impulso de Octy ----------------- */}
          <View style={styles.motivationBanner}>
            <View style={styles.glowDecor} />
            <View style={styles.motivationContent}>
              <View style={styles.motivationIconContainer}>
                <Text style={styles.waterDropIcon}>💧</Text>
                <View style={styles.energyBadge}>
                  <Text style={styles.energyBadgeIcon}>⚡</Text>
                </View>
              </View>

              <View style={styles.motivationTextContainer}>
                <View style={styles.motivationTitleRow}>
                  <Text style={styles.motivationTitle}>Impulso de Octy</Text>
                  <View style={styles.streakTag}>
                    <Text style={styles.streakTagText}>🔥 Racha 5d</Text>
                  </View>
                </View>
                <Text style={styles.motivationDesc} numberOfLines={2}>
                  Al completar recibirás{" "}
                  <Text style={styles.motivationHighlight}>+15 Energía</Text> y
                  mantendrás vivo el hábito.
                </Text>
              </View>
            </View>
          </View>

          {/* ----------------- 2. Título y Notas ----------------- */}
          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Título de la tarea</Text>
                <Text style={styles.requiredBadge}>Obligatorio</Text>
              </View>
              <TextInput
                accessibilityLabel="Título de la tarea"
                style={styles.inputTitle}
                placeholder="Ej. Diseñar wireframes de Octopus"
                placeholderTextColor={COLORS.outlineVariant}
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <View style={styles.labelWithIcon}>
                  <Text style={styles.labelIcon}>📝</Text>
                  <Text style={styles.label}>Descripción y notas</Text>
                </View>
                <Text style={styles.optionalBadge}>Opcional</Text>
              </View>
              <TextInput
                accessibilityLabel="Descripción y notas"
                style={styles.inputDesc}
                placeholder="Añadir notas clave, recursos o subtareas..."
                placeholderTextColor={COLORS.outlineVariant}
                value={desc}
                onChangeText={setDesc}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* ----------------- 3. Programación (HU-05) ----------------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardHeaderIcon}>📅</Text>
                <Text style={styles.cardHeaderTitle}>Programación</Text>
              </View>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>Agenda Diaria</Text>
              </View>
            </View>

            {/* Selector de día rápido */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldSublabel}>Día asignado</Text>
              <View style={styles.dateSelectorRow}>
                <Pressable
                  onPress={() => setSelectedDate("hoy")}
                  style={[
                    styles.datePill,
                    selectedDate === "hoy" && styles.datePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.datePillText,
                      selectedDate === "hoy" && styles.datePillTextActive,
                    ]}
                  >
                    Hoy (24 Oct)
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setSelectedDate("manana")}
                  style={[
                    styles.datePill,
                    selectedDate === "manana" && styles.datePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.datePillText,
                      selectedDate === "manana" && styles.datePillTextActive,
                    ]}
                  >
                    Mañana
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setSelectedDate("custom")}
                  style={[
                    styles.datePill,
                    selectedDate === "custom" && styles.datePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.datePillText,
                      selectedDate === "custom" && styles.datePillTextActive,
                    ]}
                  >
                    ✏️ Elegir
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Selector de hora específica */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldSublabel}>Hora específica</Text>
              <View style={styles.timePickerContainer}>
                <View style={styles.timeDisplayLeft}>
                  <Text style={styles.clockIcon}>🕒</Text>
                  <View>
                    <Text style={styles.timeDisplayText}>{formattedTime}</Text>
                    <Text style={styles.timeDisplaySubtitle}>Hora de inicio</Text>
                  </View>
                </View>

                <View style={styles.timeButtonsRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Restar 15 minutos"
                    onPress={() => adjustTime(-15)}
                    style={({ pressed }) => [
                      styles.timeAdjustButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.timeAdjustIcon}>−</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Sumar 15 minutos"
                    onPress={() => adjustTime(15)}
                    style={({ pressed }) => [
                      styles.timeAdjustButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.timeAdjustIcon}>+</Text>
                  </Pressable>
                </View>
              </View>

              {/* Chips de duración */}
              <View style={styles.durationRow}>
                <Text style={styles.durationLabel}>Duración:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.durationChipsWrapper}>
                    {["15m", "30m", "1h", "2h"].map((item) => {
                      const isSelected = duration === item;
                      const label =
                        item === "15m"
                          ? "15 min"
                          : item === "30m"
                            ? "30 min"
                            : item === "1h"
                              ? "1 hora"
                              : "2 horas";
                      return (
                        <Pressable
                          key={item}
                          onPress={() => setDuration(item)}
                          style={[
                            styles.durationChip,
                            isSelected && styles.durationChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.durationChipText,
                              isSelected && styles.durationChipTextActive,
                            ]}
                          >
                            {label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>

          {/* ----------------- 4. Nivel de Prioridad (HU-05) ----------------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardHeaderIcon}>🚩</Text>
                <Text style={styles.cardHeaderTitle}>Nivel de Prioridad</Text>
              </View>
              <Text
                style={[
                  styles.priorityIndicator,
                  priority === "alta"
                    ? styles.priorityIndicatorHigh
                    : priority === "media"
                      ? styles.priorityIndicatorMedium
                      : styles.priorityIndicatorLow,
                ]}
              >
                {priority === "alta"
                  ? "¡Alta prioridad!"
                  : priority === "media"
                    ? "Media seleccionada"
                    : "Baja seleccionada"}
              </Text>
            </View>

            <View style={styles.priorityGrid}>
              {/* Baja */}
              <Pressable
                onPress={() => setPriority("baja")}
                style={[
                  styles.priorityCard,
                  priority === "baja" && styles.priorityCardLowActive,
                ]}
              >
                <Text style={styles.priorityIcon}>🌿</Text>
                <Text
                  style={[
                    styles.priorityTitle,
                    priority === "baja" && styles.priorityTitleLowActive,
                  ]}
                >
                  Baja
                </Text>
                <Text style={styles.prioritySubtitle}>Flexible</Text>
              </Pressable>

              {/* Media */}
              <Pressable
                onPress={() => setPriority("media")}
                style={[
                  styles.priorityCard,
                  priority === "media" && styles.priorityCardMediumActive,
                ]}
              >
                <Text style={styles.priorityIcon}>⚡</Text>
                <Text
                  style={[
                    styles.priorityTitle,
                    priority === "media" && styles.priorityTitleMediumActive,
                  ]}
                >
                  Media
                </Text>
                <Text style={styles.prioritySubtitle}>Regular</Text>
              </Pressable>

              {/* Alta */}
              <Pressable
                onPress={() => setPriority("alta")}
                style={[
                  styles.priorityCard,
                  priority === "alta" && styles.priorityCardHighActive,
                ]}
              >
                <Text style={styles.priorityIcon}>🔥</Text>
                <Text
                  style={[
                    styles.priorityTitle,
                    priority === "alta" && styles.priorityTitleHighActive,
                  ]}
                >
                  Alta
                </Text>
                <Text style={styles.prioritySubtitle}>Urgente</Text>
              </Pressable>
            </View>
          </View>

          {/* ----------------- 5. Método de Validación ----------------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardHeaderIcon}>🛡️</Text>
                <View>
                  <Text style={styles.cardHeaderTitle}>Método de Validación</Text>
                  <Text style={styles.cardHeaderSubtitle}>
                    Verificación sin fricción
                  </Text>
                </View>
              </View>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedBadgeText}>Recomendado</Text>
              </View>
            </View>

            <View style={styles.validationButtonsGrid}>
              <Pressable
                onPress={() => setValidationMethod("timer")}
                style={[
                  styles.validationButton,
                  validationMethod === "timer" && styles.validationButtonActive,
                ]}
              >
                <View style={styles.validationButtonTitleRow}>
                  <Text style={styles.validationIcon}>⏱️</Text>
                  <Text
                    style={[
                      styles.validationButtonTitle,
                      validationMethod === "timer" && styles.validationButtonTitleActive,
                    ]}
                  >
                    Cronómetro
                  </Text>
                </View>
                <View style={styles.vitalityBonusBadge}>
                  <Text style={styles.vitalityBonusText}>+Bonus Vitalidad</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setValidationMethod("manual")}
                style={[
                  styles.validationButton,
                  validationMethod === "manual" && styles.validationButtonActive,
                ]}
              >
                <View style={styles.validationButtonTitleRow}>
                  <Text style={styles.validationIcon}>✓</Text>
                  <Text
                    style={[
                      styles.validationButtonTitle,
                      validationMethod === "manual" && styles.validationButtonTitleActive,
                    ]}
                  >
                    Check manual
                  </Text>
                </View>
                <Text style={styles.validationSubinfo}>Sin inmersión</Text>
              </Pressable>
            </View>

            <View style={styles.validationCallout}>
              <View style={styles.validationCalloutHeader}>
                <Text style={styles.calloutDropIcon}>💧</Text>
                <Text style={styles.calloutText}>
                  Octy te acompañará en una sesión inmersiva de concentración
                  (sincronizada con la duración de {duration}). Al finalizar, la
                  tarea se verificará automáticamente.
                </Text>
              </View>

              <View style={styles.strictModeRow}>
                <View style={styles.strictModeLeft}>
                  <Text style={styles.lockIcon}>🔒</Text>
                  <Text style={styles.strictModeLabel}>
                    Modo estricto (Pausa si sales)
                  </Text>
                </View>
                <Switch
                  value={strictMode}
                  onValueChange={setStrictMode}
                  trackColor={{
                    false: COLORS.surfaceContainerHighest,
                    true: COLORS.primaryContainer,
                  }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* ----------------- 6. Recordatorio Local (HU-06) ----------------- */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.bellIconCircle}>
                  <Text style={styles.bellIcon}>🔔</Text>
                </View>
                <View>
                  <Text style={styles.cardHeaderTitle}>Recordatorio Local</Text>
                  <Text style={styles.offlineReadyText}>
                    ☁️ Modo offline listo
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: COLORS.surfaceContainerHighest,
                  true: COLORS.primaryContainer,
                }}
                thumbColor="#ffffff"
              />
            </View>

            {notificationsEnabled && (
              <View style={styles.notificationOptionsContainer}>
                <Text style={styles.fieldSublabel}>
                  Momento del aviso sonoro:
                </Text>
                <View style={styles.notificationTimingGrid}>
                  <Pressable
                    onPress={() => setNotifyTiming("start")}
                    style={[
                      styles.notifyTimingPill,
                      notifyTiming === "start" && styles.notifyTimingPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.notifyTimingText,
                        notifyTiming === "start" && styles.notifyTimingTextActive,
                      ]}
                    >
                      Al iniciar ({formattedTime})
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setNotifyTiming("before")}
                    style={[
                      styles.notifyTimingPill,
                      notifyTiming === "before" && styles.notifyTimingPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.notifyTimingText,
                        notifyTiming === "before" && styles.notifyTimingTextActive,
                      ]}
                    >
                      10 min antes
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          {/* ----------------- 7. Vista Previa de Recompensa ----------------- */}
          <View style={styles.rewardPreviewCard}>
            <View style={styles.rewardLeft}>
              <View style={styles.rewardStarIconContainer}>
                <Text style={styles.rewardStarIcon}>⭐</Text>
              </View>
              <View>
                <Text style={styles.rewardLabel}>Recompensa Estimada</Text>
                <Text style={styles.rewardValue}>+15 Pts de Racha</Text>
              </View>
            </View>

            <View style={styles.rewardVitalityBadge}>
              <Text style={styles.rewardDropIcon}>💧</Text>
              <Text style={styles.rewardVitalityText}>+10% Vitalidad</Text>
            </View>
          </View>

          {/* ----------------- 8. Botones de Acción ----------------- */}
          <View style={styles.actionsContainer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Guardar Tarea en Agenda"
              disabled={isSaving || title.trim() === ""}
              onPress={() => saveTask(true)}
              style={({ pressed }) => [
                styles.saveButton,
                title.trim() === "" && styles.saveButtonDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.saveButtonIcon}>✓</Text>
              <Text style={styles.saveButtonLabel}>Guardar Tarea en Agenda</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Guardar y crear otra"
              disabled={isSaving || title.trim() === ""}
              onPress={() => saveTask(false)}
              style={({ pressed }) => [
                styles.saveAnotherButton,
                title.trim() === "" && styles.saveAnotherButtonDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.saveAnotherIcon}>+</Text>
              <Text style={styles.saveAnotherLabel}>Guardar y crear otra</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ----------------- Feedback Toast Emergente ----------------- */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toastContainer,
          {
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.toastBox}>
          <View style={styles.toastCheckCircle}>
            <Text style={styles.toastCheckIcon}>✓</Text>
          </View>
          <View style={styles.toastTextContainer}>
            <Text style={styles.toastTitle}>{toastMessage}</Text>
            <Text style={styles.toastSubtitle}>
              Sincronizada en orden cronológico
            </Text>
          </View>
        </View>
      </Animated.View>
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
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(250, 248, 255, 0.98)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  headerSpacer: {
    width: 60,
  },
  pressed: {
    opacity: 0.75,
  },
  keyboardContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 16,
  },
  tabletContainer: {
    maxWidth: 580,
    width: "100%",
    alignSelf: "center",
  },

  /* 1. Motivation Banner */
  motivationBanner: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 18,
    padding: 14,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  glowDecor: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
  },
  motivationContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  motivationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(14, 165, 233, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  waterDropIcon: {
    fontSize: 22,
  },
  energyBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.secondaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  energyBadgeIcon: {
    fontSize: 10,
    color: "#ffffff",
  },
  motivationTextContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  motivationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  motivationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  streakTag: {
    backgroundColor: COLORS.secondaryFixed,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 8,
  },
  streakTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.onSecondaryFixed,
  },
  motivationDesc: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },
  motivationHighlight: {
    fontWeight: "700",
    color: COLORS.tertiary,
  },

  /* Tarjeta estándar */
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardHeaderIcon: {
    fontSize: 18,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  cardHeaderSubtitle: {
    fontSize: 11,
    color: COLORS.outline,
    marginTop: 1,
  },
  sectionBadge: {
    backgroundColor: COLORS.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.onPrimaryFixed,
  },

  /* Inputs */
  fieldGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.onSurface,
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelIcon: {
    fontSize: 14,
  },
  requiredBadge: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.outline,
  },
  optionalBadge: {
    fontSize: 10,
    color: COLORS.outline,
  },
  inputTitle: {
    height: 48,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.onSurface,
  },
  inputDesc: {
    minHeight: 74,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: COLORS.onSurface,
  },
  fieldSublabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },

  /* Date selector */
  dateSelectorRow: {
    flexDirection: "row",
    gap: 8,
  },
  datePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  datePillActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  datePillText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  datePillTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },

  /* Time selector */
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 10,
  },
  timeDisplayLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 4,
  },
  clockIcon: {
    fontSize: 20,
  },
  timeDisplayText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.onSurface,
  },
  timeDisplaySubtitle: {
    fontSize: 10,
    color: COLORS.outline,
  },
  timeButtonsRow: {
    flexDirection: "row",
    gap: 6,
  },
  timeAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  timeAdjustIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.onSurface,
  },

  /* Duración */
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  durationLabel: {
    fontSize: 11,
    color: COLORS.outline,
  },
  durationChipsWrapper: {
    flexDirection: "row",
    gap: 6,
  },
  durationChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  durationChipActive: {
    backgroundColor: COLORS.primaryFixed,
  },
  durationChipText: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  durationChipTextActive: {
    color: COLORS.onPrimaryFixed,
    fontWeight: "700",
  },

  /* Prioridad */
  priorityIndicator: {
    fontSize: 11,
    fontWeight: "700",
  },
  priorityIndicatorLow: {
    color: COLORS.primary,
  },
  priorityIndicatorMedium: {
    color: COLORS.secondary,
  },
  priorityIndicatorHigh: {
    color: COLORS.error,
  },
  priorityGrid: {
    flexDirection: "row",
    gap: 8,
  },
  priorityCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainerLow,
    gap: 3,
  },
  priorityCardLowActive: {
    backgroundColor: COLORS.primaryFixed,
  },
  priorityCardMediumActive: {
    backgroundColor: COLORS.secondaryFixed,
  },
  priorityCardHighActive: {
    backgroundColor: COLORS.errorContainer,
  },
  priorityIcon: {
    fontSize: 20,
  },
  priorityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  priorityTitleLowActive: {
    color: COLORS.onPrimaryFixed,
  },
  priorityTitleMediumActive: {
    color: COLORS.onSecondaryFixed,
  },
  priorityTitleHighActive: {
    color: COLORS.onErrorContainer,
  },
  prioritySubtitle: {
    fontSize: 10,
    color: COLORS.outline,
  },

  /* Método de validación */
  recommendedBadge: {
    backgroundColor: "rgba(0, 177, 123, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.tertiary,
  },
  validationButtonsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  validationButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  validationButtonActive: {
    backgroundColor: COLORS.primary,
  },
  validationButtonTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  validationIcon: {
    fontSize: 14,
  },
  validationButtonTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  validationButtonTitleActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  vitalityBonusBadge: {
    backgroundColor: COLORS.primaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  vitalityBonusText: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.onPrimaryFixed,
  },
  validationSubinfo: {
    fontSize: 10,
    color: COLORS.outline,
  },
  validationCallout: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  validationCalloutHeader: {
    flexDirection: "row",
    gap: 8,
  },
  calloutDropIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  calloutText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },
  strictModeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainer,
  },
  strictModeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lockIcon: {
    fontSize: 13,
  },
  strictModeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.onSurface,
  },

  /* Notificaciones */
  bellIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryFixed,
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    fontSize: 15,
  },
  offlineReadyText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.tertiary,
    marginTop: 1,
  },
  notificationOptionsContainer: {
    gap: 8,
    paddingTop: 4,
  },
  notificationTimingGrid: {
    flexDirection: "row",
    gap: 8,
  },
  notifyTimingPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: "center",
  },
  notifyTimingPillActive: {
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.primaryContainer,
  },
  notifyTimingText: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  notifyTimingTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  /* Reward preview */
  rewardPreviewCard: {
    backgroundColor: COLORS.primaryFixed,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  rewardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rewardStarIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardStarIcon: {
    fontSize: 17,
  },
  rewardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.onPrimaryFixedVariant,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rewardValue: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.onSurface,
  },
  rewardVitalityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surfaceContainerLowest,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  rewardDropIcon: {
    fontSize: 14,
  },
  rewardVitalityText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.onSurface,
  },

  /* Acciones */
  actionsContainer: {
    gap: 10,
    marginTop: 6,
  },
  saveButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryContainer,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonIcon: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
  },
  saveButtonLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  saveAnotherButton: {
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.surfaceContainerLowest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
  },
  saveAnotherButtonDisabled: {
    opacity: 0.5,
  },
  saveAnotherIcon: {
    fontSize: 17,
    color: COLORS.outline,
    fontWeight: "600",
  },
  saveAnotherLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.onSurface,
  },

  /* Toast emergente */
  toastContainer: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 100,
  },
  toastBox: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.2)",
  },
  toastCheckCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tertiaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  toastCheckIcon: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  toastSubtitle: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 1,
  },
});

