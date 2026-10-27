import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  cerrarSesion,
  escucharCambiosDeSesion,
  iniciarSesion,
  obtenerSesion,
  registrarUsuario,
} from "../src/Backend";

const colores = {
  fondo: "#faf8ff",
  tarjeta: "#ffffff",
  suave: "#f2f3ff",
  texto: "#131b2e",
  secundario: "#3e4850",
  tenue: "#6e7881",
  primario: "#0ea5e9",
  verde: "#006c49",
  error: "#ba1a1a",
};

function textoError(error, alternativa) {
  return error instanceof Error ? error.message : alternativa;
}

export default function Index() {
  const [modo, setModo] = useState("login");
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [sesion, setSesion] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    let activa = true;
    const subscription = escucharCambiosDeSesion((nuevaSesion) => {
      if (activa) setSesion(nuevaSesion);
    });

    obtenerSesion()
      .then(({ data, error }) => {
        if (!activa) return;
        if (error) {
          setMensaje({ tipo: "error", texto: error.message });
          return;
        }
        setSesion(data.session);
      })
      .catch((error) => {
        if (activa) {
          setMensaje({
            tipo: "error",
            texto: textoError(error, "No se pudo consultar la sesión."),
          });
        }
      })
      .finally(() => {
        if (activa) setCargandoSesion(false);
      });

    return () => {
      activa = false;
      subscription.unsubscribe();
    };
  }, []);

  async function enviarFormulario() {
    if (!correo.trim() || !password) {
      setMensaje({ tipo: "error", texto: "Escribe tu correo y contraseña." });
      return;
    }

    if (
      modo === "registro" &&
      (!usuario.trim() || !nombre.trim() || password.length < 6)
    ) {
      setMensaje({
        tipo: "error",
        texto:
          "Completa tu usuario y nombre. La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    setEnviando(true);
    setMensaje(null);

    try {
      const resultado =
        modo === "registro"
          ? await registrarUsuario({ usuario, nombre, correo, password })
          : await iniciarSesion({ correo, password });

      if (resultado.error) {
        setMensaje({ tipo: "error", texto: resultado.error.message });
        return;
      }

      if (modo === "registro" && !resultado.data.session) {
        setModo("login");
        setMensaje({
          tipo: "exito",
          texto:
            "Cuenta creada. Revisa tu correo para confirmar la dirección antes de iniciar sesión.",
        });
      } else {
        setSesion(resultado.data.session);
        setMensaje(null);
      }
      setPassword("");
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: textoError(error, "Ocurrió un error inesperado."),
      });
    } finally {
      setEnviando(false);
    }
  }

  async function salir() {
    setEnviando(true);
    setMensaje(null);
    try {
      const { error } = await cerrarSesion();
      if (error) {
        setMensaje({ tipo: "error", texto: error.message });
      } else {
        setSesion(null);
        setMensaje({ tipo: "exito", texto: "Sesión cerrada." });
      }
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: textoError(error, "No se pudo cerrar la sesión."),
      });
    } finally {
      setEnviando(false);
    }
  }

  if (cargandoSesion) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={colores.primario} />
        <Text style={styles.textoCarga}>Comprobando sesión...</Text>
      </View>
    );
  }

  const metadatos = sesion?.user?.user_metadata ?? {};
  const nombrePerfil =
    typeof metadatos.nombre === "string" ? metadatos.nombre : "";

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.encabezado}>
          <View style={styles.logo}>
            <Text style={styles.logoTexto}>∞</Text>
          </View>
          <Text style={styles.encabezadoTexto}>
            {sesion ? "Mi cuenta" : "Iniciar sesión"}
          </Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>
              {sesion ? (nombrePerfil || "O").charAt(0).toUpperCase() : "O"}
            </Text>
          </View>
        </View>

        <View style={styles.tarjetaBienvenida}>
          <View style={styles.etiqueta}>
            <View style={styles.puntoActivo} />
            <Text style={styles.etiquetaTexto}>
              {sesion ? "SANTUARIO ACTIVO" : "SANTUARIO OCTOPUS"}
            </Text>
          </View>
          <Text style={styles.titulo}>
            {sesion
              ? `¡Hola${nombrePerfil ? `, ${nombrePerfil}` : ""}!`
              : modo === "registro"
                ? "Únete a Octopus"
                : "Bienvenido de vuelta"}
          </Text>
          <Text style={styles.descripcion}>
            {sesion
              ? "Tu sesión está activa. Sigue cuidando de tus hábitos."
              : "Ingresa a tu santuario de productividad y cuida de Octy."}
          </Text>
          <View style={styles.mascota}>
            <Text style={styles.mascotaIcono}>🐙</Text>
            <Text style={styles.mascotaNombre}>Octy</Text>
          </View>
        </View>

        <View style={styles.tarjetaFormulario}>
          {sesion ? (
            <>
              <Text style={styles.tituloFormulario}>Sesión iniciada</Text>
              <Text style={styles.descripcionSesion}>
                {sesion.user.email ?? "Cuenta de Octopus"}
              </Text>
              <Pressable
                accessibilityRole="button"
                disabled={enviando}
                onPress={salir}
                style={({ pressed }) => [
                  styles.boton,
                  pressed && styles.botonPresionado,
                  enviando && styles.botonDeshabilitado,
                ]}
              >
                {enviando ? (
                  <ActivityIndicator color={colores.tarjeta} />
                ) : (
                  <Text style={styles.textoBoton}>Cerrar sesión</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.tituloFormulario}>
                {modo === "registro" ? "Crear cuenta" : "Accede a tu cuenta"}
              </Text>
              {modo === "registro" && (
                <>
                  <Campo
                    label="Usuario"
                    placeholder="Tu usuario"
                    value={usuario}
                    onChangeText={setUsuario}
                    autoCapitalize="none"
                  />
                  <Campo
                    label="Nombre"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChangeText={setNombre}
                    autoCapitalize="words"
                  />
                </>
              )}
              <Campo
                label="Correo electrónico"
                placeholder="alex@ejemplo.com"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <View style={styles.grupoCampo}>
                <Text style={styles.etiquetaCampo}>Contraseña</Text>
                <View style={styles.filaPassword}>
                  <TextInput
                    accessibilityLabel="Contraseña"
                    autoCapitalize="none"
                    autoComplete={
                      modo === "registro" ? "new-password" : "password"
                    }
                    onChangeText={setPassword}
                    onSubmitEditing={enviarFormulario}
                    placeholder="••••••••"
                    placeholderTextColor={colores.tenue}
                    secureTextEntry={!mostrarPassword}
                    style={styles.inputPassword}
                    value={password}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      mostrarPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    onPress={() => setMostrarPassword(!mostrarPassword)}
                    style={styles.botonOjo}
                  >
                    <Text style={styles.textoOjo}>
                      {mostrarPassword ? "Ocultar" : "Ver"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.avisoSeguridad}>
                <Text style={styles.avisoIcono}>✓</Text>
                <View style={styles.avisoContenido}>
                  <Text style={styles.avisoTitulo}>Autenticación protegida</Text>
                  <Text style={styles.avisoTexto}>
                    Tu cuenta se gestiona de forma segura con Supabase Auth.
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={enviando}
                onPress={enviarFormulario}
                style={({ pressed }) => [
                  styles.boton,
                  pressed && styles.botonPresionado,
                  enviando && styles.botonDeshabilitado,
                ]}
              >
                {enviando ? (
                  <ActivityIndicator color={colores.tarjeta} />
                ) : (
                  <Text style={styles.textoBoton}>
                    {modo === "registro" ? "Crear cuenta" : "Iniciar sesión"}
                  </Text>
                )}
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={enviando}
                onPress={() => {
                  setModo(modo === "registro" ? "login" : "registro");
                  setMensaje(null);
                }}
                style={styles.enlace}
              >
                <Text style={styles.textoEnlace}>
                  {modo === "registro"
                    ? "¿Ya tienes una cuenta? Inicia sesión"
                    : "¿No tienes una cuenta? Regístrate aquí"}
                </Text>
              </Pressable>
            </>
          )}

          {mensaje && (
            <Text
              accessibilityLiveRegion="polite"
              style={
                mensaje.tipo === "error" ? styles.error : styles.exito
              }
            >
              {mensaje.texto}
            </Text>
          )}
        </View>

        <View style={styles.pie}>
          <Text style={styles.pieIcono}>🌱</Text>
          <Text style={styles.pieTexto}>OCTOPUS HABIT ENGINE</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({
  label,
  placeholder,
  value,
  onChangeText,
  ...inputProps
}) {
  return (
    <View style={styles.grupoCampo}>
      <Text style={styles.etiquetaCampo}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colores.tenue}
        style={styles.input}
        value={value}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 48 : 24,
    paddingBottom: 28,
  },
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.fondo,
  },
  textoCarga: {
    marginTop: 12,
    color: colores.secundario,
    fontSize: 15,
  },
  encabezado: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logo: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colores.primario,
  },
  logoTexto: {
    color: colores.tarjeta,
    fontSize: 22,
    fontWeight: "700",
  },
  encabezadoTexto: {
    flex: 1,
    marginLeft: 10,
    color: colores.texto,
    fontSize: 18,
    fontWeight: "700",
  },
  avatar: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "#006591",
  },
  avatarTexto: {
    color: colores.tarjeta,
    fontSize: 15,
    fontWeight: "700",
  },
  tarjetaBienvenida: {
    position: "relative",
    overflow: "hidden",
    minHeight: 190,
    marginBottom: 20,
    padding: 22,
    borderRadius: 24,
    backgroundColor: "#f2f3ff",
  },
  etiqueta: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "#c9e6ff",
  },
  puntoActivo: {
    width: 7,
    height: 7,
    marginRight: 7,
    borderRadius: 4,
    backgroundColor: colores.primario,
  },
  etiquetaTexto: {
    color: "#004c6e",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  titulo: {
    maxWidth: "78%",
    marginTop: 13,
    color: colores.texto,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  descripcion: {
    maxWidth: "76%",
    marginTop: 7,
    color: colores.secundario,
    fontSize: 14,
    lineHeight: 21,
  },
  mascota: {
    position: "absolute",
    right: 18,
    bottom: 20,
    width: 74,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 37,
    backgroundColor: colores.tarjeta,
    elevation: 3,
    shadowColor: "#131b2e",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mascotaIcono: {
    fontSize: 30,
  },
  mascotaNombre: {
    marginTop: -2,
    color: "#006591",
    fontSize: 10,
    fontWeight: "700",
  },
  tarjetaFormulario: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: colores.tarjeta,
    elevation: 3,
    shadowColor: "#131b2e",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tituloFormulario: {
    marginBottom: 18,
    color: colores.texto,
    fontSize: 19,
    fontWeight: "700",
  },
  descripcionSesion: {
    marginBottom: 18,
    color: colores.secundario,
    fontSize: 15,
  },
  grupoCampo: {
    marginBottom: 15,
  },
  etiquetaCampo: {
    marginBottom: 7,
    color: colores.secundario,
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: colores.suave,
    color: colores.texto,
    fontSize: 15,
  },
  filaPassword: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: 25,
    backgroundColor: colores.suave,
  },
  inputPassword: {
    flex: 1,
    height: "100%",
    color: colores.texto,
    fontSize: 15,
  },
  botonOjo: {
    minWidth: 48,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  textoOjo: {
    color: colores.tenue,
    fontSize: 12,
    fontWeight: "700",
  },
  avisoSeguridad: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 17,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#f2f3ff",
  },
  avisoIcono: {
    width: 28,
    height: 28,
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: "#6ffbbe",
    color: "#002113",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 28,
    textAlign: "center",
  },
  avisoContenido: {
    flex: 1,
    marginLeft: 10,
  },
  avisoTitulo: {
    color: colores.verde,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  avisoTexto: {
    marginTop: 3,
    color: colores.secundario,
    fontSize: 11,
    lineHeight: 16,
  },
  boton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    borderRadius: 25,
    backgroundColor: colores.primario,
  },
  botonPresionado: {
    opacity: 0.85,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: colores.tarjeta,
    fontSize: 15,
    fontWeight: "700",
  },
  enlace: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 2,
  },
  textoEnlace: {
    color: "#006591",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  error: {
    marginTop: 14,
    color: colores.error,
    fontSize: 13,
    lineHeight: 19,
  },
  exito: {
    marginTop: 14,
    color: colores.verde,
    fontSize: 13,
    lineHeight: 19,
  },
  pie: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  pieIcono: {
    marginRight: 6,
    fontSize: 13,
  },
  pieTexto: {
    color: colores.tenue,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
});
