import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  primary: "#006591",
  primaryContainer: "#0ea5e9",
  secondaryContainer: "#fd761a",
  onSurface: "#131b2e",
  backdrop: "rgba(19, 27, 46, 0.4)",
};

export default function FloatingSpeedDial({
  onPressTask,
  onPressProject,
  bottomOffset,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(() => new Animated.Value(0));
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const calculatedRight = isTablet ? Math.max(20, (width - 640) / 2 + 20) : 20;
  const calculatedBottom =
    bottomOffset ?? 58 + Math.max(insets.bottom, 8) + 16;

  const toggleMenu = () => {
    if (isOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.spring(animation, {
        toValue: 1,
        friction: 6,
        tension: 45,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAction = (action) => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
      if (action) {
        action();
      }
    });
  };

  const handleTaskPress = () => {
    handleAction(onPressTask ? onPressTask : () => router.push("/nueva-tarea"));
  };

  const handleProjectPress = () => {
    handleAction(
      onPressProject ? onPressProject : () => router.push("/nuevo-proyecto"),
    );
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const taskTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });
  const taskOpacity = animation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });
  const taskScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const projectTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 0],
  });
  const projectOpacity = animation.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.3, 1],
  });
  const projectScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <>
      {isOpen && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={toggleMenu}
            accessibilityRole="button"
            accessibilityLabel="Cerrar opciones"
          />
        </Animated.View>
      )}

      <View
        pointerEvents="box-none"
        style={[
          styles.container,
          {
            bottom: calculatedBottom,
            right: calculatedRight,
          },
        ]}
      >
        {isOpen && (
          <View style={styles.actionsColumn} pointerEvents="box-none">
            {/* Botón 1: Nuevo Proyecto */}
            <Animated.View
              style={[
                styles.itemWrapper,
                {
                  opacity: projectOpacity,
                  transform: [
                    { translateY: projectTranslateY },
                    { scale: projectScale },
                  ],
                },
              ]}
            >
              <Pressable
                onPress={handleProjectPress}
                accessibilityRole="button"
                accessibilityLabel="Crear un proyecto"
                style={({ pressed }) => [
                  styles.itemPressable,
                  pressed && styles.itemPressed,
                ]}
              >
                <View style={styles.itemLabelBox}>
                  <Text style={styles.itemLabelText}>Nuevo proyecto</Text>
                </View>
                <View style={[styles.itemCircle, styles.projectCircle]}>
                  <Text style={styles.itemEmoji}>🚀</Text>
                </View>
              </Pressable>
            </Animated.View>

            {/* Botón 2: Nueva Tarea */}
            <Animated.View
              style={[
                styles.itemWrapper,
                {
                  opacity: taskOpacity,
                  transform: [
                    { translateY: taskTranslateY },
                    { scale: taskScale },
                  ],
                },
              ]}
            >
              <Pressable
                onPress={handleTaskPress}
                accessibilityRole="button"
                accessibilityLabel="Crear una nueva tarea"
                style={({ pressed }) => [
                  styles.itemPressable,
                  pressed && styles.itemPressed,
                ]}
              >
                <View style={styles.itemLabelBox}>
                  <Text style={styles.itemLabelText}>Nueva tarea</Text>
                </View>
                <View style={[styles.itemCircle, styles.taskCircle]}>
                  <Text style={styles.itemEmoji}>📝</Text>
                </View>
              </Pressable>
            </Animated.View>
          </View>
        )}

        {/* Botón Principal (FAB) */}
        <Pressable
          onPress={toggleMenu}
          accessibilityRole="button"
          accessibilityLabel={
            isOpen ? "Cerrar opciones" : "Crear nueva tarea o proyecto"
          }
          style={({ pressed }) => [
            styles.fab,
            isOpen && styles.fabOpen,
            pressed && styles.fabPressed,
          ]}
        >
          <Animated.View
            style={[
              styles.fabIconWrapper,
              { transform: [{ rotate: rotation }] },
            ]}
          >
            <Text style={styles.fabIcon}>+</Text>
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: COLORS.backdrop,
    zIndex: 998,
  },
  container: {
    position: "absolute",
    alignItems: "flex-end",
    zIndex: 999,
  },
  actionsColumn: {
    alignItems: "flex-end",
    gap: 12,
    marginBottom: 12,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  itemLabelBox: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(226, 231, 255, 0.9)",
  },
  itemLabelText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.onSurface,
  },
  itemCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },
  taskCircle: {
    backgroundColor: COLORS.primaryContainer,
  },
  projectCircle: {
    backgroundColor: COLORS.secondaryContainer,
  },
  itemEmoji: {
    fontSize: 19,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabOpen: {
    backgroundColor: COLORS.onSurface,
  },
  fabPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  fabIconWrapper: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "400",
    textAlign: "center",
    includeFontPadding: false,
  },
});
