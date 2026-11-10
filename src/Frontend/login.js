import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { iniciarSesion } from "../Backend/index.js";

const COLORS = {
  primary: "#006591",
  primaryContainer: "#0ea5e9",
  surface: "#faf8ff",
  surfaceContainer: "#f2f3ff",
  onSurface: "#131b2e",
  onSurfaceVariant: "#3e4850",
  outline: "#6e7881",
  error: "#ba1a1a",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await iniciarSesion({
        correo: email,
        password,
      });

      if (error) {
        Alert.alert("No se pudo iniciar sesión", error.message);
        return;
      }

      Alert.alert("¡Bienvenido!", "Iniciaste sesión correctamente.");
    } catch (error) {
      Alert.alert(
        "No se pudo iniciar sesión",
        error instanceof Error ? error.message : "Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "right", "bottom", "left"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver al registro"
              hitSlop={10}
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>
            <Text style={styles.brand}>Octopus</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.intro}>
            <View style={styles.mascot}>
              <Text style={styles.mascotEmoji}>🐙</Text>
            </View>
            <Text style={styles.title}>Bienvenido de vuelta</Text>
            <Text style={styles.subtitle}>
              Ingresa a tu santuario de productividad y cuida de Octy.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              accessibilityLabel="Correo electrónico"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="alex@ejemplo.com"
              placeholderTextColor={COLORS.outline}
              returnKeyType="next"
              style={styles.input}
              textContentType="emailAddress"
              value={email}
            />

            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Contraseña</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                hitSlop={8}
                onPress={() => setPasswordVisible((visible) => !visible)}
              >
                <Text style={styles.showPassword}>
                  {passwordVisible ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
            <TextInput
              accessibilityLabel="Contraseña"
              autoCapitalize="none"
              autoComplete="current-password"
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
              placeholder="Tu contraseña"
              placeholderTextColor={COLORS.outline}
              returnKeyType="go"
              secureTextEntry={!passwordVisible}
              style={styles.input}
              textContentType="password"
              value={password}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isSubmitting }}
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isSubmitting && styles.submitPressed,
                isSubmitting && styles.submitDisabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitLabel}>Iniciar sesión</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace("/registro")}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.registerLink}>Regístrate aquí</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  backArrow: {
    color: COLORS.onSurface,
    fontSize: 32,
    lineHeight: 36,
  },
  brand: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 44,
  },
  intro: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 28,
  },
  mascot: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e7ff",
    marginBottom: 16,
  },
  mascotEmoji: {
    fontSize: 40,
  },
  title: {
    color: COLORS.onSurface,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 330,
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#131b2e",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    color: COLORS.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    color: COLORS.onSurface,
    fontSize: 15,
    borderRadius: 25,
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  showPassword: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  submitButton: {
    minHeight: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryContainer,
    marginTop: 2,
  },
  submitPressed: {
    opacity: 0.85,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 13,
    marginRight: 4,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
    padding: 4,
  },
  pressed: {
    opacity: 0.65,
  },
});
