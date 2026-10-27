/**
 * Pantalla de registro (Sign Up) de Octopus.
 *
 * Conversión a React Native / Expo del diseño HTML + Tailwind exportado del mockup.
 *
 * Qué se conservó:
 *  - la paleta exacta del `tailwind.config` (primary, surface, tertiary, error...),
 *    la escala tipográfica, los radios (16 / 32 / full) y los espaciados
 *    (space-xs 4, sm 8, md 16, lg 24, xl 40, margin 20);
 *  - toda la lógica de validación: email en vivo, medidor de contraseña de 3 reglas,
 *    coincidencia de contraseñas, términos y botón habilitado sólo si todo pasa.
 *
 * Qué cambió (inevitable al pasar de HTML a React Native):
 *  - Tailwind -> StyleSheet; las clases de layout se fijan en los estilos;
 *  - los Material Symbols (webfont de Google) -> componente <Icon /> dibujado con
 *    Views, sin dependencias nuevas. Para usar iconos reales, instala
 *    `@expo/vector-icons` y reemplaza únicamente el cuerpo de <Icon />;
 *  - Plus Jakarta Sans -> fuente del sistema con los mismos tamaños y pesos. Para
 *    activarla: `npx expo install @expo-google-fonts/plus-jakarta-sans` y añade
 *    `fontFamily: 'PlusJakartaSans_400Regular'` (etc.) a cada entrada de TYPE.
 */

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

/* ------------------------------------------------------------------ */
/* Tokens de diseño (extraídos del tailwind.config del mockup)         */
/* ------------------------------------------------------------------ */

const COLORS = {
  primary: "#006591",
  onPrimary: "#ffffff",
  primaryContainer: "#0ea5e9",
  onPrimaryContainer: "#003751",
  surface: "#faf8ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f2f3ff",
  surfaceContainer: "#eaedff",
  surfaceContainerHigh: "#e2e7ff",
  onSurface: "#131b2e",
  onSurfaceVariant: "#3e4850",
  outline: "#6e7881",
  outlineVariant: "#bec8d2",
  tertiary: "#006c49",
  tertiaryContainer: "#00b17b",
  secondary: "#9d4300",
  secondaryContainer: "#fd761a",
  error: "#ba1a1a",
};

const SPACE = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, margin: 20 };
const RADIUS = { md: 16, lg: 32, full: 999 };

// Escala tipográfica del mockup (size / lineHeight / weight / letterSpacing).
const TYPE = {
  headlineLgMobile: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -0.48,
  },
  headlineSm: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    letterSpacing: -0.18,
  },
  bodyMd: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
  bodySm: { fontSize: 12, lineHeight: 18, fontWeight: "400" },
  labelLg: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: 0.14,
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 0.24,
  },
  labelSm: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
};

const INACTIVE_BAR = "rgba(190, 200, 210, 0.4)"; // outline-variant / 40

/* ------------------------------------------------------------------ */
/* Validación                                                          */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMBER_OR_SYMBOL_RE = /[0-9!@#$%^&*(),.?":{}|<>]/;
const UPPERCASE_RE = /[A-Z]/;

const isEmailValid = (value) => EMAIL_RE.test(value.trim());

const passwordRules = (value) => ({
  length: value.length >= 8,
  symbol: NUMBER_OR_SYMBOL_RE.test(value),
  upper: UPPERCASE_RE.test(value),
});

/* ------------------------------------------------------------------ */
/* Iconos (sustitutos de Material Symbols, sin dependencias)           */
/* ------------------------------------------------------------------ */

/**
 * Iconos geométricos dibujados con Views. Se pintan en un lienzo de 20x20 y se
 * escalan a `size`. Cambia sólo este componente si prefieres @expo/vector-icons.
 */
function Icon({ name, size = 20, color = COLORS.outline, stroke = 1.9 }) {
  const k = size / 20;
  const s = (n) => n * k;
  const line = Math.max(1, s(stroke));
  const bar = {
    position: "absolute",
    height: line,
    borderRadius: line / 2,
    backgroundColor: color,
  };

  const frame = {
    width: size,
    height: size,
    alignItems: "center",
    justifyContent: "center",
  };

  switch (name) {
    case "chevronLeft":
      return (
        <View style={frame}>
          <View
            style={{
              width: s(9),
              height: s(9),
              borderLeftWidth: line,
              borderBottomWidth: line,
              borderColor: color,
              transform: [{ rotate: "-45deg" }],
              marginLeft: s(1.5),
            }}
          />
        </View>
      );

    case "arrowRight":
      return (
        <View style={frame}>
          <View
            style={[bar, { width: s(12), left: s(3), top: s(10) - line / 2 }]}
          />
          <View
            style={{
              position: "absolute",
              width: s(7),
              height: s(7),
              left: s(8.6),
              top: s(6.5),
              borderTopWidth: line,
              borderRightWidth: line,
              borderColor: color,
              transform: [{ rotate: "45deg" }],
            }}
          />
        </View>
      );

    case "check":
      return (
        <View style={frame}>
          <View
            style={[
              bar,
              {
                width: s(5.6),
                left: s(3.2),
                top: s(11.1),
                transform: [{ rotate: "45deg" }],
              },
            ]}
          />
          <View
            style={[
              bar,
              {
                width: s(12),
                left: s(6),
                top: s(9.5),
                transform: [{ rotate: "-48deg" }],
              },
            ]}
          />
        </View>
      );

    case "close":
      return (
        <View style={frame}>
          <View
            style={[
              bar,
              {
                width: s(14.1),
                left: s(2.9),
                top: s(9.05),
                transform: [{ rotate: "45deg" }],
              },
            ]}
          />
          <View
            style={[
              bar,
              {
                width: s(14.1),
                left: s(2.9),
                top: s(9.05),
                transform: [{ rotate: "-45deg" }],
              },
            ]}
          />
        </View>
      );

    case "person":
      return (
        <View style={frame}>
          <View
            style={{
              position: "absolute",
              top: s(3),
              width: s(7),
              height: s(7),
              borderRadius: s(3.5),
              borderWidth: line,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: s(11.5),
              width: s(13),
              height: s(7),
              borderWidth: line,
              borderBottomWidth: 0,
              borderTopLeftRadius: s(6.5),
              borderTopRightRadius: s(6.5),
              borderColor: color,
            }}
          />
        </View>
      );

    case "lock":
      return (
        <View style={frame}>
          <View
            style={{
              position: "absolute",
              top: s(3),
              width: s(8),
              height: s(8),
              borderWidth: line,
              borderBottomWidth: 0,
              borderTopLeftRadius: s(4),
              borderTopRightRadius: s(4),
              borderColor: color,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: s(9),
              width: s(12),
              height: s(9),
              borderRadius: s(2.5),
              borderWidth: line,
              borderColor: color,
            }}
          />
        </View>
      );

    case "eye":
      return (
        <View style={frame}>
          <View
            style={{
              position: "absolute",
              top: s(4.5),
              width: s(17),
              height: s(11),
              borderWidth: line,
              borderRadius: s(5.5),
              borderColor: color,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: s(7.75),
              width: s(4.5),
              height: s(4.5),
              borderRadius: s(2.25),
              backgroundColor: color,
            }}
          />
        </View>
      );

    case "mail":
      return (
        <View style={frame}>
          <View
            style={{
              position: "absolute",
              top: s(4),
              width: s(16),
              height: s(12),
              borderWidth: line,
              borderRadius: s(2),
              borderColor: color,
            }}
          />
          <View
            style={[
              bar,
              {
                width: s(6.3),
                left: s(4.3),
                top: s(8),
                transform: [{ rotate: "45deg" }],
              },
            ]}
          />
          <View
            style={[
              bar,
              {
                width: s(6.3),
                left: s(9.4),
                top: s(8),
                transform: [{ rotate: "-45deg" }],
              },
            ]}
          />
        </View>
      );

    case "cloud":
      return (
        <View style={frame}>
          <View
            style={{
              position: "absolute",
              top: s(7),
              left: s(2.5),
              width: s(6),
              height: s(6),
              borderRadius: s(3),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: s(4),
              left: s(6),
              width: s(9),
              height: s(9),
              borderRadius: s(4.5),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: s(6),
              left: s(11.5),
              width: s(7),
              height: s(7),
              borderRadius: s(3.5),
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: s(9),
              left: s(2.5),
              width: s(16),
              height: s(6),
              borderRadius: s(3),
              backgroundColor: color,
            }}
          />
        </View>
      );

    case "spark":
      return (
        <View style={frame}>
          <View
            style={{
              position: "absolute",
              top: s(6.5),
              left: s(6.5),
              width: s(7),
              height: s(7),
              backgroundColor: color,
              transform: [{ rotate: "45deg" }],
            }}
          />
          <View
            style={{
              position: "absolute",
              top: s(3),
              left: s(13),
              width: s(3),
              height: s(3),
              borderRadius: s(1.5),
              backgroundColor: color,
            }}
          />
        </View>
      );

    default:
      return <View style={frame} />;
  }
}

/** Círculo de estado: radio vacío o check relleno (radio_button_unchecked / check_circle). */
function StatusDot({ checked, size = 16, color = COLORS.tertiaryContainer }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: checked ? color : COLORS.outline,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked ? (
        <Icon name="check" size={size * 0.72} color={color} stroke={2.2} />
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Campo de texto reutilizable                                         */
/* ------------------------------------------------------------------ */

function TextField({
  label,
  hint,
  hintColor,
  icon,
  iconColor,
  style,
  inputStyle,
  ...inputProps
}) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? (
          <Text style={[styles.hint, hintColor ? { color: hintColor } : null]}>
            {hint}
          </Text>
        ) : null}
      </View>
      <View style={styles.inputShell}>
        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : null, inputStyle]}
          placeholderTextColor={COLORS.outlineVariant}
          selectionColor={COLORS.primary}
          {...inputProps}
        />
        {icon ? (
          <View style={styles.inputIcon} pointerEvents="none">
            <Icon name={icon} size={20} color={iconColor || COLORS.outline} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Pantalla                                                            */
/* ------------------------------------------------------------------ */

/**
 * Pantalla de registro.
 *
 * Props (todas opcionales):
 *  - onBack(): se llama al pulsar la flecha de volver; por defecto `router.back()`.
 *  - onLogin(): se llama al pulsar "Inicia sesión".
 *  - onSubmit({ alias, email, password }): recibe los datos ya validados;
 *    por defecto sólo hace `console.log`.
 */
export default function RegistroScreen({
  onBack = undefined,
  onLogin = undefined,
  onSubmit = undefined,
}) {
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const emailValid = isEmailValid(email);
  const rules = passwordRules(password);
  const score =
    Number(rules.length) + Number(rules.symbol) + Number(rules.upper);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const canSubmit =
    alias.trim().length > 0 &&
    emailValid &&
    score === 3 &&
    passwordsMatch &&
    terms;

  /* --- email: estado en vivo --- */
  let emailHint = "Requerido";
  let emailHintColor = COLORS.outline;
  let emailIcon = "mail";
  let emailIconColor = COLORS.outline;
  if (email.length > 0) {
    if (emailValid) {
      emailHint = "Válido";
      emailHintColor = COLORS.tertiary;
      emailIcon = "check";
      emailIconColor = COLORS.tertiaryContainer;
    } else {
      emailHint = "Inválido";
      emailHintColor = COLORS.error;
      emailIcon = "close";
      emailIconColor = COLORS.error;
    }
  }

  /* --- contraseña: medidor --- */
  const strength = [
    { label: "Seguridad", color: COLORS.outline, bar: null },
    { label: "Débil", color: COLORS.secondary, bar: COLORS.secondaryContainer },
    { label: "Buena", color: COLORS.primary, bar: COLORS.primaryContainer },
    {
      label: "Excelente",
      color: COLORS.tertiary,
      bar: COLORS.tertiaryContainer,
    },
  ][score];

  /* --- confirmación --- */
  let matchHint = "Sin verificar";
  let matchHintColor = COLORS.outline;
  let matchIcon = "lock";
  let matchIconColor = COLORS.outline;
  if (confirmPassword.length > 0) {
    if (passwordsMatch) {
      matchHint = "Coincide";
      matchHintColor = COLORS.tertiary;
      matchIcon = "check";
      matchIconColor = COLORS.tertiaryContainer;
    } else {
      matchHint = "No coincide";
      matchHintColor = COLORS.error;
      matchIcon = "close";
      matchIconColor = COLORS.error;
    }
  }

  const requirements = [
    { key: "length", label: "Mínimo 8 caracteres", done: rules.length },
    {
      key: "symbol",
      label: "Al menos un número o símbolo especial",
      done: rules.symbol,
    },
    { key: "upper", label: "Una letra mayúscula", done: rules.upper },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const payload = {
      alias: alias.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    if (onSubmit) {
      onSubmit(payload);
      return;
    }

    // Punto de integración con el backend (src/Backend/supabase.js):
    //
    //   import { supabase } from '@/Backend/supabase';
    //   const { data, error } = await supabase.auth.signUp({
    //     email: payload.email,
    //     password: payload.password,
    //     options: { data: { alias: payload.alias } },
    //   });
    //
    console.log("[registro] alta solicitada", payload);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
          onPress={handleBack}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
        >
          <Icon name="chevronLeft" size={20} color={COLORS.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Sign Up
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={64}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heading}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>
              Comienza tu viaje hacia una vida organizada junto a Octy
            </Text>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Icon name="spark" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.heroText}>
              ¡Hola! Soy <Text style={styles.heroStrong}>Octy</Text>. Configura
              tus credenciales para empezar a sincronizar tus tentáculos
              productivos.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="¿Cómo te llamará Octy?"
              hint="Nombre o alias"
              icon="person"
              value={alias}
              onChangeText={setAlias}
              placeholder="Ej. Marina Soler"
              autoComplete="name"
              textContentType="name"
              autoCapitalize="words"
              returnKeyType="next"
            />

            <TextField
              label="Correo Electrónico"
              hint={emailHint}
              hintColor={emailHintColor}
              icon={emailIcon}
              iconColor={emailIconColor}
              value={email}
              onChangeText={setEmail}
              placeholder="marina@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />

            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Contraseña</Text>
                <Text style={[styles.hint, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>

              <View style={styles.inputShell}>
                <TextInput
                  style={[styles.input, styles.inputWithRightButton]}
                  placeholder="Introduce una contraseña segura"
                  placeholderTextColor={COLORS.outlineVariant}
                  selectionColor={COLORS.primary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    passwordVisible
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  hitSlop={8}
                  onPress={() => setPasswordVisible((visible) => !visible)}
                  style={({ pressed }) => [
                    styles.eyeButton,
                    pressed && styles.eyeButtonPressed,
                  ]}
                >
                  <Icon
                    name="eye"
                    size={20}
                    color={passwordVisible ? COLORS.onSurface : COLORS.outline}
                  />
                </Pressable>
              </View>

              <View style={styles.strengthTrack}>
                {[0, 1, 2].map((index) => (
                  <View
                    key={index}
                    style={[
                      styles.strengthSegment,
                      {
                        backgroundColor:
                          index < score && strength.bar
                            ? strength.bar
                            : INACTIVE_BAR,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.requirementsCard}>
                {requirements.map((item) => (
                  <View key={item.key} style={styles.requirementRow}>
                    <StatusDot checked={item.done} />
                    <Text
                      style={[
                        styles.requirementText,
                        item.done ? { color: COLORS.tertiary } : null,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <TextField
              label="Confirmar Contraseña"
              hint={matchHint}
              hintColor={matchHintColor}
              icon={matchIcon}
              iconColor={matchIconColor}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repite tu contraseña"
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
            />

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: terms }}
              accessibilityLabel="Acepto los Términos de Servicio y la Política de Privacidad"
              onPress={() => setTerms((checked) => !checked)}
              style={styles.termsRow}
            >
              <View style={[styles.checkbox, terms && styles.checkboxChecked]}>
                {terms ? (
                  <Icon
                    name="check"
                    size={16}
                    color={COLORS.onPrimary}
                    stroke={2.2}
                  />
                ) : null}
              </View>
              <Text style={styles.termsText}>
                Acepto los{" "}
                <Text style={styles.termsLink}>Términos de Servicio</Text> y la{" "}
                <Text style={styles.termsLink}>Política de Privacidad</Text> de
                Octopus.
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
              accessibilityLabel="Crear Cuenta"
              disabled={!canSubmit}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
                pressed && canSubmit && styles.submitButtonPressed,
              ]}
            >
              <Text style={styles.submitLabel}>Crear Cuenta</Text>
              <Icon
                name="arrowRight"
                size={18}
                color={COLORS.onPrimary}
                stroke={2}
              />
            </Pressable>
          </View>

          <View style={styles.syncCard}>
            <View style={styles.syncIcon}>
              <Icon name="cloud" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.syncBody}>
              <Text style={styles.syncTitle}>Sincronización Silenciosa</Text>
              <Text style={styles.syncText}>
                Tus datos se sincronizan de forma segura en la nube para
                mantener a salvo tus proyectos y rachas.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Inicia sesión"
              hitSlop={6}
              onPress={onLogin || (() => {})}
              style={({ pressed }) => pressed && styles.footerLinkPressed}
            >
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Estilos                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },

  header: {
    height: 64,
    paddingHorizontal: SPACE.margin,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(250, 248, 255, 0.96)",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    zIndex: 10,
  },
  headerTitle: {
    ...TYPE.headlineSm,
    flex: 1,
    textAlign: "center",
    color: COLORS.onSurface,
  },
  headerButton: {
    width: 44,
    height: 44,
    marginLeft: -SPACE.xs,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonPressed: { backgroundColor: COLORS.surfaceContainerHigh },
  headerSpacer: { width: 44 },

  body: { flex: 1 },
  content: {
    paddingHorizontal: SPACE.margin,
    paddingTop: SPACE.md,
    paddingBottom: SPACE.xl + SPACE.md,
  },

  heading: { marginBottom: SPACE.lg },
  title: { ...TYPE.headlineLgMobile, color: COLORS.onSurface },
  subtitle: {
    ...TYPE.bodyMd,
    color: COLORS.onSurfaceVariant,
    marginTop: SPACE.xs,
  },

  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.sm,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.lg,
    padding: SPACE.md,
    marginBottom: SPACE.md,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  heroIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(14, 165, 233, 0.2)", // primary-container / 20
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: { ...TYPE.bodySm, flex: 1, color: COLORS.onSurfaceVariant },
  heroStrong: { color: COLORS.onSurface, fontWeight: "600" },

  form: { gap: SPACE.md },

  field: { gap: SPACE.xs },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { ...TYPE.labelMd, color: COLORS.onSurface },
  hint: { ...TYPE.labelSm, color: COLORS.outline },

  inputShell: { justifyContent: "center" },
  input: {
    height: 48,
    paddingHorizontal: SPACE.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainerLowest,
    ...TYPE.bodyMd,
    color: COLORS.onSurface,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  inputWithIcon: { paddingRight: 48 },
  inputWithRightButton: { paddingRight: 52 },
  inputIcon: {
    position: "absolute",
    right: SPACE.md,
    alignItems: "center",
    justifyContent: "center",
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeButtonPressed: { backgroundColor: COLORS.surfaceContainerHigh },

  strengthTrack: {
    flexDirection: "row",
    gap: SPACE.xs,
    height: 6,
    marginTop: SPACE.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainerHigh,
    overflow: "hidden",
  },
  strengthSegment: { flex: 1, borderRadius: RADIUS.full },

  requirementsCard: {
    gap: 6,
    marginTop: SPACE.xs,
    padding: SPACE.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceContainerLow,
  },
  requirementRow: { flexDirection: "row", alignItems: "center", gap: SPACE.xs },
  requirementText: { ...TYPE.bodySm, flex: 1, color: COLORS.onSurfaceVariant },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACE.sm,
    marginTop: SPACE.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 2,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: COLORS.primaryContainer },
  termsText: {
    ...TYPE.bodySm,
    flex: 1,
    lineHeight: 16,
    color: COLORS.onSurfaceVariant,
  },
  termsLink: { color: COLORS.primary, fontWeight: "600" },

  submitButton: {
    height: 48,
    marginTop: SPACE.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACE.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryContainer,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  submitButtonDisabled: { opacity: 0.4 },
  submitButtonPressed: { transform: [{ scale: 0.97 }] },
  submitLabel: { ...TYPE.labelLg, color: COLORS.onPrimary },

  syncCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACE.sm,
    marginTop: SPACE.lg,
    padding: SPACE.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceContainer,
  },
  syncIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
  },
  syncBody: { flex: 1 },
  syncTitle: { ...TYPE.labelMd, color: COLORS.onSurface },
  syncText: { ...TYPE.bodySm, marginTop: 2, color: COLORS.onSurfaceVariant },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACE.xs,
    paddingVertical: SPACE.lg,
  },
  footerText: { ...TYPE.bodyMd, color: COLORS.onSurfaceVariant },
  footerLink: { ...TYPE.labelLg, color: COLORS.primary },
  footerLinkPressed: { opacity: 0.6 },
});
