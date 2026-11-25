import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { guardarNuevoProyecto } from "../Backend";

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
  secondary: "#9d4300",
  secondaryContainer: "#fd761a",
  secondaryFixed: "#ffdbca",
  onSecondaryFixed: "#341100",
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
};

const PALETTE = [
  { name: "Turquesa Octy", color: "#0ea5e9" },
  { name: "Coral Suave", color: "#fd761a" },
  { name: "Azul Océano", color: "#006591" },
  { name: "Lavanda Marina", color: "#89ceff" },
  { name: "Menta Arrecife", color: "#00b17b" },
  { name: "Ámbar Solar", color: "#ffb690" },
];

const EMOJIS = ["🚀", "💡", "📚", "🎨", "🌿", "⚡", "🌊", "🎯"];

export default function NuevoProyectoScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = width >= 768;

  // Estados del formulario
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🚀");
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [projectType, setProjectType] = useState("continuous"); // "deadline" | "continuous"
  const [cadence, setCadence] = useState("Semanal");

  // Subtareas (inician vacías por requerimiento explícito del usuario)
  const [subtasks, setSubtasks] = useState([]);

  // Estados de acordeón (Card 1 expandida por defecto)
  const [expandedCards, setExpandedCards] = useState({
    card1: true,
    card2: false,
    card3: false,
    card4: false,
  });

  // Modal de ayuda
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Toast animado
  const [showToast, setShowToast] = useState(false);
  const [toastAnim] = useState(() => new Animated.Value(0));
  const [isSaving, setIsSaving] = useState(false);

  const toggleAccordion = (cardKey) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  // Añadir subtarea
  const addSubtask = () => {
    const newId = "sub-" + Date.now();
    setSubtasks((prev) => [
      ...prev,
      { id: newId, title: "", completed: false },
    ]);
    // Asegurar que Card 3 esté expandida
    setExpandedCards((prev) => ({ ...prev, card3: true }));
  };

  // Actualizar subtarea
  const updateSubtaskTitle = (id, newTitle) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    );
  };

  // Eliminar subtarea
  const removeSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  // Guardar proyecto
  const handleSaveProject = async () => {
    if (name.trim() === "") {
      setExpandedCards((prev) => ({ ...prev, card1: true }));
      return;
    }

    setIsSaving(true);
    await guardarNuevoProyecto({
      name,
      vision,
      icon: selectedEmoji,
      color: selectedColor.color,
      colorName: selectedColor.name,
      type: projectType,
      startDate: "Hoy, 24 Oct",
      targetDate: projectType === "deadline" ? "En 30 días" : "Flexible",
      cadence,
      subtasks: subtasks.filter((s) => s.title.trim() !== ""),
    });
    setIsSaving(false);

    // Animación del Toast
    setShowToast(true);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(1600),
    ]).start(() => {
      router.back();
    });
  };

  const subtaskWeight =
    subtasks.length > 0 ? Math.round(100 / subtasks.length) : 0;

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
          Nuevo Proyecto
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
          {/* Banner Motivacional: Visión de Octy */}
          <View style={styles.motivationBanner}>
            <View style={styles.glowDecor} />
            <View style={styles.motivationContent}>
              <View style={styles.avatarMiniCircle}>
                <Text style={styles.octyEmoji}>🐙</Text>
                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeIcon}>🌿</Text>
                </View>
              </View>

              <View style={styles.motivationTextContainer}>
                <View style={styles.motivationTitleRow}>
                  <Text style={styles.motivationTitle}>Visión de Octy</Text>
                </View>
                <Text style={styles.motivationDesc}>Al completar este hito,
                  Octy comenzará a construir un nuevo arrecife coral.
                </Text>
              </View>
            </View>
          </View>

          {/* ----------------- CARD 1: Nombre y Visión ----------------- */}
          <View style={styles.accordionCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Expandir o contraer nombre y visión"
              onPress={() => toggleAccordion("card1")}
              style={styles.accordionHeader}
            >
              <View style={styles.accordionHeaderLeft}>
                <View style={styles.cardIconCircle}>
                  <Text style={styles.cardHeaderIcon}>📝</Text>
                </View>
                <View style={styles.cardHeaderTitles}>
                  <Text style={styles.cardTitle}>Nombre del proyecto</Text>
                </View>
              </View>
              <Text style={styles.chevronIcon}>
                {expandedCards.card1 ? "▲" : "▼"}
              </Text>
            </Pressable>

            {expandedCards.card1 && (
              <View style={styles.accordionBody}>
                {/* Nombre del proyecto */}
                <View style={styles.fieldGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>
                      Nombre del Proyecto <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <Text style={styles.requiredBadge}>Obligatorio</Text>
                  </View>
                  <TextInput
                    accessibilityLabel="Nombre del Proyecto"
                    style={styles.textInput}
                    placeholder="Ej. Lanzamiento Tienda Online, Aprender Francés"
                    placeholderTextColor={COLORS.outline}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                {/* Propósito y motivación */}
                <View style={styles.fieldGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Propósito & Motivación</Text>
                    <Text style={styles.optionalBadge}>Opcional</Text>
                  </View>
                  <TextInput
                    accessibilityLabel="Propósito y Motivación"
                    style={styles.textArea}
                    placeholder="¿Por qué este proyecto es trascendental para ti o tu equipo?"
                    placeholderTextColor={COLORS.outline}
                    value={vision}
                    onChangeText={setVision}
                    multiline
                    numberOfLines={2}
                    textAlignVertical="top"
                  />
                </View>

                {/* Selector de ícono */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Ícono representativo</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.emojiRow}>
                      {EMOJIS.map((emoji) => {
                        const isSelected = selectedEmoji === emoji;
                        return (
                          <Pressable
                            key={emoji}
                            onPress={() => setSelectedEmoji(emoji)}
                            style={[
                              styles.emojiBtn,
                              isSelected && styles.emojiBtnSelected,
                            ]}
                          >
                            <Text style={styles.emojiText}>{emoji}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              </View>
            )}
          </View>

          {/* ----------------- CARD 2: Fechas y Plazo ----------------- */}
          <View style={styles.accordionCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Expandir o contraer fechas y plazo"
              onPress={() => toggleAccordion("card2")}
              style={styles.accordionHeader}
            >
              <View style={styles.accordionHeaderLeft}>
                <View style={styles.cardIconCircle}>
                  <Text style={styles.cardHeaderIcon}>📅</Text>
                </View>
                <View style={styles.cardHeaderTitles}>
                  <Text style={styles.cardTitle}>Fechas y Plazo</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {projectType === "deadline"
                      ? "Meta con límite · En 30 días sugeridos"
                      : "Sin fecha límite · Proyecto continuo"}
                  </Text>
                </View>
              </View>
              <Text style={styles.chevronIcon}>
                {expandedCards.card2 ? "▲" : "▼"}
              </Text>
            </Pressable>

            {expandedCards.card2 && (
              <View style={styles.accordionBody}>
                {/* Selector de tipo */}
                <View style={styles.typeToggleContainer}>
                  <Pressable
                    onPress={() => setProjectType("deadline")}
                    style={[
                      styles.typeToggleBtn,
                      projectType === "deadline" && styles.typeToggleBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeToggleText,
                        projectType === "deadline" && styles.typeToggleTextActive,
                      ]}
                    >
                      🚩 Fecha Límite
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setProjectType("continuous")}
                    style={[
                      styles.typeToggleBtn,
                      projectType === "continuous" && styles.typeToggleBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeToggleText,
                        projectType === "continuous" && styles.typeToggleTextActive,
                      ]}
                    >
                      ♾️ Continuo
                    </Text>
                  </Pressable>
                </View>

                {/* Campos de fecha */}
                <View style={styles.datesGrid}>
                  <View style={styles.dateField}>
                    <Text style={styles.fieldSublabel}>Fecha Inicio</Text>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateBoxText}>Hoy, 24 Oct</Text>
                      <Text style={styles.dateBoxIcon}>📅</Text>
                    </View>
                  </View>

                  <View style={styles.dateField}>
                    <Text style={styles.fieldSublabel}>Objetivo Final</Text>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateBoxText}>
                        {projectType === "deadline" ? "En 30 días" : "Flexible"}
                      </Text>
                      <Text style={styles.dateBoxIcon}>🎯</Text>
                    </View>
                  </View>
                </View>

                {/* Cadencia de revisión */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldSublabel}>Revisión:</Text>
                  <View style={styles.cadenceRow}>
                    {["Semanal", "Quincenal", "Fin de mes"].map((item) => {
                      const isSelected = cadence === item;
                      return (
                        <Pressable
                          key={item}
                          onPress={() => setCadence(item)}
                          style={[
                            styles.cadenceChip,
                            isSelected && styles.cadenceChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.cadenceChipText,
                              isSelected && styles.cadenceChipTextActive,
                            ]}
                          >
                            {item}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* ----------------- CARD 3: Subtareas e Hitos Clave ----------------- */}
          <View style={styles.accordionCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Expandir o contraer subtareas e hitos"
              onPress={() => toggleAccordion("card3")}
              style={styles.accordionHeader}
            >
              <View style={styles.accordionHeaderLeft}>
                <View style={styles.cardIconCircle}>
                  <Text style={styles.cardHeaderIcon}>📋</Text>
                </View>
                <View style={styles.cardHeaderTitles}>
                  <Text style={styles.cardTitle}>Subtareas e Hitos Clave</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {subtasks.length === 0
                      ? "Sin subtareas añadidas"
                      : `${subtasks.length} ${subtasks.length === 1 ? "subtarea registrada" : "subtareas registradas"}`}
                  </Text>
                </View>
              </View>
              <Text style={styles.chevronIcon}>
                {expandedCards.card3 ? "▲" : "▼"}
              </Text>
            </Pressable>

            {expandedCards.card3 && (
              <View style={styles.accordionBody}>
                {/* Lista de subtareas (vacía inicialmente según instrucción del usuario) */}
                {subtasks.length === 0 ? (
                  <View style={styles.emptySubtasksNote}>
                    <Text style={styles.emptySubtasksText}>
                      Agrega subtareas a tu proyecto presionando en el boton Añadir subtarea.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.subtasksList}>
                    {subtasks.map((st, index) => (
                      <View key={st.id} style={styles.subtaskRow}>
                        <View style={styles.subtaskIndexBadge}>
                          <Text style={styles.subtaskIndexText}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={styles.subtaskInputContainer}>
                          <TextInput
                            style={styles.subtaskInput}
                            placeholder="Nombre del hito o subtarea..."
                            placeholderTextColor={COLORS.outline}
                            value={st.title}
                            onChangeText={(text) =>
                              updateSubtaskTitle(st.id, text)
                            }
                          />
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Eliminar subtarea"
                          hitSlop={8}
                          onPress={() => removeSubtask(st.id)}
                          style={styles.removeSubtaskBtn}
                        >
                          <Text style={styles.removeSubtaskText}>✕</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}

                {/* Botón para añadir subtarea */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Añadir subtarea"
                  onPress={addSubtask}
                  style={({ pressed }) => [
                    styles.addSubtaskBtn,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.addSubtaskIcon}>+</Text>
                  <Text style={styles.addSubtaskLabel}>Añadir subtarea</Text>
                </Pressable>

                <View style={styles.subtaskTipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>
                    Cada subtarea completada aumentará proporcionalmente el
                    avance del proyecto.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* ----------------- CARD 4: Impacto en Octy & Recompensas ----------------- */}
          <View style={styles.accordionCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Expandir o contraer impacto en Octy"
              onPress={() => toggleAccordion("card4")}
              style={styles.accordionHeader}
            >
              <View style={styles.accordionHeaderLeft}>
                <View style={styles.cardIconCircle}>
                  <Text style={styles.cardHeaderIcon}>⭐</Text>
                </View>
                <View style={styles.cardHeaderTitles}>
                  <Text style={styles.cardTitle}>
                    Impacto en Octy & Recompensas
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    Evolución de Hábitat · Arrecife Nivel 1
                  </Text>
                </View>
              </View>
              <Text style={styles.chevronIcon}>
                {expandedCards.card4 ? "▲" : "▼"}
              </Text>
            </Pressable>

            {expandedCards.card4 && (
              <View style={styles.accordionBody}>
                <View style={styles.ecosystemCard}>
                  <View style={styles.ecosystemHeader}>
                    <View style={styles.ecosystemTitleRow}>
                      <Text style={styles.coralIcon}>🪸</Text>
                      <Text style={styles.ecosystemTitle}>
                        Coral Bioluminiscente
                      </Text>
                    </View>
                    <View style={styles.unlockBadge}>
                      <Text style={styles.unlockBadgeText}>Desbloqueo</Text>
                    </View>
                  </View>
                  <Text style={styles.ecosystemDesc}>
                    Al finalizar cada hito, florecerán ramas de coral brillante
                    en la bahía de Octy, iluminando su refugio nocturno.
                  </Text>

                  <View style={styles.reefProgressContainer}>
                    <View style={styles.reefProgressHeader}>
                      <Text style={styles.reefProgressLabel}>
                        Construcción de arrecife
                      </Text>
                      <Text style={styles.reefProgressLevel}>Nivel 0 / 3</Text>
                    </View>
                    <View style={styles.reefTrack}>
                      <View style={styles.reefFill} />
                    </View>
                  </View>
                </View>

                <View style={styles.xpCard}>
                  <Text style={styles.xpIcon}>🧠</Text>
                  <Text style={styles.xpLabel}>Foco por sesión asociada</Text>
                  <Text style={styles.xpValue}>+5 XP extra</Text>
                </View>
              </View>
            )}
          </View>

          {/* Widget resumen de recompensas */}
          <View style={styles.summaryRewardCard}>
            <View style={styles.summaryRewardLeft}>
              <View style={styles.rewardMedalIconCircle}>
                <Text style={styles.medalIcon}>🎖️</Text>
              </View>
              <View>
                <Text style={styles.summaryRewardTitle}>
                  Recompensas al Crear
                </Text>
              </View>
            </View>
            <View style={styles.summaryRewardRight}>
              <Text style={styles.pointsText}>+30 Puntos</Text>
              <Text style={styles.vitalityText}>+15% Vitalidad</Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsBlock}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Crear Proyecto"
              disabled={isSaving || name.trim() === ""}
              onPress={handleSaveProject}
              style={({ pressed }) => [
                styles.saveProjectBtn,
                name.trim() === "" && styles.saveProjectBtnDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.saveProjectIcon}>✓</Text>
              <Text style={styles.saveProjectText}>Crear Proyecto</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Guardar como borrador"
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.draftBtn,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.draftBtnText}>Guardar como borrador</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de información y consejos */}
      <Modal
        visible={showInfoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalBar} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>💡</Text>
              <Text style={styles.modalTitle}>
                ¿Cómo funcionan los Proyectos?
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar modal"
                hitSlop={8}
                onPress={() => setShowInfoModal(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalDesc}>
              Un proyecto en Octopus es un contenedor de energía marina. A
              diferencia de las tareas individuales, agrupa múltiples metas hacia
              un propósito duradero y permite a tu pulpo construir estructuras
              complejas en su hábitat.
            </Text>

            <View style={styles.tipCallout}>
              <Text style={styles.tipBullet}>💡</Text>
              <Text style={styles.tipCalloutText}>
                Mantén los nombres claros y agrega metas alcanzables.
              </Text>
            </View>

            <View style={styles.tipCallout}>
              <Text style={styles.tipBullet}>🪸</Text>
              <Text style={styles.tipCalloutText}>
                Los hitos intermedios te darán perlas y vitalidad progresiva.
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entendido"
              onPress={() => setShowInfoModal(false)}
              style={styles.modalOkBtn}
            >
              <Text style={styles.modalOkBtnText}>¡Entendido!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Toast emergente de confirmación */}
      {showToast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastWrapper,
            {
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.toastBox}>
            <View style={styles.toastCheckIconCircle}>
              <Text style={styles.toastCheckMark}>✓</Text>
            </View>
            <View style={styles.toastTextColumn}>
              <Text style={styles.toastTitle}>¡Proyecto Sumergido!</Text>
              <Text style={styles.toastDesc}>
                Octy ha comenzado a colocar los primeros corales.
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
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
    paddingTop: 12,
    gap: 14,
  },
  tabletContainer: {
    maxWidth: 580,
    width: "100%",
    alignSelf: "center",
  },

  /* Subheader */
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  studioLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primaryContainer,
  },
  phaseLabel: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  helpButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  /* Banner motivacional */
  motivationBanner: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 18,
    padding: 14,
    position: "relative",
    overflow: "hidden",
  },
  glowDecor: {
    position: "absolute",
    right: -15,
    bottom: -15,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(14, 165, 233, 0.1)",
  },
  motivationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatarMiniCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  octyEmoji: {
    fontSize: 22,
  },
  miniBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  miniBadgeIcon: {
    fontSize: 9,
  },
  motivationTextContainer: {
    flex: 1,
    gap: 3,
  },
  motivationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  motivationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  vitalityTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
    gap: 3,
  },
  vitalityTagIcon: {
    fontSize: 10,
    color: COLORS.secondary,
  },
  vitalityTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.onSecondaryFixed,
  },
  motivationDesc: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },

  /* Acordeón */
  accordionCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  accordionHeader: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accordionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderIcon: {
    fontSize: 18,
  },
  cardHeaderTitles: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 1,
  },
  chevronIcon: {
    fontSize: 12,
    color: COLORS.outline,
    marginLeft: 8,
  },
  accordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    gap: 12,
  },

  /* Campos */
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.onSurface,
  },
  requiredStar: {
    color: COLORS.secondary,
  },
  requiredBadge: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
  },
  optionalBadge: {
    fontSize: 10,
    color: COLORS.outline,
  },
  textInput: {
    height: 46,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 23,
    paddingHorizontal: 16,
    fontSize: 13,
    color: COLORS.onSurface,
  },
  textArea: {
    minHeight: 64,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: COLORS.onSurface,
  },
  emojiRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  emojiBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiBtnSelected: {
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 2,
    borderColor: COLORS.primaryContainer,
  },
  emojiText: {
    fontSize: 18,
  },
  colorSelectedName: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
  },
  paletteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  colorBtnDim: {
    opacity: 0.5,
  },
  checkWhite: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  /* Fechas */
  typeToggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 22,
    padding: 3,
  },
  typeToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  typeToggleBtnActive: {
    backgroundColor: COLORS.surfaceContainerLowest,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  typeToggleText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    fontWeight: "600",
  },
  typeToggleTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  datesGrid: {
    flexDirection: "row",
    gap: 10,
  },
  dateField: {
    flex: 1,
    gap: 4,
  },
  fieldSublabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  dateBox: {
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceContainerLow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  dateBoxText: {
    fontSize: 12,
    color: COLORS.onSurface,
  },
  dateBoxIcon: {
    fontSize: 14,
  },
  cadenceRow: {
    flexDirection: "row",
    gap: 8,
  },
  cadenceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  cadenceChipActive: {
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  cadenceChipText: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  cadenceChipTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  /* Subtareas */
  progressSummaryBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 10,
    borderRadius: 14,
    gap: 6,
  },
  progressSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressSummaryTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  progressSummaryCount: {
    fontSize: 10,
    color: COLORS.outline,
  },
  progressTrack: {
    height: 5,
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primaryContainer,
  },
  emptySubtasksNote: {
    padding: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 14,
  },
  emptySubtasksText: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },
  subtasksList: {
    gap: 8,
  },
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 14,
    padding: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(190, 200, 210, 0.4)",
  },
  subtaskIndexBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  subtaskIndexText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  subtaskInputContainer: {
    flex: 1,
    gap: 2,
  },
  subtaskInput: {
    fontSize: 13,
    color: COLORS.onSurface,
    paddingVertical: 2,
  },
  subtaskWeightText: {
    fontSize: 10,
    color: COLORS.primary,
  },
  removeSubtaskBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  removeSubtaskText: {
    fontSize: 14,
    color: COLORS.outline,
  },
  addSubtaskBtn: {
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addSubtaskIcon: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },
  addSubtaskLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  subtaskTipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 10,
    borderRadius: 12,
  },
  tipIcon: {
    fontSize: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    lineHeight: 15,
  },

  /* Impacto en Octy */
  ecosystemCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 12,
    borderRadius: 14,
    gap: 6,
  },
  ecosystemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ecosystemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  coralIcon: {
    fontSize: 18,
  },
  ecosystemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  unlockBadge: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
  },
  unlockBadgeText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "700",
  },
  ecosystemDesc: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },
  reefProgressContainer: {
    gap: 4,
    paddingTop: 4,
  },
  reefProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reefProgressLabel: {
    fontSize: 10,
    color: COLORS.outline,
  },
  reefProgressLevel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },
  reefTrack: {
    height: 5,
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: 3,
    overflow: "hidden",
  },
  reefFill: {
    width: "25%",
    height: "100%",
    backgroundColor: COLORS.tertiaryContainer,
  },
  xpCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 10,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  xpIcon: {
    fontSize: 16,
  },
  xpLabel: {
    flex: 1,
    fontSize: 12,
    color: COLORS.onSurface,
    marginLeft: 8,
  },
  xpValue: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary,
  },

  /* Resumen de Recompensas */
  summaryRewardCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryRewardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rewardMedalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(14, 165, 233, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  medalIcon: {
    fontSize: 18,
  },
  summaryRewardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  summaryRewardSubtitle: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
  },
  summaryRewardRight: {
    alignItems: "flex-end",
    gap: 1,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  vitalityText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.tertiary,
  },

  /* Botones de acción */
  actionsBlock: {
    gap: 8,
    marginTop: 4,
  },
  saveProjectBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  saveProjectBtnDisabled: {
    opacity: 0.5,
  },
  saveProjectIcon: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
  },
  saveProjectText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  draftBtn: {
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
  },
  draftBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },

  /* Modal de ayuda */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(40, 48, 68, 0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.outlineVariant,
    alignSelf: "center",
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalIcon: {
    fontSize: 22,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.onSurface,
    flex: 1,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
  },
  modalDesc: {
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    lineHeight: 18,
  },
  tipCallout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 12,
    borderRadius: 14,
  },
  tipBullet: {
    fontSize: 18,
  },
  tipCalloutText: {
    fontSize: 12,
    color: COLORS.onSurface,
    flex: 1,
  },
  modalOkBtn: {
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  modalOkBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },

  /* Toast */
  toastWrapper: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 100,
  },
  toastBox: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.onSurface,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  toastCheckIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  toastCheckMark: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  toastTextColumn: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  toastDesc: {
    fontSize: 11,
    color: COLORS.surfaceContainerHigh,
    marginTop: 1,
  },
});

