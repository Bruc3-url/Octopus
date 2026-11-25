import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  cerrarSesion,
  obtenerTareas,
  subscribeTasks,
  toggleTareaCompletada,
} from "../Backend";
import FloatingSpeedDial from "./FloatingSpeedDial";

/* ------------------------------------------------------------------ */
/* Tokens de color extraídos de la configuración de diseño            */
/* ------------------------------------------------------------------ */
const COLORS = {
  primary: "#006591",
  primaryContainer: "#0ea5e9",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#003751",
  secondary: "#9d4300",
  secondaryContainer: "#fd761a",
  tertiary: "#006c49",
  tertiaryContainer: "#00b17b",
  surface: "#faf8ff",
  surfaceContainer: "#eaedff",
  surfaceContainerLow: "#f2f3ff",
  surfaceContainerHigh: "#e2e7ff",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#131b2e",
  onSurfaceVariant: "#3e4850",
  outline: "#6e7881",
  outlineVariant: "#bec8d2",
  error: "#ba1a1a",
};

const WEEK_DAYS = [
  { label: "L", day: 22 },
  { label: "M", day: 23 },
  { label: "M", day: 24, today: true },
  { label: "J", day: 25 },
  { label: "V", day: 26 },
  { label: "S", day: 27 },
  { label: "D", day: 28 },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = width < 360;
  const isTablet = width >= 768;
  const petContainerSize = isSmall ? 74 : 84;
  const petImageSize = isSmall ? 66 : 76;

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Agendar una tarea",
      time: "09:00 AM",
      category: "Personal",
      priority: "Alta",
      completed: false,
    },
    {
      id: "2",
      title: "Agendar un proyecto",
      time: "11:30 AM",
      category: "Profesional",
      priority: "Media",
      completed: false,
    },
  ]);

  const [filter, setFilter] = useState("todas");
  const [selectedDay, setSelectedDay] = useState(24);
  const [activeTab, setActiveTab] = useState("hoy");
  const petScale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    obtenerTareas().then((guardadas) => {
      if (guardadas && guardadas.length > 0) {
        setTasks(guardadas);
      }
    });

    const unsubscribe = subscribeTasks((nuevasTareas) => {
      setTasks(nuevasTareas);
    });

    return unsubscribe;
  }, []);

  const toggleTask = (taskId) => {
    toggleTareaCompletada(taskId).then((updated) => {
      if (updated) setTasks(updated);
    });
  };

  const cheerPet = () => {
    Animated.sequence([
      Animated.timing(petScale, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(petScale, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
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

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pendientes") return !task.completed;
    if (filter === "completadas") return task.completed;
    return true;
  });

  return (
    <SafeAreaView style={styles.screen} edges={["top", "right", "left"]}>
      {/* ----------------- Header superior responsive ----------------- */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>Octopus</Text>
          <Text style={styles.brandSeparator}>/</Text>
          <Text style={styles.sectionHeaderTitle} numberOfLines={1}>
            Hoy
          </Text>
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
                "Tienes 2 actividades iniciales pendientes en tu agenda.",
              )
            }
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Perfil y opciones de sesión"
            hitSlop={8}
            onPress={handleSignOut}
            style={({ pressed }) => [styles.profileAvatar, pressed && styles.pressed]}
          >
            <Text style={styles.profileAvatarText}>A</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          isTablet && styles.tabletContainer,
          {
            paddingHorizontal: isSmall ? 14 : 18,
            paddingBottom: 96 + Math.max(insets.bottom, 12),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ----------------- 1. Saludo y Racha ----------------- */}
        <View style={styles.greetingSection}>
          <View style={styles.dateRow}>
            <Text style={[styles.dateText, isSmall && styles.dateTextSmall]}>
              Miércoles, 24 Octubre
            </Text>
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeIcon}>🔥</Text>
              <Text style={styles.streakBadgeText}>5 días</Text>
            </View>
          </View>

          <View style={styles.greetingTitles}>
            <Text
              style={[
                styles.greetingTitle,
                isSmall && styles.greetingTitleSmall,
              ]}
            >
              Hola, Alex 👋
            </Text>
          </View>

          {/* Banner de progreso de racha */}
          <View style={styles.streakProgressBanner}>
            <View style={styles.streakProgressLeft}>
              <View style={styles.boltIconContainer}>
                <Text style={styles.boltIcon}>⚡</Text>
              </View>
              <View style={styles.streakTextContainer}>
                <Text style={styles.streakBannerTitle} numberOfLines={1}>
                  Racha activa en curso
                </Text>
                <Text style={styles.streakBannerSubtitle} numberOfLines={1}>
                  Meta diaria: {completedCount}/{tasks.length} tareas ({completionPercent}%)
                </Text>
              </View>
            </View>

            <View style={styles.progressCircle}>
              <Text style={styles.progressCircleText}>{completionPercent}%</Text>
            </View>
          </View>
        </View>

        {/* ----------------- 2. Estado de la Mascota Octy ----------------- */}
        <View style={styles.petCard}>
          <View style={styles.petCardGlowPrimary} />
          <View style={styles.petCardGlowTertiary} />

          <View
            style={[
              styles.petCardContent,
              { gap: isSmall ? 10 : 16 },
            ]}
          >
            {/* Imagen del Pulpo_sano con dimensiones responsivas */}
            <Pressable
              onPress={cheerPet}
              accessibilityRole="button"
              accessibilityLabel="Animar a Octy"
              style={[
                styles.petImageContainer,
                {
                  width: petContainerSize,
                  height: petContainerSize,
                  borderRadius: petContainerSize / 2,
                },
              ]}
            >
              <Animated.Image
                source={require("../../assets/images/Pulpo_sano.png")}
                style={[
                  styles.petImage,
                  {
                    width: petImageSize,
                    height: petImageSize,
                    transform: [{ scale: petScale }],
                  },
                ]}
                resizeMode="contain"
              />
            </Pressable>

            {/* Metadatos y vitalidad */}
            <View style={styles.petMeta}>
              <View style={styles.petStatusPill}>
                <Text style={styles.petStatusText}>Octy está Radiante</Text>
              </View>

              <Text
                style={[styles.petSubtitle, isSmall && styles.petSubtitleSmall]}
                numberOfLines={2}
              >
                Mantén el ritmo hoy para que no pierda su brillo acuático.
              </Text>

              <View style={[styles.vitalsRow, { gap: isSmall ? 8 : 12 }]}>
                <View style={styles.vitalColumn}>
                  <View style={styles.vitalHeader}>
                    <Text style={styles.vitalLabel}>Energía</Text>
                  </View>
                  <View style={styles.vitalTrack}>
                    <View style={[styles.vitalFillPrimary, { width: "85%" }]} />
                  </View>
                </View>

                <View style={styles.vitalColumn}>
                  <View style={styles.vitalHeader}>
                    <Text style={styles.vitalLabel}>Ánimo</Text>
                  </View>
                  <View style={styles.vitalTrack}>
                    <View style={[styles.vitalFillTertiary, { width: "90%" }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ----------------- 3. Tira de Días y Filtros (Responsive) ----------------- */}
        <View style={styles.quickActionBar}>
          {/* Tira horizontal de días adaptable (flex: 1 en cada día) */}
          <View style={styles.weekStrip}>
            {WEEK_DAYS.map((item) => {
              const isSelected = selectedDay === item.day;
              return (
                <Pressable
                  key={item.day}
                  onPress={() => setSelectedDay(item.day)}
                  style={[
                    styles.dayPill,
                    isSelected && styles.dayPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayPillLabel,
                      isSelected && styles.dayPillTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.dayPillNumber,
                      isSelected && styles.dayPillTextSelected,
                    ]}
                  >
                    {item.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Chips de filtro en ScrollView horizontal para evitar desbordamiento */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsScroll}
          >
            <Pressable
              onPress={() => setFilter("todas")}
              style={[
                styles.filterChip,
                filter === "todas" && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === "todas" && styles.filterChipTextActive,
                ]}
              >
                Todas ({tasks.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilter("pendientes")}
              style={[
                styles.filterChip,
                filter === "pendientes" && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === "pendientes" && styles.filterChipTextActive,
                ]}
              >
                Pendientes ({pendingCount})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilter("completadas")}
              style={[
                styles.filterChip,
                filter === "completadas" && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === "completadas" && styles.filterChipTextActive,
                ]}
              >
                Completadas ({completedCount})
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* ----------------- 4. Agenda Diaria (2 Tareas Iniciales) ----------------- */}
        <View style={styles.agendaSection}>
          <View style={styles.agendaHeader}>
            <Text style={styles.agendaTitle}>Agenda Diaria</Text>
            <Text style={styles.agendaCounter}>
              {tasks.length} actividades programadas
            </Text>
          </View>

          {filteredTasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                task.completed && styles.taskCardCompleted,
              ]}
            >
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.completed }}
                accessibilityLabel={`Marcar ${task.title}`}
                onPress={() => toggleTask(task.id)}
                hitSlop={8}
                style={[
                  styles.checkButton,
                  task.completed && styles.checkButtonActive,
                ]}
              >
                {task.completed ? (
                  <Text style={styles.checkIcon}>✓</Text>
                ) : null}
              </Pressable>

              <View style={styles.taskBody}>
                <View style={styles.taskTitleRow}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && styles.taskTitleCompleted,
                    ]}
                    numberOfLines={2}
                  >
                    {task.title}
                  </Text>
                  <Text style={styles.taskTime}>{task.time}</Text>
                </View>

                <View style={styles.taskMetaRow}>
                  <View style={styles.taskTags}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {task.category}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.priorityBadge,
                        task.priority === "Alta"
                          ? styles.priorityBadgeHigh
                          : styles.priorityBadgeMedium,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityBadgeText,
                          task.priority === "Alta"
                            ? styles.priorityBadgeTextHigh
                            : styles.priorityBadgeTextMedium,
                        ]}
                      >
                        {task.priority === "Alta" ? "▲ " : ""}
                        {task.priority}
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Opciones de tarea"
                    onPress={() =>
                      Alert.alert(
                        task.title,
                        `Categoría: ${task.category}\nPrioridad: ${task.priority}\nHorario: ${task.time}`,
                        [{ text: "Cerrar" }],
                      )
                    }
                    hitSlop={8}
                    style={styles.moreOptionsButton}
                  >
                    <Text style={styles.moreOptionsText}>⋮</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ----------------- Barra Inferior de Navegación con Safe Area ----------------- */}
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
          onPress={() => setActiveTab("hoy")}
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
          onPress={() => router.replace("/mascota")}
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

      <FloatingSpeedDial />
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Estilos adaptados para dispositivos móviles                       */
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
  brandContainer: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  brandText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  brandSeparator: {
    fontSize: 15,
    color: COLORS.outlineVariant,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.onSurface,
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
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
  profileAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  contentContainer: {
    paddingTop: 14,
    gap: 18,
  },
  tabletContainer: {
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },

  /* 1. Saludo y racha */
  greetingSection: {
    gap: 8,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    flexShrink: 1,
  },
  dateTextSmall: {
    fontSize: 11,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(253, 118, 26, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    flexShrink: 0,
  },
  streakBadgeIcon: {
    fontSize: 13,
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  greetingTitles: {
    marginTop: 2,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.onSurface,
    letterSpacing: -0.4,
  },
  greetingTitleSmall: {
    fontSize: 21,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 18,
  },
  streakProgressBanner: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 18,
    padding: 14,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  streakProgressLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  streakTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  boltIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(253, 118, 26, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  boltIcon: {
    fontSize: 18,
  },
  streakBannerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
  },
  streakBannerSubtitle: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    marginTop: 1,
  },
  progressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3.5,
    borderColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14, 165, 233, 0.08)",
    flexShrink: 0,
  },
  progressCircleText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },

  /* 2. Tarjeta de la mascota */
  petCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(226, 231, 255, 0.7)",
  },
  petCardGlowPrimary: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
  },
  petCardGlowTertiary: {
    position: "absolute",
    bottom: -15,
    left: -15,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0, 177, 123, 0.1)",
  },
  petCardContent: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  petImageContainer: {
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  petImage: {
    alignSelf: "center",
  },
  petMeta: {
    flex: 1,
    minWidth: 0,
  },
  petStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 177, 123, 0.14)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
    marginBottom: 5,
  },
  petStatusSparkle: {
    fontSize: 11,
  },
  petStatusText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.tertiary,
  },
  petSubtitle: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },
  petSubtitleSmall: {
    fontSize: 11,
    lineHeight: 15,
  },
  vitalsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  vitalColumn: {
    flex: 1,
    minWidth: 0,
  },
  vitalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  vitalLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  vitalValuePrimary: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },
  vitalValueTertiary: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.tertiary,
  },
  vitalTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 3,
    overflow: "hidden",
  },
  vitalFillPrimary: {
    height: "100%",
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 3,
  },
  vitalFillTertiary: {
    height: "100%",
    backgroundColor: COLORS.tertiaryContainer,
    borderRadius: 3,
  },

  /* 3. Tira de días y chips */
  quickActionBar: {
    gap: 10,
  },
  weekStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  dayPill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 12,
    minWidth: 0,
  },
  dayPillSelected: {
    backgroundColor: COLORS.primary,
  },
  dayPillLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  dayPillNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.onSurface,
    marginTop: 2,
  },
  dayPillTextSelected: {
    color: "#ffffff",
  },
  filterChipsScroll: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainer,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  filterChipTextActive: {
    color: "#ffffff",
  },

  /* 4. Agenda diaria */
  agendaSection: {
    gap: 10,
  },
  agendaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  agendaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  agendaCounter: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  taskCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 13,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: "rgba(242, 243, 255, 0.8)",
    opacity: 0.85,
  },
  checkButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1.5,
    borderColor: COLORS.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  checkButtonActive: {
    backgroundColor: COLORS.tertiaryContainer,
    borderColor: COLORS.tertiaryContainer,
  },
  checkIcon: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },
  taskBody: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  taskTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
    flex: 1,
    flexShrink: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: COLORS.onSurfaceVariant,
  },
  taskTime: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
    flexShrink: 0,
  },
  taskMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  taskTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    flexWrap: "wrap",
  },
  categoryBadge: {
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityBadgeHigh: {
    backgroundColor: "rgba(253, 118, 26, 0.15)",
  },
  priorityBadgeMedium: {
    backgroundColor: COLORS.surfaceContainer,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  priorityBadgeTextHigh: {
    color: COLORS.secondary,
  },
  priorityBadgeTextMedium: {
    color: COLORS.onSurfaceVariant,
  },
  moreOptionsButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 0,
  },
  moreOptionsText: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    fontWeight: "700",
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