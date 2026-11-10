import { router } from "expo-router";
import { useState } from "react";
import {
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
import { iniciarSesion } from "../src/Backend/registrar";

export default function LoginScreen() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await iniciarSesion({ correo, password });
      if (error) {
        throw error;
      }
    } catch (error) {
      alert(`Error de autenticación: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Iniciar sesión</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Bienvenido de vuelta</Text>
          <Text style={styles.subtitle}>
            Ingresa a tu santuario de productividad y cuida de Octy.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              placeholder="alex@ejemplo.com"
              placeholderTextColor="#6e7881"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Tu contraseña"
              placeholderTextColor="#6e7881"
              secureTextEntry
              autoCapitalize="none"
            />

            <Pressable
              accessibilityRole="button"
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              <Text style={styles.submitLabel}>
                {loading ? "Accediendo..." : "Iniciar sesión"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Registrarse"
              onPress={() => router.replace("/")}
            >
              <Text style={styles.footerLink}>Regístrate aquí</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#faf8ff" },
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#faf8ff",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  backLabel: { fontSize: 36, color: "#131b2e", lineHeight: 40 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#131b2e" },
  headerSpacer: { width: 44 },
  body: { flex: 1 },
  content: { padding: 20, paddingTop: 32 },
  title: { fontSize: 24, fontWeight: "700", color: "#131b2e" },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: "#3e4850",
  },
  card: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    gap: 12,
  },
  label: { fontSize: 12, fontWeight: "600", color: "#3e4850" },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "#f2f3ff",
    color: "#131b2e",
  },
  submitButton: {
    height: 48,
    marginTop: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0ea5e9",
  },
  submitLabel: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  footerText: { fontSize: 14, color: "#3e4850" },
  footerLink: { fontSize: 14, fontWeight: "700", color: "#006591" },
});
