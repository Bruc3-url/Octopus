import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { cerrarSesion, obtenerProyectos, subscribeProyectos } from "../Backend";
import FloatingSpeedDial from "./FloatingSpeedDial";

const COLORS = {
  primary: "#006591",
  primaryContainer: "#0ea5e9",
  onPrimary: "#ffffff",
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
};

export default function ProyectosScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = width >= 768;
  const isSmall = width < 360;

  const [projects, setProjects] = useState([]);
  const [activeTab] = useState("proyectos");

  useEffect(() => {
    obtenerProyectos().then((guardados) => {
      if (guardados) setProjects(guardados);
    });

    const unsubscribe = subscribeProyectos((actualizados) => {
      setProjects(actualizados);
    });

    return unsubscribe;
  }, []);

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

  return (
    <SafeAreaView style={styles.screen} edges={["top", "right", "left"]}>
      {/* ----------------- Header superior ----------------- */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>Octopus</Text>
          <Text style={styles.brandSeparator}>/</Text>
          <Text style={styles.sectionHeaderTitle} numberOfLines={1}>
            Proyectos
          </Text>
        </View>

        <View style={styles.headerActions}>
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
        {/* Banner de Hábitat / Visión de Proyectos */}
        <View style={styles.overviewBanner}>
          <View style={styles.bannerGlow} />
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconContainer}>
              <Text style={styles.bannerIcon}>🪸</Text>
            </View>
            <View style={styles.bannerTextContainer}>
              <View style={styles.bannerTitleRow}>
                <Text style={styles.bannerTitle}>Productividad</Text>
              </View>
              <Text style={styles.bannerSubtitle}>
                Los proyectos completados construyen hábitats para Octy.
              </Text>
            </View>
          </View>
        </View>

        {/* Sección de lista de proyectos */}
        <View style={styles.projectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus Proyectos</Text>
            <Text style={styles.sectionCount}>
              {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"}
            </Text>
          </View>

          {projects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🌊</Text>
              <Text style={styles.emptyTitle}>Aún no tienes proyectos</Text>
              <Text style={styles.emptySubtitle}>
                Crea tu primer proyecto para que Octy comience a construir un nuevo arrecife coral.
              </Text>
            </View>
          ) : (
            projects.map((proj) => {
              const subtaskCount = proj.subtasks?.length || 0;
              const completedSubtasks =
                proj.subtasks?.filter((s) => s.completed)?.length || 0;
              const progressPercent =
                subtaskCount > 0
                  ? Math.round((completedSubtasks / subtaskCount) * 100)
                  : 0;

              return (
                <View key={proj.id} style={styles.projectCard}>
                  <View style={styles.projectHeader}>
                    <View
                      style={[
                        styles.projectIconCircle,
                        { backgroundColor: proj.color || COLORS.primaryContainer },
                      ]}
                    >
                      <Text style={styles.projectEmoji}>{proj.icon || "🚀"}</Text>
                    </View>

                    <View style={styles.projectTitleContainer}>
                      <Text style={styles.projectName} numberOfLines={1}>
                        {proj.name}
                      </Text>
                      {proj.vision ? (
                        <Text style={styles.projectVision} numberOfLines={2}>
                          {proj.vision}
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>
                        {proj.type === "deadline" ? "Con plazo" : "Continuo"}
                      </Text>
                    </View>
                  </View>

                  {/* Progreso de subtareas */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>
                        {subtaskCount === 0
                          ? "Sin subtareas registradas"
                          : `${completedSubtasks} de ${subtaskCount} subtareas (${progressPercent}%)`}
                      </Text>
                      <Text style={styles.targetDateText}>
                        {proj.targetDate ? proj.targetDate : "Flexible"}
                      </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${progressPercent}%`,
                            backgroundColor: proj.color || COLORS.primaryContainer,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })
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
          onPress={() => { }}
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
    gap: 8,
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
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
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
    opacity: 0.75,
  },
  contentContainer: {
    paddingTop: 16,
    gap: 18,
  },
  tabletContainer: {
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },

  /* Banner de Hábitat */
  overviewBanner: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 20,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  bannerGlow: {
    position: "absolute",
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  bannerIcon: {
    fontSize: 24,
  },
  bannerTextContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  bannerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  activeBadge: {
    backgroundColor: "rgba(0, 177, 123, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.tertiary,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },

  /* Sección de proyectos */
  projectsSection: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  emptyState: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(226, 231, 255, 0.8)",
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 17,
  },
  projectCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(226, 231, 255, 0.8)",
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  projectIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectEmoji: {
    fontSize: 22,
  },
  projectTitleContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  projectName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  projectVision: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },
  typeBadge: {
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  progressContainer: {
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainer,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  targetDateText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
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

